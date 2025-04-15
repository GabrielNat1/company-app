import { create } from 'zustand';
import { api } from '../lib/axios';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  participants: number;
};

type EventsStore = {
  events: Event[];
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  createEvent: (data: CreateEventData) => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
};

type CreateEventData = {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
};

export const useEvents = create<EventsStore>((set) => ({
  events: [],
  isLoading: false,

  fetchEvents: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get<Event[]>('/events');
      set({ events: response.data as Event[] });
    } finally {
      set({ isLoading: false });
    }
  },

  createEvent: async (data) => {
    try {
      set({ isLoading: true });
      await api.post('/events', data);
      const response = await api.get('/events');
      set({ events: response.data as Event[] });
    } finally {
      set({ isLoading: false });
    }
  },

  joinEvent: async (eventId) => {
    try {
      set({ isLoading: true });
      await api.post(`/events/${eventId}/join`);
      const response = await api.get('/events');
      set({ events: response.data as Event[] });
    } finally {
      set({ isLoading: false });
    }
  },
}));