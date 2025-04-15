export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  registrations: number;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}
