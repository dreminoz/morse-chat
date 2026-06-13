const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { createStore } = require("./storage");

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
let store;
const SECRET_MORSE = {
  ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F", "--.": "G", "....": "H",
  "..": "I", ".---": "J", "-.-": "K", ".-..": "L", "--": "M", "-.": "N", "---": "O", ".--.": "P",
  "--.-": "Q", ".-.": "R", "...": "S", "-": "T", "..-": "U", "...-": "V", ".--": "W", "-..-": "X",
  "-.--": "Y", "--..": "Z", "-----": "0", ".----": "1", "..---": "2", "...--": "3", "....-": "4",
  ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9"
};

function decodeSecretPresses(logs, sender) {
  const events = logs.filter(item => item.from === sender && ["down", "up"].includes(item.action));
  const marks = [];
  let down = null;
  for (const event of events) {
    if (event.action === "down") down = event;
    else if (down) {
      const unit = Math.max(40, Number(down.unit) || 120);
      marks.push({ mark: event.createdAt - down.createdAt < unit * 2 ? "." : "-", at: down.createdAt, end: event.createdAt, unit });
      down = null;
    }
  }
  let morse = "";
  let text = "";
  let letter = "";
  marks.forEach((item, index) => {
    letter += item.mark;
    const next = marks[index + 1];
    if (!next) {
      morse += letter;
      text += SECRET_MORSE[letter] || "�";
      return;
    }
    const gap = next.at - item.end;
    if (gap >= item.unit * 7) {
      morse += `${letter} / `;
      text += `${SECRET_MORSE[letter] || "�"} `;
      letter = "";
    } else if (gap >= item.unit * 3) {
      morse += `${letter} `;
      text += SECRET_MORSE[letter] || "�";
      letter = "";
    }
  });
  return { morse: morse.trim(), text: text.trim() };
}

async function finalizeSecretSession(sessionId) {
  const logs = await store.secretSessionLogs(sessionId);
  const senders = [...new Set(logs.filter(item => item.from).map(item => item.from))];
  await Promise.all(senders.map(async from => {
    const decoded = decodeSecretPresses(logs, from);
    if (!decoded.morse) return;
    const peer = logs.find(item => item.from === from)?.to || "";
    await store.saveSecretDecode({
      id: crypto.randomUUID(), sessionId, from, to: peer, action: "decoded",
      morse: decoded.morse, text: decoded.text, createdAt: Date.now()
    });
  }));
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
  await store.createSession({ token, googleSub: account.googleSub, createdAt: Date.now() });
  return token;
}

async function sessionAccount(req, url) {
  const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : "";
  const token = bearer || url.searchParams.get("token") || "";
  return token ? store.accountFromSession(token) : null;
}

