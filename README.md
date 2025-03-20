# Scrum Poker App

A real-time Scrum Poker application for agile estimation sessions, built with React, Material-UI, Socket.io, Node.js, and Express.

## Features

- User authentication with simple nickname entry
- Create and join poker rooms
- Real-time voting with Fibonacci sequence cards
- Participants list with voting status
- Admin controls for revealing and resetting votes
- Responsive design with Material-UI components

## Project Structure

The project is divided into two main parts:

- `frontend/`: React.js application with Material-UI and Socket.io client
- `backend/`: Node.js and Express server with Socket.io for real-time communication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Open the app in your browser
2. Enter your name
3. Create a new room or join an existing one with a room ID
4. Select cards to vote
5. As an admin, reveal votes when everyone has voted
6. Reset votes for a new round

## Technologies Used

- **Frontend**:
  - React.js
  - TypeScript
  - Material-UI
  - Socket.io Client
  - React Router

- **Backend**:
  - Node.js
  - Express
  - Socket.io
  - TypeScript 