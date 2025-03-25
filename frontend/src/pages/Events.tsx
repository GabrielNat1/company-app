import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Events() {
  const [events, setEvents] = useState<{ id: number; title: string; description: string; date: string; location: string; capacity: number; }[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 0,
  });

  useEffect(() => {
    axios.get('/api/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleCreateEvent = () => {
    axios.post('/api/events', newEvent)
      .then(response => setEvents([...events, response.data]))
      .catch(error => console.error('Error creating event:', error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Create Event</h2>
        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="datetime-local"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newEvent.capacity}
          onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreateEvent}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create Event
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Event List</h2>
        {events.map(event => (
          <div key={event.id} className="mb-2">
            <Link to={`/events/${event.id}`} className="text-blue-500">
              {event.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
