import { Server, Socket } from 'socket.io';
import { RoomManager } from '../services/RoomManager';

export const setupSocketHandlers = (io: Server, roomManager: RoomManager): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    let currentUserId: string | null = null;
    let currentRoomId: string | null = null;

    // Create a new room
    socket.on('create_room', ({ roomName, userName }, callback) => {
      try {
        const room = roomManager.createRoom(roomName, userName);
        const user = room.users[0]; // Creator is the first user
        
        currentUserId = user.id;
        currentRoomId = room.id;
        
        socket.join(room.id);
        
        callback({
          success: true,
          room,
          user
        });
      } catch (error) {
        callback({
          success: false,
          error: 'Failed to create room'
        });
      }
    });

    // Join an existing room
    socket.on('join_room', ({ roomId, userName }, callback) => {
      try {
        const result = roomManager.addUserToRoom(roomId, userName);
        
        if (!result) {
          return callback({
            success: false,
            error: 'Room not found'
          });
        }
        
        const { room, user } = result;
        
        currentUserId = user.id;
        currentRoomId = room.id;
        
        socket.join(room.id);
        
        // Notify other users in the room
        socket.to(room.id).emit('user_joined', { user });
        
        callback({
          success: true,
          room,
          user
        });
      } catch (error) {
        callback({
          success: false,
          error: 'Failed to join room'
        });
      }
    });

    // Submit a vote
    socket.on('submit_vote', ({ vote }, callback) => {
      try {
        if (!currentRoomId || !currentUserId) {
          return callback({
            success: false,
            error: 'Not in a room'
          });
        }

        const room = roomManager.submitVote(currentRoomId, currentUserId, vote);
        
        if (!room) {
          return callback({
            success: false,
            error: 'Room not found'
          });
        }
        
        // Notify all users in the room about the vote
        io.to(currentRoomId).emit('vote_update', {
          roomId: currentRoomId,
          userId: currentUserId,
          revealed: room.revealed,
          // Only send vote data if votes are revealed
          users: room.users.map(u => ({
            ...u,
            vote: room.revealed ? u.vote : (u.vote ? 'hidden' : null)
          }))
        });
        
        callback({
          success: true
        });
      } catch (error) {
        callback({
          success: false,
          error: 'Failed to submit vote'
        });
      }
    });

    // Reveal votes (admin only)
    socket.on('reveal_votes', (_, callback) => {
      try {
        if (!currentRoomId || !currentUserId) {
          return callback({
            success: false,
            error: 'Not in a room'
          });
        }

        const room = roomManager.getRoom(currentRoomId);
        
        if (!room) {
          return callback({
            success: false,
            error: 'Room not found'
          });
        }
        
        // Check if user is admin
        const user = room.users.find(u => u.id === currentUserId);
        
        if (!user || !user.isAdmin) {
          return callback({
            success: false,
            error: 'Not authorized'
          });
        }
        
        const updatedRoom = roomManager.revealVotes(currentRoomId);
        
        if (!updatedRoom) {
          return callback({
            success: false,
            error: 'Failed to reveal votes'
          });
        }
        
        io.to(currentRoomId).emit('votes_revealed', {
          users: updatedRoom.users
        });
        
        callback({
          success: true
        });
      } catch (error) {
        callback({
          success: false,
          error: 'Failed to reveal votes'
        });
      }
    });

    // Reset votes (admin only)
    socket.on('reset_votes', (_, callback) => {
      try {
        if (!currentRoomId || !currentUserId) {
          return callback({
            success: false,
            error: 'Not in a room'
          });
        }

        const room = roomManager.getRoom(currentRoomId);
        
        if (!room) {
          return callback({
            success: false,
            error: 'Room not found'
          });
        }
        
        // Check if user is admin
        const user = room.users.find(u => u.id === currentUserId);
        
        if (!user || !user.isAdmin) {
          return callback({
            success: false,
            error: 'Not authorized'
          });
        }
        
        const updatedRoom = roomManager.resetVotes(currentRoomId);
        
        if (!updatedRoom) {
          return callback({
            success: false,
            error: 'Failed to reset votes'
          });
        }
        
        io.to(currentRoomId).emit('votes_reset', {
          roomId: currentRoomId
        });
        
        callback({
          success: true
        });
      } catch (error) {
        callback({
          success: false,
          error: 'Failed to reset votes'
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      if (currentRoomId && currentUserId) {
        const room = roomManager.removeUserFromRoom(currentRoomId, currentUserId);
        
        if (room) {
          socket.to(currentRoomId).emit('user_left', {
            userId: currentUserId,
            users: room.users
          });
        }
      }
    });
  });
}; 