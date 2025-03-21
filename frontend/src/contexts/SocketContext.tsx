import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, User } from '../types';

// Get the API URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
  currentRoom: Room | null;
  currentUser: User | null;
  createRoom: (roomName: string, userName: string) => Promise<{ room: Room; user: User }>;
  joinRoom: (roomId: string, userName: string) => Promise<{ room: Room; user: User }>;
  submitVote: (vote: string) => Promise<void>;
  revealVotes: () => Promise<void>;
  resetVotes: () => Promise<void>;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Connect to the socket server
    const socketInstance = io(API_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setConnected(false);
    });

    socketInstance.on('user_joined', ({ user }) => {
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          users: [...prevRoom.users, user],
        };
      });
    });

    socketInstance.on('user_left', ({ users }) => {
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          users,
        };
      });
    });

    socketInstance.on('vote_update', ({ users, revealed }) => {
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          users,
          revealed,
        };
      });
    });

    socketInstance.on('votes_revealed', ({ users }) => {
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          users,
          revealed: true,
        };
      });
    });

    socketInstance.on('votes_reset', () => {
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          users: prevRoom.users.map(user => ({ ...user, vote: null })),
          revealed: false,
        };
      });
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Create a new room
  const createRoom = (roomName: string, userName: string): Promise<{ room: Room; user: User }> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('create_room', { roomName, userName }, (response: any) => {
        if (response.success) {
          setCurrentRoom(response.room);
          setCurrentUser(response.user);
          resolve({ room: response.room, user: response.user });
        } else {
          reject(new Error(response.error || 'Failed to create room'));
        }
      });
    });
  };

  // Join an existing room
  const joinRoom = (roomId: string, userName: string): Promise<{ room: Room; user: User }> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('join_room', { roomId, userName }, (response: any) => {
        if (response.success) {
          setCurrentRoom(response.room);
          setCurrentUser(response.user);
          resolve({ room: response.room, user: response.user });
        } else {
          reject(new Error(response.error || 'Failed to join room'));
        }
      });
    });
  };

  // Submit a vote
  const submitVote = (vote: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('submit_vote', { vote }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to submit vote'));
        }
      });
    });
  };

  // Reveal votes (admin only)
  const revealVotes = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('reveal_votes', {}, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to reveal votes'));
        }
      });
    });
  };

  // Reset votes (admin only)
  const resetVotes = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('reset_votes', {}, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to reset votes'));
        }
      });
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        currentRoom,
        currentUser,
        createRoom,
        joinRoom,
        submitVote,
        revealVotes,
        resetVotes,
        setCurrentRoom,
        setCurrentUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}; 