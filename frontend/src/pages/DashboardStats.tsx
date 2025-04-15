import React from 'react';
import { Users, Calendar, MessageSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1 dark:text-white">{value}</p>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  </div>
);

const userActivityData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 800 },
  { name: 'Apr', users: 1000 },
  { name: 'May', users: 1200 },
  { name: 'Jun', users: 1234 },
];

export const DashboardStats: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={1234}
          icon={<Users size={24} />}
        />
        <StatsCard
          title="Active Events"
          value={12}
          icon={<Calendar size={24} />}
        />
        <StatsCard
          title="Chat Messages"
          value={856}
          icon={<MessageSquare size={24} />}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">User Growth</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userActivityData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
              <XAxis dataKey="name" className="dark:text-gray-400" />
              <YAxis className="dark:text-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};