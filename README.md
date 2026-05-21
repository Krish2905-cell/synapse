# Synapse

A real-time collaborative project management platform — Kanban boards, chat, notes, and whiteboard in one workspace.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Socket.io-client, React Router v6
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io
- **Auth**: JWT (HTTP-only cookies) + bcrypt

## Project Structure

```
synapse/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── .env
├── server/          # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   └── .env
└── package.json     # Root (concurrently)
```

## Setup

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 2. Configure environment

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/synapse
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**client/.env**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
# Root
npm install

# Server
cd server && npm install

# Client
cd client && npm install
```

### 4. Run

```bash
# From root — runs both server and client
npm run dev

# Or separately:
npm run server   # Express on :5000
npm run client   # React on :3000
```

## Features

- JWT auth with HTTP-only cookies
- Dashboard with project cards and pending invitations
- Kanban board with drag-and-drop (real-time via Socket.io)
- Project chat (real-time)
- Notes with auto-save
- Collaborative whiteboard (freehand, shapes, real-time sync)
- Invitation system (invite by email, accept/reject)
- Owner/Member permission roles

```
Synapse Project
├─ client
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ src
│  │  ├─ App.js
│  │  ├─ components
│  │  │  ├─ Avatar.js
│  │  │  ├─ ChatPanel.js
│  │  │  ├─ InvitationCard.js
│  │  │  ├─ KanbanBoard.js
│  │  │  ├─ Logo.js
│  │  │  ├─ MeetingRoom.js
│  │  │  ├─ modals
│  │  │  │  ├─ CreateProjectModal.js
│  │  │  │  ├─ InviteModal.js
│  │  │  │  └─ TaskModal.js
│  │  │  ├─ Navbar.js
│  │  │  ├─ NotesPanel.js
│  │  │  ├─ ProjectCard.js
│  │  │  └─ WhiteboardPanel.js
│  │  ├─ context
│  │  │  ├─ AuthContext.js
│  │  │  └─ SocketContext.js
│  │  ├─ index.css
│  │  ├─ index.js
│  │  ├─ pages
│  │  │  ├─ DashboardPage.js
│  │  │  ├─ LandingPage.js
│  │  │  ├─ LoginPage.js
│  │  │  ├─ ProjectPage.js
│  │  │  └─ SignupPage.js
│  │  └─ services
│  │     └─ api.js
│  └─ tailwind.config.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ server
   ├─ config
   │  └─ db.js
   ├─ controllers
   │  ├─ authController.js
   │  ├─ invitationController.js
   │  ├─ messageController.js
   │  ├─ noteController.js
   │  ├─ projectController.js
   │  ├─ taskController.js
   │  └─ whiteboardController.js
   ├─ middleware
   │  ├─ auth.js
   │  └─ projectAccess.js
   ├─ models
   │  ├─ Invitation.js
   │  ├─ Message.js
   │  ├─ Note.js
   │  ├─ Project.js
   │  ├─ Task.js
   │  ├─ User.js
   │  └─ Whiteboard.js
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ auth.js
   │  ├─ invitations.js
   │  ├─ messages.js
   │  ├─ notes.js
   │  ├─ projects.js
   │  ├─ tasks.js
   │  └─ whiteboard.js
   ├─ server.js
   └─ sockets
      ├─ chatSocket.js
      ├─ index.js
      ├─ meetingSocket.js
      ├─ taskSocket.js
      └─ whiteboardSocket.js

```