function publicAccount(account) {
  return {
    nickname: account.nickname,
    signalId: account.signalId,
    description: account.description || "",
    profileAscii: account.profileAscii || ""
  };
}

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
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
  res.writeHead(200, {
    "Content-Type": `${types[ext] || "application/octet-stream"}; charset=utf-8`,
    "Cache-Control": "no-cache, must-revalidate"
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/health") {
    try {
      const storage = await store.health();
      return json(res, 200, { ok: true, googleConfigured: Boolean(GOOGLE_CLIENT_ID), googleClientId: GOOGLE_CLIENT_ID, storage });
    } catch (error) {
      return json(res, 503, { ok: false, error: "storage-unavailable" });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/auth/config") return json(res, 200, { googleClientId: GOOGLE_CLIENT_ID });
  if (req.method === "POST" && url.pathname === "/api/auth/google") {
    try {
      const { credential, nickname } = await readBody(req);
      const google = await verifyGoogleCredential(credential);
      const existing = await store.findAccountByGoogleSub(google.sub);
      if (existing) {
        const token = await createSession(existing);
        return json(res, 200, { token, account: publicAccount(existing) });
      }
      if (!nickname?.trim() || nickname.trim().length < 2) return json(res, 409, { error: "nickname-required" });
      if (await store.nicknameTaken(nickname.trim())) return json(res, 409, { error: "nickname-taken" });
      const account = {
        googleSub: google.sub,
        email: google.email,
        nickname: nickname.trim(),
        nicknameHistory: [],
        signalId: `SIGNAL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        createdAt: Date.now()
      };
      await store.insertAccount(account);
      const token = await createSession(account);
      return json(res, 200, { token, account: publicAccount(account) });
    } catch (error) {
      return json(res, 401, { error: error.message || "google-verification-failed" });
    }
  }
  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const account = await sessionAccount(req, url);
    return account ? json(res, 200, { account: publicAccount(account) }) : json(res, 401, { error: "auth-required" });
  }

  const account = await sessionAccount(req, url);
  if (url.pathname.startsWith("/api/") && !account) return json(res, 401, { error: "auth-required" });
  if (req.method === "GET" && url.pathname === "/api/profile") {
    const nickname = url.searchParams.get("nickname");
    const signalId = url.searchParams.get("signalId") || account.signalId;
    const profile = nickname
      ? await store.findAccountByNickname(nickname.trim())
      : await store.findAccountBySignalId(signalId);
    return profile ? json(res, 200, { profile: publicAccount(profile) }) : json(res, 404, { error: "profile-not-found" });
  }
  if (req.method === "POST" && url.pathname === "/api/friends/request") {
    const { nickname } = await readBody(req);
    const target = nickname ? await store.findAccountByNickname(nickname.trim()) : null;
    if (!target) return json(res, 404, { error: "profile-not-found" });
    if (target.signalId === account.signalId) return json(res, 409, { error: "cannot-add-self" });
    if (await store.areFriends(account.signalId, target.signalId)) return json(res, 409, { error: "already-friends" });
    const request = await store.addFriendRequest({
      id: crypto.randomUUID(), from: account.signalId, fromNickname: account.nickname,
      to: target.signalId, toNickname: target.nickname, status: "pending", createdAt: Date.now()
    });
    emit(target.signalId, "friend-request", request);
    return json(res, 200, { request });
  }
  if (req.method === "GET" && url.pathname === "/api/friends/requests") {
    return json(res, 200, {
      incoming: await store.incomingFriendRequests(account.signalId),
      outgoing: await store.outgoingFriendRequests(account.signalId)
    });
  }
  if (req.method === "GET" && url.pathname === "/api/friends") {
    return json(res, 200, { friends: await store.friendIds(account.signalId) });
  }
  if (req.method === "POST" && url.pathname === "/api/friends/respond") {
    const { id, status } = await readBody(req);
    if (!["accepted", "rejected"].includes(status)) return json(res, 400, { error: "invalid-status" });
    const request = await store.respondFriendRequest(id, account.signalId, status);
    if (!request) return json(res, 404, { error: "request-not-found" });
    if (status === "accepted") await store.addFriendship(request.from, request.to);
    emit(request.from, "friend-response", { ...request, responderNickname: account.nickname });
    return json(res, 200, { request });
  }
  if (req.method === "POST" && url.pathname === "/api/friends/remove") {
    const { friend } = await readBody(req);
    if (!friend) return json(res, 400, { error: "friend-required" });
    await store.removeFriendship(account.signalId, friend);
    emit(friend, "friend-removed", { friend: account.signalId });
    return json(res, 200, { ok: true });
  }
  if (req.method === "PATCH" && url.pathname === "/api/profile/me") {
    const { nickname, description, profileAscii } = await readBody(req);
    const nextNickname = typeof nickname === "string" ? nickname.trim() : account.nickname;
    if (nextNickname.length < 2 || nextNickname.length > 24) return json(res, 400, { error: "invalid-nickname" });
    if (await store.nicknameTaken(nextNickname, account.googleSub)) {
      return json(res, 409, { error: "nickname-taken" });
    }
    if (typeof description === "string" && description.length > 240) return json(res, 400, { error: "description-too-long" });
    if (typeof profileAscii === "string" && profileAscii.length > 30000) return json(res, 400, { error: "profile-image-too-large" });
    if (nextNickname !== account.nickname) {
      account.nicknameHistory = [
        ...(account.nicknameHistory || []),
        { nickname: account.nickname, changedAt: Date.now() }
      ].slice(-20);
      account.nickname = nextNickname;
    }
    if (typeof description === "string") account.description = description.trim();
    if (typeof profileAscii === "string") account.profileAscii = profileAscii;
    await store.updateAccount(account);
    return json(res, 200, { account: publicAccount(account) });
  }
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
    if (!await store.areFriends(from, to)) return json(res, 403, { error: "friends-only" });
    const item = { id: crypto.randomUUID(), from, to, message, createdAt: Date.now() };
    await store.addDirect(item);
    emit(to, "direct-message", item);
    return json(res, 200, item);
  }
  if (req.method === "GET" && url.pathname === "/api/direct/history") {
    const user = account.signalId;
    const friend = url.searchParams.get("friend");
    const messages = await store.directHistory(user, friend);
    return json(res, 200, { messages });
  }
  if (req.method === "GET" && url.pathname === "/api/direct/inbox") {
    const user = account.signalId;
    return json(res, 200, { messages: await store.directInbox(user) });
  }
  if (req.method === "POST" && url.pathname === "/api/direct/secret") {
    const { to, action, sessionId, unit } = await readBody(req);
    if (!to || !sessionId || !["enter", "down", "up", "exit"].includes(action)) {
      return json(res, 400, { error: "invalid-secret-signal" });
    }
    if (!await store.areFriends(account.signalId, to)) return json(res, 403, { error: "friends-only" });
    const log = {
      id: crypto.randomUUID(),
      sessionId,
      from: account.signalId,
      to,
      action,
      unit: Math.min(500, Math.max(40, Number(unit) || 120)),
      createdAt: Date.now()
    };
    await store.addSecretLog(log);
    emit(to, "secret-signal", { from: account.signalId, action, sessionId });
    if (action === "exit") {
      setTimeout(() => finalizeSecretSession(sessionId).catch(error => {
        console.error("Failed to decode Secret Communication log:", error);
      }), 300);
    }
    return json(res, 200, { ok: true });
  }
  if (req.method === "GET" && url.pathname === "/api/direct/secret/history") {
    const friend = url.searchParams.get("friend");
    if (!friend) return json(res, 400, { error: "friend required" });
    return json(res, 200, { logs: await store.secretHistory(account.signalId, friend) });
  }

  if (req.method === "POST" && url.pathname === "/api/space/send") {
    const { text, type = "text", day = localDay() } = await readBody(req);
    const sender = account.signalId;
    if (!text) return json(res, 400, { error: "text required" });
    const signal = { id: crypto.randomUUID(), sender, text, type, day, createdAt: Date.now() };
    if (!await store.addSpace(signal)) return json(res, 409, { error: "daily-limit" });
    return json(res, 200, signal);
  }
  if (req.method === "GET" && url.pathname === "/api/space/random") {
    const exclude = account.signalId;
    const signal = await store.randomSpace(exclude);
    return signal ? json(res, 200, signal) : json(res, 404, { error: "no-signals" });
  }
  if (req.method === "POST" && url.pathname === "/api/space/report") {
    const { signalId, sender, reason = "user-report" } = await readBody(req);
    if (!signalId || !sender) return json(res, 400, { error: "signal required" });
    await store.reportSpace({ id: crypto.randomUUID(), signalId, sender, reporter: account.signalId, reason, createdAt: Date.now() });
    return json(res, 200, { ok: true });
  }
  if (req.method === "POST" && url.pathname === "/api/space/block") {
    const { sender } = await readBody(req);
    if (!sender || sender === account.signalId) return json(res, 400, { error: "invalid-sender" });
    account.blockedSpaceSenders = [...new Set([...(account.blockedSpaceSenders || []), sender])];
    await store.updateAccount(account);
    return json(res, 200, { ok: true });
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
  if (req.method === "GET" && url.pathname === "/api/random/status") {
    const userId = account.signalId;
    return json(res, 200, { status: randomPairs.has(userId) ? "connected" : randomQueue.includes(userId) ? "searching" : "idle" });
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
  store = await createStore({ dataFile: DATA_FILE });
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`MORSE CHAT server running at http://0.0.0.0:${PORT}`);
  });
}

start().catch(error => {
  console.error("Failed to start MORSE CHAT server:", error);
  process.exitCode = 1;
});
