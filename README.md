# SyncRoom 🔴
> Real-time micro-events PWA for students — create a room, share the link, sync instantly.

![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square)
![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square)
![Live](https://img.shields.io/badge/Live-syncroom--ke.vercel.app-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

🌐 **Live Demo:** [syncroom-ke.vercel.app](https://syncroom-ke.vercel.app)

---

## What It Does
SyncRoom lets students spin up private, invite-only real-time rooms instantly — no accounts, no friction. Share a link, join the room, collaborate in sync.

---

## Features
- 🔒 Private invite-only rooms with unique room codes
- ⚡ Real-time sync powered by Firebase Realtime Database
- 📱 Fully responsive — works on mobile and desktop
- 📲 PWA installable — add to home screen like a native app
- 🚀 No signup required to join a room

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend / Realtime | Firebase Realtime Database |
| Auth | Firebase Anonymous Auth |
| Deployment | Vercel |
| PWA | Vite PWA Plugin |

---

## Run Locally
```bash
git clone https://github.com/samkiva/syncroom.git
cd syncroom
npm install
npm run dev
```

> Add your Firebase config to `.env.local` before running.

---

## Architecture
```
Client (React/Vite PWA)
        │
        ▼
Firebase Realtime DB ◄──► All connected room clients
```
All room state (participants, events) lives in Firebase and propagates to every connected client in real time — no polling, no delays.

---

## Use Cases
- Study group coordination
- Campus event check-ins
- Real-time Q&A sessions during lectures
- Group countdown timers / shared focus sessions

---

## Author
**Samuel Kivairu** — [@samkiva](https://github.com/samkiva)  
Statistics & Data Science | University of Nairobi
