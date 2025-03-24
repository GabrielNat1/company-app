import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState({
    name: '',
    birthDate: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    axios.get('/api/users/profile')
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  const handleUpdateProfile = () => {
    axios.put('/api/users/profile', user)
      .then(response => setUser(response.data))
      .catch(error => console.error('Error updating profile:', error));
  };

  const handleLogout = () => {
    axios.post('/api/auth/logout')
      .then(() => window.location.href = '/login')
      .catch(error => console.error('Error logging out:', error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="date"
          value={user.birthDate}
          onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleUpdateProfile}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Update Profile
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
