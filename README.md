# SyncRoom

Real-time micro-events for students, developers, and communities.

## Live Demo
[SyncRoom App](https://syncroom-ke.vercel.app)

## Features
- Create and join time-limited rooms (15, 30, 45, 60 min)
- Real-time live chat
- Participant presence
- Auto-expiring sessions with countdown timer
- Anonymous authentication — no sign-up required
- Categories: Study, Coding, Prayer, Chill

## Tech Stack
- React + Vite
- Firebase Auth (Anonymous)
- Cloud Firestore
- React Router DOM
- Vercel (deployment)

## Local Setup
1. Clone the repo
2. npm install
3. Copy .env.example to .env and add your Firebase values
4. Enable Anonymous Auth in Firebase Console
5. npm run dev

## Environment Variables
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

## Author
HexSentinel — https://github.com/samkiva