import React from 'react';
import { Mail, Calendar } from 'lucide-react';
import { useAuth } from '../stores/auth';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">
            {user.name[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail size={18} className="mr-2" />
              {user.email}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar size={18} className="mr-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};