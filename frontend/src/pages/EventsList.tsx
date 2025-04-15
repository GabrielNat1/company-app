import React from 'react';
import { Calendar, Users } from 'lucide-react';
import type { Event } from '../types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Tech Conference',
    description: 'Join us for our annual technology conference featuring industry experts.',
    date: '2024-05-15',
    registrations: 156
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'Be the first to see our new product line.',
    date: '2024-04-20',
    registrations: 89
  }
];

export const EventsList: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockEvents.map((event) => (
        <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{event.description}</p>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar size={18} className="mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Users size={18} className="mr-2" />
                  {event.registrations} registered
                </div>
              </div>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Register
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};