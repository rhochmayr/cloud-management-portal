import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Server, Database, HardDrive, Network, Shield, Settings, Layers, CreditCard } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Virtual Machines', icon: <Server size={20} />, path: '/vms' },
    { name: 'Databases', icon: <Database size={20} />, path: '/databases' },
    { name: 'Storage', icon: <HardDrive size={20} />, path: '/storage' },
    { name: 'Networking', icon: <Network size={20} />, path: '/networking' },
    { name: 'Security', icon: <Shield size={20} />, path: '/security' },
    { name: 'Monitoring', icon: <Layers size={20} />, path: '/monitoring' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Billing', icon: <CreditCard size={20} />, path: '/billing' },
  ];

  return (
    <aside 
      className={`bg-[#242526] text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } h-full overflow-y-auto flex flex-col`}
    >
      <div className="flex items-center p-4 border-b border-gray-700">
        <div className="bg-blue-600 rounded w-8 h-8 flex items-center justify-center">
          <Server size={20} className="text-white" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-semibold text-lg">VM Manager</span>
        )}
      </div>
      
      <nav className="flex-1 py-4">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="mb-1">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 hover:bg-gray-700 ${
                    isActive || item.active ? 'border-l-4 border-blue-500 bg-gray-800' : ''
                  }`
                }
              >
                <span className="text-gray-400">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        {!collapsed && <span>VM Manager Portal v1.0</span>}
      </div>
    </aside>
  );
};

export default Sidebar;