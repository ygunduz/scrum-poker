export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
  vote: string | null;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  revealed: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface RoomSummary {
  id: string;
  name: string;
  userCount: number;
  createdAt: Date;
} 