const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const PORT = Number(process.env.PORT) || 8787;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const WEB_ROOT = path.resolve(__dirname, "..", "outputs", "morse-pocket");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : __dirname;
const DATA_FILE = path.join(DATA_DIR, "data.json");
const clients = new Map();
const randomQueue = [];
const randomPairs = new Map();
const lastPartners = new Map();

let data = { direct: [], space: [], accounts: [], sessions: [] };
try {
  data = { ...data, ...JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) };
} catch {}

function saveData() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function verifyGoogleCredential(credential) {
  if (!GOOGLE_CLIENT_ID) throw new Error("google-client-id-not-configured");
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email_verified) throw new Error("invalid-google-account");
  return payload;
}

function createSession(account) {
  const token = crypto.randomBytes(32).toString("hex");
  data.sessions = data.sessions.filter(item => item.googleSub !== account.googleSub);
  data.sessions.push({ token, googleSub: account.googleSub, createdAt: Date.now() });
  saveData();
  return token;
}

function sessionAccount(req, url) {
  const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "";
  const token = bearer || url.searchParams.get("token") || "";
  const session = data.sessions.find(item => item.token === token);
  return session ? data.accounts.find(account => account.googleSub === session.googleSub) : null;
}

function publicAccount(account) {
  return { nickname: account.nickname, signalId: account.signalId };
}

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(body));
}

function emit(userId, type, payload = {}) {
  const streams = clients.get(userId);
  if (!streams) return;
  const message = `event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`;
  streams.forEach(stream => stream.write(message));
}

function pairUsers(a, b) {
  lastPartners.delete(a);
  lastPartners.delete(b);
  randomPairs.set(a, b);
  randomPairs.set(b, a);
  emit(a, "random-connected", { partner: "RANDOM SIGNAL" });
  emit(b, "random-connected", { partner: "RANDOM SIGNAL" });
}

