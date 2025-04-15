export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  registrations: number
}

export interface Message {
  userId: string
  userName: string
  content: string
  timestamp: string
}
