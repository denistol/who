# 🤙 Who Wants to Be a Millionaire — Quiz Game

### Vercel url:

https://who-cmvlovm69-denis-projects-adf6d64c.vercel.app/

---

An interactive quiz game built with **Next.js, TypeScript, TailwindCSS, and Firebase**.

The application automatically persists the user session in the browser and synchronizes it with Firebase, allowing the game to continue seamlessly even after a page reload.

---

## Project Overview

This project is a browser-based quiz game inspired by *"Who Wants to Be a Millionaire"*.

### Key Features

- ✅ Step-by-step question flow  
- ✅ Answer state highlighting (selected / correct / wrong)  
- ✅ Score tracking system  
- ✅ Automatic session persistence in the browser  
- ✅ Real-time synchronization with Firebase  
- ✅ Game state restoration after page reload  
- ✅ Fully responsive UI (mobile + desktop)  

---

## 🧠 Session Management Logic

The game implements a persistent session system:

1. When a user starts the game, a new session is created.
2. The `sessionId` is stored in `localStorage`.
3. The session state is saved in Firebase.
4. On page reload:
   - The app retrieves `sessionId` from `localStorage`.
   - The latest session state is fetched from Firebase.
   - The game resumes from the current question.
5. If the session is finished, the result screen is shown.
6. Starting a new game destroys the current session and creates a new one.

This ensures the game is resilient to refreshes or accidental tab closures.

---

## 🏗 Tech Stack

- **Next.js** — React framework (App Router, API routes)
- **TypeScript** — Type safety and better maintainability
- **TailwindCSS** — Utility-first styling
- **Firebase** — Backend & session persistence
- **LocalStorage API** — Client-side session identifier storage

---

## Required .env variables

```
API_KEY
AUTH_DOMAIN
PROJECT_ID
STORAGE_BUCKET
MESSAGING_SENDER_ID
APP_ID
MEASUREMENT_ID
NEXT_PUBLIC_BASE_URL
```


## 📦 Installation

```bash
git clone <repository-url>
cd project-name
npm install && npm run dev


