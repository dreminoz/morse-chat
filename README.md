# MORSE CHAT

MORSE CHAT is a mobile-first Morse code messenger and training app.

## Features

- Save and play phrases as Morse vibration
- Alphabet, Morse-order, sentence, repeat, and quiz training
- Morse writing and A-Z reference
- Friend conversations with text, hidden vibration signals, and ASCII-art photos
- Korean and English interface
- Real-time friend chat, Space signals, and random matching through the included Node.js server
- Android WebView wrapper source

## Run

Set `GOOGLE_CLIENT_ID`, run `node server/server.js`, then open `http://localhost:8787`.

The Android wrapper source is in `work/morse-pocket-android`.

Devices on the same Wi-Fi can use the computer's local IP address. Internet-wide use requires deploying the server with HTTPS.

Google registration is required for Conversations, Space, and Random Signal. Training remains available without an account.

For Railway deployment, add a MongoDB service and reference its `MONGO_URL` variable from the MORSE CHAT app service. MongoDB stores users, nicknames, profiles, direct-message history, login sessions, and Space signals.
