import React, { useState } from 'react';
import { Search, Bell, User, HelpCircle, Settings } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-2 text-gray-700 hover:text-blue-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="text-blue-700 font-semibold text-lg">VM Manager Portal</div>
      </div>
      
      <div className="flex-1 max-w-2xl mx-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources, services, and docs (Ctrl+/)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
          <HelpCircle size={20} />
        </button>
        <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
          <Bell size={20} />
        </button>
        <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
          <Settings size={20} />
        </button>
        <div className="flex items-center">
          <button className="flex items-center text-sm text-gray-700 hover:text-blue-600 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2">
              <User size={18} />
            </div>
            <span className="hidden md:inline">admin@company.com</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;