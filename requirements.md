**Project: Scrum Poker Web Application**

**Tech Stack:**
- Frontend: React.js + Material-UI + Vite
- Backend: Node.js + Express + Socket.io
- Real-Time Communication: WebSocket via Socket.io

**Core Requirements:**

1. **Frontend Features:**
   - User authentication (simple nickname entry)
   - Lobby screen to create/join poker rooms
   - Poker room interface with:
     - Card deck (Fibonacci sequence: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?)
     - Selected card highlight
     - Participants list
     - Vote reveal/reset controls (admin-only)
   - Responsive design using Material-UI components
   - Real-time updates via Socket.io

2. **Backend Features:**
   - Room management (create/join/leave)
   - WebSocket communication for:
     - Vote submissions
     - Results revelation
     - Participant updates
   - Session persistence for active rooms
   - Basic validation and error handling

**User Stories:**
- As a user, I can enter my nickname and join/create a room
- As a participant, I can select a story point card
- As a moderator, I can reveal/reset votes
- All users see real-time updates of votes and participants

**Technical Specifications:**

1. **Frontend Structure:**
   - Components:
     - HomePage (Nickname entry)
     - Lobby (Room creation/joining)
     - PokerRoom (Main voting interface)
   - Context API for state management
   - React Router for navigation
   - Socket.io client integration

2. **Backend Structure:**
   - Express server with Socket.io
   - Room manager class handling:
     - Active rooms
     - Participants
     - Vote states
   - Event handlers for:
     - 'create_room'
     - 'join_room' 
     - 'submit_vote'
     - 'reveal_votes'
     - 'reset_votes'

**Requested Output:**
1. Basic project structure with dependencies
2. Core component skeletons with Material-UI styling
3. Socket.io event handling examples
4. Server-side room management implementation
5. Key code snippets for:
   - Card selection UI
   - Real-time vote updates
   - Admin controls
   - Participant list synchronization

**Additional Considerations:**
- Use TypeScript for both frontend and backend
- Include basic input validation
- Implement auto-disconnect after inactivity
- Add loading states for UI interactions
- Persist room data temporarily using in-memory storage
