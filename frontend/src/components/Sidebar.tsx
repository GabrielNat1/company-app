import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-200 p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/dashboard" className="block p-2 bg-gray-300 rounded">Dashboard</Link>
        </li>
        <li>
          <Link to="/events" className="block p-2 bg-gray-300 rounded">Events</Link>
        </li>
        <li>
          <Link to="/chat" className="block p-2 bg-gray-300 rounded">Chat</Link>
        </li>
        <li>
          <Link to="/profile" className="block p-2 bg-gray-300 rounded">Profile</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
