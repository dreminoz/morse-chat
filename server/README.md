# MORSE CHAT Server

Run:

```powershell
$env:GOOGLE_CLIENT_ID="YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
node server/server.js
```

Open `http://localhost:8787` on the computer. Other devices on the same network can use `http://COMPUTER_IP:8787`.

For internet use, deploy this folder and the project `outputs/morse-pocket` folder to a Node.js hosting provider with HTTPS. Set the app's server address in Settings.

The included server provides working IDs, messaging, matching, and persistence for a prototype. Before a public release, add account authentication, abuse reporting, moderation, rate limits, and a managed database.

## Google Sign-In setup

1. Create an OAuth 2.0 Web Client ID in Google Cloud Console.
2. Add the deployed HTTPS domain and local development URL as authorized JavaScript origins.
3. Set `GOOGLE_CLIENT_ID` on the server.
4. Open MORSE CHAT through the server URL, not a `file://` URL.

Registration verifies the Google ID token on the server. Users must also create a unique nickname and an 8-character-or-longer password. Passwords are stored as `scrypt` hashes.

## Railway persistent storage

Attach a Railway volume mounted at `/data`, then set:

```text
DATA_DIR=/data
GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

The public Railway domain serves both the app and API, so the app automatically connects to the same server.
