const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const emptyData = () => ({ direct: [], space: [], secretLogs: [], accounts: [], sessions: [] });

class FileStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = emptyData();
    try {
      this.data = { ...this.data, ...JSON.parse(fs.readFileSync(filePath, "utf8")) };
    } catch {}
  }

  async init() {}
  async health() { return { type: "file", connected: true }; }
  save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }
  async findAccountByGoogleSub(googleSub) { return this.data.accounts.find(item => item.googleSub === googleSub) || null; }
  async findAccountBySignalId(signalId) { return this.data.accounts.find(item => item.signalId === signalId) || null; }
  async findAccountByNickname(nickname) { return this.data.accounts.find(item => item.nickname.toLowerCase() === nickname.toLowerCase()) || null; }
  async nicknameTaken(nickname, excludeGoogleSub = "") {
    return this.data.accounts.some(item => item.googleSub !== excludeGoogleSub && item.nickname.toLowerCase() === nickname.toLowerCase());
  }
  async insertAccount(account) { this.data.accounts.push(account); this.save(); return account; }
  async updateAccount(account) {
    const index = this.data.accounts.findIndex(item => item.googleSub === account.googleSub);
    if (index >= 0) this.data.accounts[index] = account;
    this.save();
    return account;
  }
  async createSession(session) {
    this.data.sessions = this.data.sessions.filter(item => item.googleSub !== session.googleSub);
    this.data.sessions.push(session);
    this.save();
  }
  async accountFromSession(token) {
    const session = this.data.sessions.find(item => item.token === token);
    return session ? this.findAccountByGoogleSub(session.googleSub) : null;
  }
  async addDirect(item) {
    this.data.direct.push(item);
    this.data.direct = this.data.direct.slice(-2000);
    this.save();
  }
  async directHistory(user, friend) {
    return this.data.direct.filter(item => (item.from === user && item.to === friend) || (item.from === friend && item.to === user)).slice(-200);
  }
  async directInbox(user) { return this.data.direct.filter(item => item.to === user).slice(-500); }
  async addSecretLog(item) {
    this.data.secretLogs.push(item);
    this.data.secretLogs = this.data.secretLogs.slice(-10000);
    this.save();
  }
  async secretHistory(user, friend) {
    return this.data.secretLogs.filter(item =>
      (item.from === user && item.to === friend) || (item.from === friend && item.to === user)
    ).slice(-1000);
  }
  async secretSessionLogs(sessionId) { return this.data.secretLogs.filter(item => item.sessionId === sessionId); }
  async saveSecretDecode(item) {
    const index = this.data.secretLogs.findIndex(log =>
      log.sessionId === item.sessionId && log.from === item.from && log.action === "decoded"
    );
    if (index >= 0) this.data.secretLogs[index] = item;
    else this.data.secretLogs.push(item);
    this.save();
  }
  async addSpace(signal) {
    if (this.data.space.some(item => item.sender === signal.sender && item.day === signal.day)) return false;
    this.data.space.push(signal);
    this.data.space = this.data.space.slice(-5000);
    this.save();
    return true;
  }
  async randomSpace(exclude) {
    const choices = this.data.space.filter(item => item.sender !== exclude);
    return choices.length ? choices[Math.floor(Math.random() * choices.length)] : null;
  }
}

class MongoStore {
  constructor(uri, dbName, legacyFile) {
    this.client = new MongoClient(uri);
    this.dbName = dbName;
    this.legacyFile = legacyFile;
  }

  async init() {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    this.accounts = this.db.collection("accounts");
    this.sessions = this.db.collection("sessions");
    this.direct = this.db.collection("direct_messages");
    this.secretLogs = this.db.collection("secret_communication_logs");
    this.space = this.db.collection("space_signals");
    await Promise.all([
      this.accounts.createIndex({ googleSub: 1 }, { unique: true }),
      this.accounts.createIndex({ signalId: 1 }, { unique: true }),
      this.accounts.createIndex({ nicknameLower: 1 }, { unique: true }),
      this.sessions.createIndex({ token: 1 }, { unique: true }),
      this.sessions.createIndex({ googleSub: 1 }, { unique: true }),
      this.direct.createIndex({ from: 1, to: 1, createdAt: -1 }),
      this.direct.createIndex({ to: 1, createdAt: -1 }),
      this.secretLogs.createIndex({ sessionId: 1, createdAt: 1 }),
      this.secretLogs.createIndex({ from: 1, to: 1, createdAt: -1 }),
      this.secretLogs.createIndex(
        { sessionId: 1, from: 1, action: 1 },
        { unique: true, partialFilterExpression: { action: "decoded" } }
      ),
      this.space.createIndex({ sender: 1, day: 1 }, { unique: true }),
      this.space.createIndex({ createdAt: -1 })
    ]);
    await this.migrateLegacyFile();
  }

