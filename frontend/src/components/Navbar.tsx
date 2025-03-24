import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link to="/dashboard" className="text-xl font-bold">WorkSphere</Link>
        <div className="space-x-4">
          <Link to="/events" className="hover:underline">Events</Link>
          <Link to="/chat" className="hover:underline">Chat</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
