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

export type Card = {
  value: string;
  label: string;
};

export const CARD_DECK: Card[] = [
  { value: '0', label: '☕️' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '5', label: '5' },
  { value: '8', label: '8' },
  { value: '13', label: '13' },
  { value: '21', label: '21' },
  { value: '?', label: '?' }
]; 