const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { MongoClient } = require("mongodb");

const PORT = Number(process.env.PORT) || 8787;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const WEB_ROOT = path.resolve(__dirname, "..", "outputs", "morse-pocket");
const clients = new Map();
const randomQueue = [];
const randomPairs = new Map();
const lastPartners = new Map();

let colAccounts, colSessions, colDirect, colSpace, mongoDb;

async function connectMongo() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) throw new Error("MONGO_URL environment variable is not set");
  const client = new MongoClient(mongoUrl);
  await client.connect();
  mongoDb = client.db();
  colAccounts = mongoDb.collection("accounts");
  colSessions = mongoDb.collection("sessions");
  colDirect = mongoDb.collection("direct_messages");
  colSpace = mongoDb.collection("space_signals");
  await Promise.all([
    colAccounts.createIndex({ googleSub: 1 }, { unique: true }),
    colAccounts.createIndex({ signalId: 1 }, { unique: true }),
    colAccounts.createIndex({ nicknameLower: 1 }, { unique: true }),
    colSessions.createIndex({ token: 1 }, { unique: true }),
    colSessions.createIndex({ googleSub: 1 }),
    colDirect.createIndex({ from: 1, to: 1, createdAt: -1 }),
    colDirect.createIndex({ to: 1, createdAt: -1 }),
    colSpace.createIndex({ sender: 1, day: 1 }),
    colSpace.createIndex({ createdAt: -1 }),
  ]);
  console.log("Connected to MongoDB");
}

function cleanDoc(doc) {
  if (!doc) return null;
  const { _id, nicknameLower, ...cleaned } = doc;
  return cleaned;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}

function passwordMatches(password, account) {
  const actual = Buffer.from(hashPassword(password, account.passwordSalt).hash, "hex");
  const expected = Buffer.from(account.passwordHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

async function verifyGoogleCredential(credential) {
  if (!GOOGLE_CLIENT_ID) throw new Error("google-client-id-not-configured");
  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email_verified) throw new Error("invalid-google-account");
  return payload;
}

async function createSession(account) {
  const token = crypto.randomBytes(32).toString("hex");
  await colSessions.deleteMany({ googleSub: account.googleSub });
  await colSessions.insertOne({ token, googleSub: account.googleSub, createdAt: Date.now() });
  return token;
}

async function sessionAccount(req, url) {
  const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "";
  const token = bearer || url.searchParams.get("token") || "";
  if (!token) return null;
  const session = await colSessions.findOne({ token });
  return session ? cleanDoc(await colAccounts.findOne({ googleSub: session.googleSub })) : null;
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

  if (req.method === "GET" && url.pathname === "/api/health") {
    try {
      await mongoDb.command({ ping: 1 });
      return json(res, 200, { ok: true, googleConfigured: Boolean(GOOGLE_CLIENT_ID), googleClientId: GOOGLE_CLIENT_ID, storage: { type: "mongodb", connected: true } });
    } catch (error) {
      return json(res, 503, { ok: false, error: "storage-unavailable" });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/auth/config") return json(res, 200, { googleClientId: GOOGLE_CLIENT_ID });
  if (req.method === "POST" && url.pathname === "/api/auth/register") {
    try {
      const { credential, nickname, password } = await readBody(req);
      if (!nickname?.trim() || nickname.trim().length < 2 || !password || password.length < 8) return json(res, 400, { error: "nickname-password-required" });
      const google = await verifyGoogleCredential(credential);
      if (await colAccounts.findOne({ googleSub: google.sub })) return json(res, 409, { error: "already-registered" });
      if (await colAccounts.findOne({ nicknameLower: nickname.trim().toLowerCase() })) return json(res, 409, { error: "nickname-taken" });
      const passwordData = hashPassword(password);
      const account = {
        googleSub: google.sub,
        email: google.email,
        nickname: nickname.trim(),
        nicknameLower: nickname.trim().toLowerCase(),
        signalId: `SIGNAL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        passwordSalt: passwordData.salt,
        passwordHash: passwordData.hash,
        createdAt: Date.now()
      };
      await colAccounts.insertOne(account);
      const token = await createSession(account);
      return json(res, 200, { token, account: publicAccount(account) });
    } catch (error) {
      return json(res, 401, { error: error.message || "google-verification-failed" });
    }
  }
  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    try {
      const { credential, password } = await readBody(req);
      const google = await verifyGoogleCredential(credential);
      const account = cleanDoc(await colAccounts.findOne({ googleSub: google.sub }));
      if (!account || !passwordMatches(password || "", account)) return json(res, 401, { error: "invalid-login" });
      const token = await createSession(account);
      return json(res, 200, { token, account: publicAccount(account) });
    } catch (error) {
      return json(res, 401, { error: error.message || "invalid-login" });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const account = await sessionAccount(req, url);
    return account ? json(res, 200, { account: publicAccount(account) }) : json(res, 401, { error: "auth-required" });
  }

  const account = await sessionAccount(req, url);
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
    await colDirect.insertOne(item);
    emit(to, "direct-message", cleanDoc(item));
    return json(res, 200, cleanDoc(item));
  }
  if (req.method === "GET" && url.pathname === "/api/direct/history") {
    const user = account.signalId;
    const friend = url.searchParams.get("friend");
    const messages = await colDirect
      .find({ $or: [{ from: user, to: friend }, { from: friend, to: user }] }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 }).limit(200).toArray();
    return json(res, 200, { messages: messages.reverse() });
  }
  if (req.method === "GET" && url.pathname === "/api/direct/inbox") {
    const user = account.signalId;
    const messages = await colDirect
      .find({ to: user }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 }).limit(500).toArray();
    return json(res, 200, { messages: messages.reverse() });
  }

  if (req.method === "POST" && url.pathname === "/api/space/send") {
    const { text, day = localDay() } = await readBody(req);
    const sender = account.signalId;
    if (!text) return json(res, 400, { error: "text required" });
    if (await colSpace.findOne({ sender, day })) return json(res, 409, { error: "daily-limit" });
    const signal = { id: crypto.randomUUID(), sender, text, day, createdAt: Date.now() };
    await colSpace.insertOne(signal);
    return json(res, 200, cleanDoc(signal));
  }
  if (req.method === "GET" && url.pathname === "/api/space/random") {
    const exclude = account.signalId;
    const count = await colSpace.countDocuments({ sender: { $ne: exclude } });
    if (!count) return json(res, 404, { error: "no-signals" });
    const skip = Math.floor(Math.random() * count);
    const signal = await colSpace.findOne({ sender: { $ne: exclude } }, { projection: { _id: 0 }, skip });
    if (!signal) return json(res, 404, { error: "no-signals" });
    return json(res, 200, signal);
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

async function start() {
  await connectMongo();
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`MORSE CHAT server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