  async migrateLegacyFile() {
    if (!this.legacyFile || !fs.existsSync(this.legacyFile) || await this.accounts.estimatedDocumentCount()) return;
    let legacy;
    try { legacy = { ...emptyData(), ...JSON.parse(fs.readFileSync(this.legacyFile, "utf8")) }; } catch { return; }
    const accounts = legacy.accounts.map(item => ({ ...item, nicknameLower: item.nickname.toLowerCase() }));
    if (accounts.length) await this.accounts.insertMany(accounts, { ordered: false }).catch(() => {});
    if (legacy.sessions.length) await this.sessions.insertMany(legacy.sessions, { ordered: false }).catch(() => {});
    if (legacy.direct.length) await this.direct.insertMany(legacy.direct, { ordered: false }).catch(() => {});
    if (legacy.secretLogs.length) await this.secretLogs.insertMany(legacy.secretLogs, { ordered: false }).catch(() => {});
    if (legacy.space.length) await this.space.insertMany(legacy.space, { ordered: false }).catch(() => {});
  }

  async health() {
    await this.db.command({ ping: 1 });
    return { type: "mongodb", connected: true };
  }
  clean(document) {
    if (!document) return null;
    const { _id, nicknameLower, ...cleaned } = document;
    return cleaned;
  }
  async findAccountByGoogleSub(googleSub) { return this.clean(await this.accounts.findOne({ googleSub })); }
  async findAccountBySignalId(signalId) { return this.clean(await this.accounts.findOne({ signalId })); }
  async findAccountByNickname(nickname) { return this.clean(await this.accounts.findOne({ nicknameLower: nickname.toLowerCase() })); }
  async nicknameTaken(nickname, excludeGoogleSub = "") {
    return Boolean(await this.accounts.findOne({ nicknameLower: nickname.toLowerCase(), googleSub: { $ne: excludeGoogleSub } }, { projection: { _id: 1 } }));
  }
  async insertAccount(account) {
    await this.accounts.insertOne({ ...account, nicknameLower: account.nickname.toLowerCase() });
    return account;
  }
  async updateAccount(account) {
    await this.accounts.replaceOne(
      { googleSub: account.googleSub },
      { ...account, nicknameLower: account.nickname.toLowerCase() },
      { upsert: true }
    );
    return account;
  }
  async createSession(session) {
    await this.sessions.replaceOne({ googleSub: session.googleSub }, session, { upsert: true });
  }
  async accountFromSession(token) {
    const session = await this.sessions.findOne({ token });
    return session ? this.findAccountByGoogleSub(session.googleSub) : null;
  }
  async addDirect(item) { await this.direct.insertOne(item); }
  async directHistory(user, friend) {
    return this.direct.find({ $or: [{ from: user, to: friend }, { from: friend, to: user }] }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 }).limit(200).toArray().then(items => items.reverse());
  }
  async directInbox(user) {
    return this.direct.find({ to: user }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(500).toArray().then(items => items.reverse());
  }
  async addSecretLog(item) { await this.secretLogs.insertOne(item); }
  async secretHistory(user, friend) {
    return this.secretLogs.find(
      { $or: [{ from: user, to: friend }, { from: friend, to: user }] },
      { projection: { _id: 0 } }
    ).sort({ createdAt: -1 }).limit(1000).toArray().then(items => items.reverse());
  }
  async secretSessionLogs(sessionId) {
    return this.secretLogs.find({ sessionId }, { projection: { _id: 0 } }).sort({ createdAt: 1 }).toArray();
  }
  async saveSecretDecode(item) {
    await this.secretLogs.replaceOne(
      { sessionId: item.sessionId, from: item.from, action: "decoded" },
      item,
      { upsert: true }
    );
  }
  async addSpace(signal) {
    try { await this.space.insertOne(signal); return true; }
    catch (error) { if (error.code === 11000) return false; throw error; }
  }
  async randomSpace(exclude) {
    const [signal] = await this.space.aggregate([{ $match: { sender: { $ne: exclude } } }, { $sample: { size: 1 } }, { $project: { _id: 0 } }]).toArray();
    return signal || null;
  }
}

async function createStore({ dataFile }) {
  const uri = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_PRIVATE_URL || "";
  const store = uri
    ? new MongoStore(uri, process.env.MONGO_DB_NAME || "morse_chat", dataFile)
    : new FileStore(dataFile);
  await store.init();
  return store;
}

module.exports = { createStore };