function leaveRandom(userId, allowLastSignal = true) {
  const queueIndex = randomQueue.indexOf(userId);
  if (queueIndex >= 0) randomQueue.splice(queueIndex, 1);
  const partner = randomPairs.get(userId);
  if (!partner) return;
  randomPairs.delete(userId);
  randomPairs.delete(partner);
  if (allowLastSignal) {
    lastPartners.set(userId, { partner });
    lastPartners.set(partner, { partner: userId });
  }
  emit(partner, "random-disconnected", {});
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function localDay() {
  return new Date().toISOString().slice(0, 10);
}

function serveFile(req, res) {
  const requested = new URL(req.url, "http://localhost").pathname;
  const filePath = path.resolve(WEB_ROOT, requested === "/" ? "index.html" : `.${requested}`);
  if (!filePath.startsWith(WEB_ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    json(res, 404, { error: "Not found" });
    return;
  }
  const ext = path.extname(filePath);
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
  res.writeHead(200, { "Content-Type": `${types[ext] || "application/octet-stream"}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/health") return json(res, 200, { ok: true, googleConfigured: Boolean(GOOGLE_CLIENT_ID), googleClientId: GOOGLE_CLIENT_ID });
  if (req.method === "GET" && url.pathname === "/api/auth/config") return json(res, 200, { googleClientId: GOOGLE_CLIENT_ID });
  if (req.method === "POST" && url.pathname === "/api/auth/google") {
    try {
      const { credential, nickname } = await readBody(req);
      const google = await verifyGoogleCredential(credential);
      const existing = data.accounts.find(account => account.googleSub === google.sub);
      if (existing) {
        const token = createSession(existing);
        return json(res, 200, { token, account: publicAccount(existing) });
      }
      if (!nickname?.trim() || nickname.trim().length < 2) return json(res, 409, { error: "nickname-required" });
      if (data.accounts.some(account => account.nickname.toLowerCase() === nickname.trim().toLowerCase())) return json(res, 409, { error: "nickname-taken" });
      const account = {
        googleSub: google.sub,
        email: google.email,
        nickname: nickname.trim(),
        signalId: `SIGNAL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        createdAt: Date.now()
      };
      data.accounts.push(account);
      const token = createSession(account);
      return json(res, 200, { token, account: publicAccount(account) });
    } catch (error) {
      return json(res, 401, { error: error.message || "google-verification-failed" });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const account = sessionAccount(req, url);
    return account ? json(res, 200, { account: publicAccount(account) }) : json(res, 401, { error: "auth-required" });
  }

  const account = sessionAccount(req, url);
  if (url.pathname.startsWith("/api/") && !account) return json(res, 401, { error: "auth-required" });
  if (req.method === "GET" && url.pathname === "/api/events") {
    const userId = account.signalId;
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });
    res.write(`event: ready\ndata: ${JSON.stringify({ userId })}\n\n`);
    if (!clients.has(userId)) clients.set(userId, new Set());
    clients.get(userId).add(res);
    const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 20000);
    req.on("close", () => {
      clearInterval(heartbeat);
      clients.get(userId)?.delete(res);
      if (!clients.get(userId)?.size) clients.delete(userId);
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/direct/send") {
    const { to, message } = await readBody(req);
    const from = account.signalId;
    if (!to || !message) return json(res, 400, { error: "to and message required" });
    const item = { id: crypto.randomUUID(), from, to, message, createdAt: Date.now() };
    data.direct.push(item);
    data.direct = data.direct.slice(-2000);
    saveData();
    emit(to, "direct-message", item);
    return json(res, 200, item);
  }
  if (req.method === "GET" && url.pathname === "/api/direct/history") {
    const user = account.signalId;
    const friend = url.searchParams.get("friend");
    const messages = data.direct.filter(item => (item.from === user && item.to === friend) || (item.from === friend && item.to === user)).slice(-200);
    return json(res, 200, { messages });
  }
  if (req.method === "GET" && url.pathname === "/api/direct/inbox") {
    const user = account.signalId;
    return json(res, 200, { messages: data.direct.filter(item => item.to === user).slice(-500) });
  }

  if (req.method === "POST" && url.pathname === "/api/space/send") {
    const { text, day = localDay() } = await readBody(req);
    const sender = account.signalId;
    if (!text) return json(res, 400, { error: "text required" });
    if (data.space.some(item => item.sender === sender && item.day === day)) return json(res, 409, { error: "daily-limit" });
    const signal = { id: crypto.randomUUID(), sender, text, day, createdAt: Date.now() };
    data.space.push(signal);
    data.space = data.space.slice(-5000);
    saveData();
    return json(res, 200, signal);
  }
  if (req.method === "GET" && url.pathname === "/api/space/random") {
    const exclude = account.signalId;
    const choices = data.space.filter(item => item.sender !== exclude);
    if (!choices.length) return json(res, 404, { error: "no-signals" });
    return json(res, 200, choices[Math.floor(Math.random() * choices.length)]);
  }

  if (req.method === "POST" && url.pathname === "/api/random/join") {
    const userId = account.signalId;
    leaveRandom(userId, false);
    const partner = randomQueue.find(id => id !== userId);
    if (partner) {
      randomQueue.splice(randomQueue.indexOf(partner), 1);
      pairUsers(userId, partner);
      return json(res, 200, { status: "connected" });
    }
    if (!randomQueue.includes(userId)) randomQueue.push(userId);
    return json(res, 200, { status: "searching" });
  }
  if (req.method === "POST" && url.pathname === "/api/random/leave") {
    const userId = account.signalId;
    leaveRandom(userId, true);
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/random/send") {
    const { message } = await readBody(req);
    const userId = account.signalId;
    const partner = randomPairs.get(userId);
    if (!partner) return json(res, 409, { error: "not-connected" });
    emit(partner, "random-message", { message });
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/random/last") {
    const { message } = await readBody(req);
    const userId = account.signalId;
    const last = lastPartners.get(userId);
    if (!last) return json(res, 410, { error: "unavailable" });
    emit(last.partner, "random-last", { message });
    lastPartners.delete(userId);
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/random/skip-last") {
    const userId = account.signalId;
    lastPartners.delete(userId);
    return json(res, 200, { ok: true });
  }

  if (url.pathname.startsWith("/api/")) return json(res, 404, { error: "Unknown API" });
  serveFile(req, res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`MORSE CHAT server running at http://0.0.0.0:${PORT}`);
});
