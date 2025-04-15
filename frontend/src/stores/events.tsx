import React, { createContext, useState, useCallback, ReactNode } from 'react'
import { api } from '../lib/axios'

interface Event {
  id: string
  title: string
  description: string
  date: string
}

interface EventsContextType {
  events: Event[]
  fetchEvents: () => Promise<void>
}

const EventsContext = createContext({} as EventsContextType)

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])

  const fetchEvents = useCallback(async () => {
    const response = await api.get('/events')
    setEvents(response.data)
  }, [])

  return (
    <EventsContext.Provider value={{ events, fetchEvents }}>
      {children}
    </EventsContext.Provider>
  )
}

// Removed useEvents hook to comply with Fast Refresh requirements.
