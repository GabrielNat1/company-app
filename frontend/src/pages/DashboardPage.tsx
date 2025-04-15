import React, { useState } from 'react';
import { LayoutDashboard, Calendar, MessageSquare, User, Moon, LogOut, Sun } from 'lucide-react';
import { useAuth } from '../stores/auth';
import { DashboardStats } from '../components/DashboardStats';
import { EventsList } from './EventsList';
import { LiveChat } from './LiveChat';
import { UserProfile } from './UserProfile';

export function DashboardPage() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);


  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'chat', label: 'Live Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Ensure tabs are used in the sidebar navigation
  const renderTabs = () => (
    tabs.map((tab) => {
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
            activeTab === tab.id
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border-r-4 border-blue-500'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <Icon size={20} className={isExpanded ? 'mr-3' : 'mx-auto'} />
          <span className={`transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>
            {tab.label}
          </span>
        </button>
      );
    })
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
            <DashboardStats />
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Events</h1>
            <EventsList />
          </div>
        );
      case 'chat':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Live Chat</h1>
            <LiveChat />
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold dark:text-white">Profile</h1>
            <UserProfile />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors`}>
      <div className="flex">
        {/* Sidebar */}
        <div 
          className={`fixed h-screen bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-64' : 'w-20'
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className={`p-6 flex items-center justify-between ${isExpanded ? '' : 'justify-center'}`}>
            {isExpanded && (
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin</h1>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? (
                <Sun className="text-gray-500 dark:text-gray-400" size={20} />
              ) : (
                <Moon className="text-gray-500" size={20} />
              )}
            </button>
          </div>
          <nav className="mt-6 flex flex-col justify-between h-[calc(100vh-100px)]">
            <div>
              {renderTabs()}
            </div>

            {/* Logout button at bottom */}
            <button
              onClick={signOut}
              className="w-full flex items-center px-6 py-3 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <LogOut size={20} className={isExpanded ? 'mr-3' : 'mx-auto'} />
              <span className={`transition-opacity duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                Logout
              </span>
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className={`transition-all duration-300 flex-1 p-8 ${
          isExpanded ? 'ml-64' : 'ml-20'
        }`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
