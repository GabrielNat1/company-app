import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0 });

  useEffect(() => {
    axios.get('/api/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Total Users</h2>
        <p className="text-3xl">{stats.totalUsers}</p>
      </div>
    </div>
  );
}

export default Dashboard;
