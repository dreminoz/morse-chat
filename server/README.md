# MORSE CHAT Server

Run:

```powershell
$env:GOOGLE_CLIENT_ID="YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
node server/server.js
```

Open `http://localhost:8787` on the computer. Other devices on the same network can use `http://COMPUTER_IP:8787`.

For internet use, deploy this folder and the project `outputs/morse-pocket` folder to a Node.js hosting provider with HTTPS. The app automatically uses the same origin for its API.

The included server provides Google account IDs, messaging, matching, and persistent storage. Before a public release, add abuse reporting, moderation, and rate limits.

## Google Sign-In setup

1. Create an OAuth 2.0 Web Client ID in Google Cloud Console.
2. Add the deployed HTTPS domain and local development URL as authorized JavaScript origins.
3. Set `GOOGLE_CLIENT_ID` on the server.
4. Open MORSE CHAT through the server URL, not a `file://` URL.

Registration verifies the Google ID token on the server. New users create one unique nickname. Returning users sign in immediately with Google.

Profiles are stored with the account and support a changeable unique nickname, a short description, and an ASCII-art profile image.

## Railway MongoDB

Add a MongoDB service to the Railway project. In the MORSE CHAT app service, open **Variables**, choose **Add Reference**, and reference the MongoDB service's `MONGO_URL` variable as `MONGO_URL`.

```text
MONGO_URL=${{MongoDB.MONGO_URL}}
MONGO_DB_NAME=morse_chat
GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

Railway may display a different MongoDB service name. Use the variable reference picker instead of typing the URL by hand.

MongoDB stores accounts and nicknames, login sessions, profile data, direct-message history, Space signals, and Secret Communication event logs. Secret Communication logs contain session participants, start/end events, press/release timestamps, the reconstructed Morse sequence, and its decoded text. Random Signal live matching remains in server memory because it represents active connections rather than saved history.

## Push notifications

Set these Railway variables to enable notifications while the app is closed:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (for example, `mailto:admin@example.com`)

Push subscriptions and each user's Korean/English notification language are stored on their account. Notifications require the deployed HTTPS site and browser notification permission.

When no MongoDB URL is configured, the server falls back to `server/data.json` for local development. If an existing JSON file is available when MongoDB is first connected, its data is imported automatically while the MongoDB accounts collection is empty.

Open `/api/health` on the deployed domain to confirm the connection. A working MongoDB connection returns:

```json
{ "ok": true, "storage": { "type": "mongodb", "connected": true } }
```
