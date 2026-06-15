const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const emptyData = () => ({ direct: [], groupChats: [], groupMessages: [], space: [], spaceReports: [], friendRequests: [], friendships: [], secretLogs: [], diaryVaults: [], diaryEntries: [], gameScores: [], shopPurchases: [], suggestions: [], accounts: [], sessions: [] });

class FileStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = emptyData();
    try {
      this.data = { ...this.data, ...JSON.parse(fs.readFileSync(filePath, "utf8")) };
    } catch {}
  }

  async init() {
    for (const request of this.data.friendRequests.filter(item => item.status === "accepted")) {
      await this.addFriendship(request.from, request.to);
    }
  }
  async health() { return { type: "file", connected: true }; }
  save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }
  async findAccountByGoogleSub(googleSub) { return this.data.accounts.find(item => item.googleSub === googleSub) || null; }
  async findAccountBySignalId(signalId) { return this.data.accounts.find(item => item.signalId === signalId) || null; }
  async findAccountByNickname(nickname) { return this.data.accounts.find(item => item.nickname.toLowerCase() === nickname.toLowerCase()) || null; }
  async allAccounts() { return this.data.accounts; }
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
  async spendCoinsAndAddInventory(googleSub, itemId, cost) {
    const account = await this.findAccountByGoogleSub(googleSub);
    if (!account || Number(account.coins || 0) < cost || (account.inventory || []).includes(itemId)) return null;
    account.coins = Number(account.coins || 0) - cost;
    account.inventory = [...new Set([...(account.inventory || []), itemId])];
    return this.updateAccount(account);
  }
  async creditCoins(googleSub, amount) {
    const account = await this.findAccountByGoogleSub(googleSub);
    if (!account) return null;
    account.coins = Number(account.coins || 0) + amount;
    return this.updateAccount(account);
  }
  async removePushEndpointFromOtherAccounts(endpoint, googleSub) {
    this.data.accounts.forEach(account => {
      if (account.googleSub !== googleSub) {
        account.pushSubscriptions = (account.pushSubscriptions || []).filter(item => item.endpoint !== endpoint);
      }
    });
    this.save();
  }
  async addFriendRequest(item) {
    const existing = this.data.friendRequests.find(request => request.from === item.from && request.to === item.to && request.status === "pending");
    if (existing) return existing;
    this.data.friendRequests.push(item); this.save(); return item;
  }
  async incomingFriendRequests(user) { return this.data.friendRequests.filter(item => item.to === user && item.status === "pending"); }
  async outgoingFriendRequests(user) { return this.data.friendRequests.filter(item => item.from === user && item.status === "pending"); }
  async respondFriendRequest(id, user, status) {
    const item = this.data.friendRequests.find(request => request.id === id && request.to === user && request.status === "pending");
    if (!item) return null;
    item.status = status; item.respondedAt = Date.now(); this.save(); return item;
  }
  async addFriendship(a, b) {
    if (!this.data.friendships.some(item => (item.a === a && item.b === b) || (item.a === b && item.b === a))) {
      this.data.friendships.push({ a, b, createdAt: Date.now() });
      this.save();
    }
  }
  async removeFriendship(a, b) {
    this.data.friendships = this.data.friendships.filter(item => !((item.a === a && item.b === b) || (item.a === b && item.b === a)));
    this.data.friendRequests.forEach(item => {
      if (item.status === "accepted" && ((item.from === a && item.to === b) || (item.from === b && item.to === a))) item.status = "removed";
    });
    this.save();
  }
  async friendIds(user) { return this.data.friendships.filter(item => item.a === user || item.b === user).map(item => item.a === user ? item.b : item.a); }
  async areFriends(a, b) { return this.data.friendships.some(item => (item.a === a && item.b === b) || (item.a === b && item.b === a)); }
  async createSession(session) {
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
  async createGroup(group) { this.data.groupChats.push(group); this.save(); return group; }
  async updateGroup(group) {
    const index = this.data.groupChats.findIndex(item => item.id === group.id);
    if (index >= 0) this.data.groupChats[index] = group;
    this.save(); return group;
  }
  async groupById(id) { return this.data.groupChats.find(item => item.id === id) || null; }
  async groupsForUser(user) { return this.data.groupChats.filter(item => item.members.includes(user)); }
  async ensureDailyGroup(user, day, createId) {
    const existing = this.data.groupChats.find(item => item.type === "daily" && item.day === day && item.members.includes(user));
    if (existing) return existing;
    if (!this.data.groupChats.some(item => item.type === "daily" && item.day === day)) {
      const users = this.data.accounts.map(item => item.signalId).sort(() => Math.random() - .5);
      for (let index = 0; index < users.length; index += 10) {
        this.data.groupChats.push({
          id: `${createId}-${index / 10}`, type: "daily", name: day, day,
          members: users.slice(index, index + 10), createdAt: Date.now()
        });
      }
      this.save();
      return this.data.groupChats.find(item => item.type === "daily" && item.day === day && item.members.includes(user));
    }
    const available = this.data.groupChats.filter(item => item.type === "daily" && item.day === day && item.members.length < 10);
    const group = available.length ? available[Math.floor(Math.random() * available.length)] : {
      id: createId, type: "daily", name: day, day, members: [], createdAt: Date.now()
    };
    if (!this.data.groupChats.includes(group)) this.data.groupChats.push(group);
    group.members.push(user); this.save(); return group;
  }
  async addGroupMember(id, user) {
    const group = await this.groupById(id);
    if (!group || group.members.includes(user)) return group;
    group.members.push(user); this.save(); return group;
  }
  async removeGroupMember(id, user) {
    const group = await this.groupById(id);
    if (!group) return null;
    group.members = group.members.filter(item => item !== user);
    if (group.owner === user) group.owner = group.members[0] || "";
    if (!group.members.length) this.data.groupChats = this.data.groupChats.filter(item => item.id !== id);
    this.save(); return group;
  }
  async addGroupMessage(item) { this.data.groupMessages.push(item); this.data.groupMessages = this.data.groupMessages.slice(-10000); this.save(); }
  async groupHistory(id) { return this.data.groupMessages.filter(item => item.groupId === id).slice(-300); }
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
    if (this.data.space.filter(item => item.sender === signal.sender && item.day === signal.day).length >= 30) return false;
    this.data.space.push(signal);
    this.data.space = this.data.space.slice(-5000);
    this.save();
    return true;
  }
  async randomSpace(exclude, received = []) {
    const account = await this.findAccountBySignalId(exclude);
    const blocked = account?.blockedSpaceSenders || [];
    const choices = this.data.space.filter(item => item.sender !== exclude && !blocked.includes(item.sender) && !received.includes(item.id));
    return choices.length ? choices[Math.floor(Math.random() * choices.length)] : null;
  }
  async reportSpace(item) { this.data.spaceReports.push(item); this.save(); }
  async diaryVault(owner) { return this.data.diaryVaults.find(item => item.owner === owner) || null; }
  async setDiaryVault(owner, passwordHash) {
    const existing = await this.diaryVault(owner);
    if (existing) existing.passwordHash = passwordHash;
    else this.data.diaryVaults.push({ owner, passwordHash, createdAt: Date.now() });
    this.save();
  }
  async diaryEntriesFor(owner) { return this.data.diaryEntries.filter(item => item.owner === owner).sort((a, b) => a.createdAt - b.createdAt); }
  async addDiaryEntry(item) {
    const existing = this.data.diaryEntries.find(entry => entry.owner === item.owner && entry.id === item.id);
    if (existing) {
      Object.assign(existing, item);
      this.save();
      return existing;
    }
    this.data.diaryEntries.push(item); this.save(); return item;
  }
  async removeDiaryEntry(owner, id) {
    const before = this.data.diaryEntries.length;
    this.data.diaryEntries = this.data.diaryEntries.filter(item => !(item.owner === owner && item.id === id));
    this.save(); return this.data.diaryEntries.length !== before;
  }
  async submitGameScore(item) {
    const existing = this.data.gameScores.find(score => score.owner === item.owner);
    if (!existing || item.timeMs < existing.timeMs) {
      if (existing) Object.assign(existing, item);
      else this.data.gameScores.push(item);
      this.save();
      return { score: item, improved: true };
    }
    return { score: existing, improved: false };
  }
  async gameRanking(limit = 100) { return [...this.data.gameScores].sort((a, b) => a.timeMs - b.timeMs).slice(0, limit); }
  async gameRank(owner) {
    const ranking = await this.gameRanking(this.data.gameScores.length);
    const index = ranking.findIndex(item => item.owner === owner);
    return index < 0 ? null : { rank: index + 1, score: ranking[index] };
  }
  async addShopPurchase(item) {
    if (this.data.shopPurchases.some(purchase => purchase.purchaseToken === item.purchaseToken)) return false;
    this.data.shopPurchases.push(item); this.save(); return true;
  }
  async addSuggestion(item) { this.data.suggestions.push(item); this.save(); return item; }
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
    this.groupChats = this.db.collection("group_chats");
    this.groupMessages = this.db.collection("group_messages");
    this.friendRequests = this.db.collection("friend_requests");
    this.friendships = this.db.collection("friendships");
    this.spaceReports = this.db.collection("space_reports");
    this.secretLogs = this.db.collection("secret_communication_logs");
    this.space = this.db.collection("space_signals");
    this.diaryVaults = this.db.collection("diary_vaults");
    this.diaryEntries = this.db.collection("diary_entries");
    this.gameScores = this.db.collection("game_scores");
    this.shopPurchases = this.db.collection("shop_purchases");
    this.suggestions = this.db.collection("suggestions");
    await this.sessions.dropIndex("googleSub_1").catch(() => {});
    await this.space.dropIndex("sender_1_day_1").catch(() => {});
    await Promise.all([
      this.accounts.createIndex({ googleSub: 1 }, { unique: true }),
      this.accounts.createIndex({ signalId: 1 }, { unique: true }),
      this.accounts.createIndex({ nicknameLower: 1 }, { unique: true }),
      this.sessions.createIndex({ token: 1 }, { unique: true }),
      this.sessions.createIndex({ googleSub: 1 }),
      this.direct.createIndex({ from: 1, to: 1, createdAt: -1 }),
      this.direct.createIndex({ to: 1, createdAt: -1 }),
      this.groupChats.createIndex({ members: 1, createdAt: -1 }),
      this.groupChats.createIndex({ type: 1, day: 1, memberCount: 1 }),
      this.groupMessages.createIndex({ groupId: 1, createdAt: 1 }),
      this.friendRequests.createIndex({ to: 1, status: 1, createdAt: -1 }),
      this.friendRequests.createIndex({ from: 1, to: 1, status: 1 }),
      this.friendships.createIndex({ members: 1 }),
      this.friendships.createIndex({ key: 1 }, { unique: true }),
      this.spaceReports.createIndex({ signalId: 1, reporter: 1 }, { unique: true }),
      this.secretLogs.createIndex({ sessionId: 1, createdAt: 1 }),
      this.secretLogs.createIndex({ from: 1, to: 1, createdAt: -1 }),
      this.secretLogs.createIndex(
        { sessionId: 1, from: 1, action: 1 },
        { unique: true, partialFilterExpression: { action: "decoded" } }
      ),
      this.space.createIndex({ sender: 1, day: 1 }),
      this.space.createIndex({ createdAt: -1 })
      ,this.diaryVaults.createIndex({ owner: 1 }, { unique: true })
      ,this.diaryEntries.createIndex({ owner: 1, createdAt: 1 })
      ,this.diaryEntries.createIndex({ owner: 1, id: 1 }, { unique: true })
      ,this.gameScores.createIndex({ owner: 1 }, { unique: true })
      ,this.gameScores.createIndex({ timeMs: 1 })
      ,this.shopPurchases.createIndex({ purchaseToken: 1 }, { unique: true })
      ,this.suggestions.createIndex({ createdAt: -1 })
      ,this.suggestions.createIndex({ owner: 1, createdAt: -1 })
    ]);
    await this.migrateLegacyFile();
    const accepted = await this.friendRequests.find({ status: "accepted" }, { projection: { from: 1, to: 1 } }).toArray();
    await Promise.all(accepted.map(request => this.addFriendship(request.from, request.to)));
  }

  async migrateLegacyFile() {
    if (!this.legacyFile || !fs.existsSync(this.legacyFile) || await this.accounts.estimatedDocumentCount()) return;
    let legacy;
    try { legacy = { ...emptyData(), ...JSON.parse(fs.readFileSync(this.legacyFile, "utf8")) }; } catch { return; }
    const accounts = legacy.accounts.map(item => ({ ...item, nicknameLower: item.nickname.toLowerCase() }));
    if (accounts.length) await this.accounts.insertMany(accounts, { ordered: false }).catch(() => {});
    if (legacy.sessions.length) await this.sessions.insertMany(legacy.sessions, { ordered: false }).catch(() => {});
    if (legacy.direct.length) await this.direct.insertMany(legacy.direct, { ordered: false }).catch(() => {});
    if (legacy.groupChats.length) await this.groupChats.insertMany(legacy.groupChats.map(item => ({ ...item, memberCount: item.members.length })), { ordered: false }).catch(() => {});
    if (legacy.groupMessages.length) await this.groupMessages.insertMany(legacy.groupMessages, { ordered: false }).catch(() => {});
    if (legacy.friendRequests.length) await this.friendRequests.insertMany(legacy.friendRequests, { ordered: false }).catch(() => {});
    if (legacy.friendships.length) await this.friendships.insertMany(legacy.friendships, { ordered: false }).catch(() => {});
    if (legacy.spaceReports.length) await this.spaceReports.insertMany(legacy.spaceReports, { ordered: false }).catch(() => {});
    if (legacy.secretLogs.length) await this.secretLogs.insertMany(legacy.secretLogs, { ordered: false }).catch(() => {});
    if (legacy.space.length) await this.space.insertMany(legacy.space, { ordered: false }).catch(() => {});
    if (legacy.diaryVaults.length) await this.diaryVaults.insertMany(legacy.diaryVaults, { ordered: false }).catch(() => {});
    if (legacy.diaryEntries.length) await this.diaryEntries.insertMany(legacy.diaryEntries, { ordered: false }).catch(() => {});
    if (legacy.gameScores.length) await this.gameScores.insertMany(legacy.gameScores, { ordered: false }).catch(() => {});
    if (legacy.shopPurchases.length) await this.shopPurchases.insertMany(legacy.shopPurchases, { ordered: false }).catch(() => {});
    if (legacy.suggestions.length) await this.suggestions.insertMany(legacy.suggestions, { ordered: false }).catch(() => {});
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
  async allAccounts() { return this.accounts.find({}, { projection: { _id: 0, nicknameLower: 0 } }).toArray(); }
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
  async spendCoinsAndAddInventory(googleSub, itemId, cost) {
    return this.clean(await this.accounts.findOneAndUpdate(
      { googleSub, coins: { $gte: cost }, inventory: { $ne: itemId } },
      { $inc: { coins: -cost }, $addToSet: { inventory: itemId } },
      { returnDocument: "after" }
    ));
  }
  async creditCoins(googleSub, amount) {
    return this.clean(await this.accounts.findOneAndUpdate(
      { googleSub },
      { $inc: { coins: amount } },
      { returnDocument: "after" }
    ));
  }
  async removePushEndpointFromOtherAccounts(endpoint, googleSub) {
    await this.accounts.updateMany(
      { googleSub: { $ne: googleSub }, "pushSubscriptions.endpoint": endpoint },
      { $pull: { pushSubscriptions: { endpoint } } }
    );
  }
  async addFriendRequest(item) {
    const existing = await this.friendRequests.findOne({ from: item.from, to: item.to, status: "pending" }, { projection: { _id: 0 } });
    if (existing) return existing;
    await this.friendRequests.insertOne(item); return item;
  }
  async incomingFriendRequests(user) {
    return this.friendRequests.find({ to: user, status: "pending" }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  }
  async outgoingFriendRequests(user) {
    return this.friendRequests.find({ from: user, status: "pending" }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  }
  async respondFriendRequest(id, user, status) {
    return this.clean(await this.friendRequests.findOneAndUpdate(
      { id, to: user, status: "pending" },
      { $set: { status, respondedAt: Date.now() } },
      { returnDocument: "after" }
    ));
  }
  friendshipKey(a, b) { return [a, b].sort().join(":"); }
  async addFriendship(a, b) {
    await this.friendships.updateOne(
      { key: this.friendshipKey(a, b) },
      { $setOnInsert: { key: this.friendshipKey(a, b), members: [a, b], createdAt: Date.now() } },
      { upsert: true }
    );
  }
  async removeFriendship(a, b) {
    await this.friendships.deleteOne({ key: this.friendshipKey(a, b) });
    await this.friendRequests.updateMany(
      { status: "accepted", $or: [{ from: a, to: b }, { from: b, to: a }] },
      { $set: { status: "removed", removedAt: Date.now() } }
    );
  }
  async friendIds(user) {
    return this.friendships.find({ members: user }, { projection: { _id: 0, members: 1 } }).toArray()
      .then(items => items.map(item => item.members.find(member => member !== user)));
  }
  async areFriends(a, b) { return Boolean(await this.friendships.findOne({ key: this.friendshipKey(a, b) }, { projection: { _id: 1 } })); }
  async createSession(session) {
    await this.sessions.insertOne(session);
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
  async createGroup(group) { await this.groupChats.insertOne({ ...group, memberCount: group.members.length }); return group; }
  async updateGroup(group) {
    await this.groupChats.replaceOne({ id: group.id }, { ...group, memberCount: group.members.length }, { upsert: true });
    return group;
  }
  async groupById(id) { return this.clean(await this.groupChats.findOne({ id })); }
  async groupsForUser(user) {
    return this.groupChats.find({ members: user }, { projection: { _id: 0, memberCount: 0 } }).sort({ createdAt: -1 }).toArray();
  }
  async ensureDailyGroup(user, day, createId) {
    const existing = await this.groupChats.findOne({ type: "daily", day, members: user }, { projection: { _id: 0, memberCount: 0 } });
    if (existing) return existing;
    if (!await this.groupChats.findOne({ type: "daily", day }, { projection: { _id: 1 } })) {
      const users = await this.accounts.aggregate([{ $sample: { size: 100000 } }, { $project: { signalId: 1 } }]).toArray();
      const groups = [];
      for (let index = 0; index < users.length; index += 10) {
        const members = users.slice(index, index + 10).map(item => item.signalId);
        groups.push({ id: `${createId}-${index / 10}`, type: "daily", name: day, day, members, memberCount: members.length, createdAt: Date.now() });
      }
      if (groups.length) await this.groupChats.insertMany(groups, { ordered: false }).catch(() => {});
      const assigned = await this.groupChats.findOne({ type: "daily", day, members: user }, { projection: { _id: 0, memberCount: 0 } });
      if (assigned) return assigned;
    }
    const [available] = await this.groupChats.aggregate([
      { $match: { type: "daily", day, memberCount: { $lt: 10 } } },
      { $sample: { size: 1 } }
    ]).toArray();
    if (!available) return this.createGroup({ id: createId, type: "daily", name: day, day, members: [user], createdAt: Date.now() });
    const result = await this.groupChats.updateOne({ id: available.id, memberCount: { $lt: 10 }, members: { $ne: user } }, { $addToSet: { members: user }, $inc: { memberCount: 1 } });
    if (!result.modifiedCount) return this.ensureDailyGroup(user, day, createId);
    return this.groupById(available.id);
  }
  async addGroupMember(id, user) {
    await this.groupChats.updateOne({ id, members: { $ne: user } }, { $addToSet: { members: user }, $inc: { memberCount: 1 } });
    return this.groupById(id);
  }
  async removeGroupMember(id, user) {
    await this.groupChats.updateOne({ id, members: user }, { $pull: { members: user }, $inc: { memberCount: -1 } });
    const group = await this.groupById(id);
    if (group && !group.members.length) await this.groupChats.deleteOne({ id });
    else if (group?.owner === user) {
      group.owner = group.members[0];
      await this.updateGroup(group);
    }
    return group;
  }
  async addGroupMessage(item) { await this.groupMessages.insertOne(item); }
  async groupHistory(id) {
    return this.groupMessages.find({ groupId: id }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(300).toArray().then(items => items.reverse());
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
    if (await this.space.countDocuments({ sender: signal.sender, day: signal.day }) >= 30) return false;
    await this.space.insertOne(signal);
    return true;
  }
  async randomSpace(exclude, received = []) {
    const account = await this.findAccountBySignalId(exclude);
    const [signal] = await this.space.aggregate([{ $match: { id: { $nin: received }, sender: { $ne: exclude, $nin: account?.blockedSpaceSenders || [] } } }, { $sample: { size: 1 } }, { $project: { _id: 0 } }]).toArray();
    return signal || null;
  }
  async reportSpace(item) {
    try { await this.spaceReports.insertOne(item); }
    catch (error) { if (error.code !== 11000) throw error; }
  }
  async diaryVault(owner) { return this.clean(await this.diaryVaults.findOne({ owner })); }
  async setDiaryVault(owner, passwordHash) {
    await this.diaryVaults.updateOne({ owner }, { $set: { owner, passwordHash }, $setOnInsert: { createdAt: Date.now() } }, { upsert: true });
  }
  async diaryEntriesFor(owner) {
    return this.diaryEntries.find({ owner }, { projection: { _id: 0 } }).sort({ createdAt: 1 }).toArray();
  }
  async addDiaryEntry(item) {
    await this.diaryEntries.updateOne({ owner: item.owner, id: item.id }, { $set: item }, { upsert: true });
    return item;
  }
  async removeDiaryEntry(owner, id) {
    return Boolean((await this.diaryEntries.deleteOne({ owner, id })).deletedCount);
  }
  async submitGameScore(item) {
    const existing = this.clean(await this.gameScores.findOne({ owner: item.owner }));
    if (existing && existing.timeMs <= item.timeMs) return { score: existing, improved: false };
    await this.gameScores.replaceOne({ owner: item.owner }, item, { upsert: true });
    return { score: item, improved: true };
  }
  async gameRanking(limit = 100) {
    return this.gameScores.find({}, { projection: { _id: 0 } }).sort({ timeMs: 1 }).limit(limit).toArray();
  }
  async gameRank(owner) {
    const score = this.clean(await this.gameScores.findOne({ owner }));
    if (!score) return null;
    return { rank: await this.gameScores.countDocuments({ timeMs: { $lt: score.timeMs } }) + 1, score };
  }
  async addShopPurchase(item) {
    try { await this.shopPurchases.insertOne(item); return true; }
    catch (error) { if (error.code === 11000) return false; throw error; }
  }
  async addSuggestion(item) { await this.suggestions.insertOne(item); return item; }
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
