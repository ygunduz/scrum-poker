import { v4 as uuidv4 } from 'uuid';
import { Room, User, RoomSummary } from '../types';

export class RoomManager {
  private rooms: Map<string, Room>;
  private readonly INACTIVE_TIMEOUT = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.rooms = new Map<string, Room>();
    
    // Clean up inactive rooms periodically
    setInterval(() => this.cleanupInactiveRooms(), 1000 * 60 * 15); // Every 15 minutes
  }

  createRoom(name: string, creatorName: string): Room {
    const roomId = uuidv4();
    const userId = uuidv4();

    const creator: User = {
      id: userId,
      name: creatorName,
      isAdmin: true,
      vote: null
    };

    const newRoom: Room = {
      id: roomId,
      name: name || `Room ${roomId.substring(0, 6)}`,
      users: [creator],
      revealed: false,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  getRoom(roomId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (room) {
      room.lastActivity = new Date();
    }
    return room;
  }

  addUserToRoom(roomId: string, userName: string): { room: Room; user: User } | null {
    const room = this.getRoom(roomId);
    
    if (!room) {
      return null;
    }

    const userId = uuidv4();
    const newUser: User = {
      id: userId,
      name: userName,
      isAdmin: false,
      vote: null
    };

    room.users.push(newUser);
    room.lastActivity = new Date();
    
    return { room, user: newUser };
  }

  removeUserFromRoom(roomId: string, userId: string): Room | null {
    const room = this.getRoom(roomId);
    
    if (!room) {
      return null;
    }

    room.users = room.users.filter(user => user.id !== userId);
    room.lastActivity = new Date();

    // If the room is empty, remove it
    if (room.users.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    // If admin left, promote the first user to admin
    if (!room.users.some(user => user.isAdmin) && room.users.length > 0) {
      room.users[0].isAdmin = true;
    }

    return room;
  }

  submitVote(roomId: string, userId: string, vote: string): Room | null {
    const room = this.getRoom(roomId);
    
    if (!room) {
      return null;
    }

    const user = room.users.find(u => u.id === userId);
    
    if (!user) {
      return null;
    }

    user.vote = vote;
    room.lastActivity = new Date();
    
    return room;
  }

  revealVotes(roomId: string): Room | null {
    const room = this.getRoom(roomId);
    
    if (!room) {
      return null;
    }

    room.revealed = true;
    room.lastActivity = new Date();
    
    return room;
  }

  resetVotes(roomId: string): Room | null {
    const room = this.getRoom(roomId);
    
    if (!room) {
      return null;
    }

    room.revealed = false;
    room.users.forEach(user => {
      user.vote = null;
    });
    
    room.lastActivity = new Date();
    
    return room;
  }

  getRoomsList(): RoomSummary[] {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.length,
      createdAt: room.createdAt
    }));
  }

  private cleanupInactiveRooms(): void {
    const now = new Date();
    
    this.rooms.forEach((room, roomId) => {
      const inactiveTime = now.getTime() - room.lastActivity.getTime();
      
      if (inactiveTime > this.INACTIVE_TIMEOUT) {
        this.rooms.delete(roomId);
      }
    });
  }
} 