import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Plus, RefreshCw, Filter, Download, Search, MoreHorizontal, Play, Square, RotateCcw, Database, Copy, Eye, EyeOff } from 'lucide-react';
import DatabaseStatusBadge from '../components/DatabaseStatusBadge';

const Databases: React.FC = () => {
  const { databases, updateDatabaseStatus } = useDatabaseContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showConnectionStrings, setShowConnectionStrings] = useState<Record<string, boolean>>({});
  
  const filteredDatabases = databases.filter(db => 
    db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.engine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (dbId: string, newStatus: 'Running' | 'Stopped' | 'Failed') => {
    updateDatabaseStatus(dbId, newStatus);
  };

  const toggleConnectionString = (dbId: string) => {
    setShowConnectionStrings(prev => ({
      ...prev,
      [dbId]: !prev[dbId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getEngineIcon = (engine: string) => {
    const iconClass = "w-5 h-5";
    switch (engine) {
      case 'MySQL':
        return <div className={`${iconClass} bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold`}>My</div>;
      case 'PostgreSQL':
        return <div className={`${iconClass} bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold`}>Pg</div>;
      case 'SQL Server':
        return <div className={`${iconClass} bg-red-600 rounded text-white flex items-center justify-center text-xs font-bold`}>MS</div>;
      case 'MongoDB':
        return <div className={`${iconClass} bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold`}>Mo</div>;
      case 'Redis':
        return <div className={`${iconClass} bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold`}>Re</div>;
      case 'MariaDB':
        return <div className={`${iconClass} bg-blue-800 rounded text-white flex items-center justify-center text-xs font-bold`}>Ma</div>;
      default:
        return <Database size={20} className="text-blue-700" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Databases</h1>
          <p className="text-gray-600">Manage your database infrastructure</p>
        </div>
        <button 
          onClick={() => navigate('/create-database')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Database
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="Filter databases..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="border border-gray-300 rounded-md px-3 py-2 flex items-center text-gray-700 hover:bg-gray-50">
              <Filter size={18} className="mr-2" />
              <span>Filter</span>
            </button>
            <button className="border border-gray-300 rounded-md px-3 py-2 flex items-center text-gray-700 hover:bg-gray-50">
              <RefreshCw size={18} className="mr-2" />
              <span>Refresh</span>
            </button>
            <button className="border border-gray-300 rounded-md px-3 py-2 flex items-center text-gray-700 hover:bg-gray-50">
              <Download size={18} className="mr-2" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engine
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource Group
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Storage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Connection
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDatabases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No databases found. <Link to="/create-database" className="text-blue-600 hover:underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                filteredDatabases.map((db) => (
                  <tr key={db.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/database/${db.id}`} className="flex items-center">
                        <div className="bg-blue-100 rounded p-1 mr-3">
                          {getEngineIcon(db.engine)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-600 hover:underline">{db.name}</div>
                          <div className="text-xs text-gray-500">{db.engine} {db.version}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DatabaseStatusBadge status={db.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{db.engine}</div>
                        <div className="text-xs text-gray-400">v{db.version}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {db.tier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {db.resourceGroup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {db.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {db.storage} GB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleConnectionString(db.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title={showConnectionStrings[db.id] ? "Hide connection string" : "Show connection string"}
                        >
                          {showConnectionStrings[db.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(db.connectionString)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Copy connection string"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      {showConnectionStrings[db.id] && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                          {db.connectionString}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {db.status !== 'Running' && (
                          <button 
                            onClick={() => handleStatusChange(db.id, 'Running')}
                            className="text-green-600 hover:text-green-800" 
                            title="Start"
                          >
                            <Play size={18} />
                          </button>
                        )}
                        {db.status !== 'Stopped' && (
                          <button 
                            onClick={() => handleStatusChange(db.id, 'Stopped')}
                            className="text-red-600 hover:text-red-800" 
                            title="Stop"
                          >
                            <Square size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusChange(db.id, 'Running')}
                          className="text-orange-600 hover:text-orange-800" 
                          title="Restart"
                        >
                          <RotateCcw size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800" title="More actions">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing {filteredDatabases.length} of {databases.length} databases
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Database Status</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View all</button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-3xl font-semibold text-green-600">
                  {databases.filter(db => db.status === 'Running').length}
                </div>
                <div className="text-sm text-gray-600">Running</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="text-3xl font-semibold text-red-600">
                  {databases.filter(db => db.status === 'Stopped').length}
                </div>
                <div className="text-sm text-gray-600">Stopped</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="text-3xl font-semibold text-yellow-600">
                  {databases.filter(db => db.status === 'Failed').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-3xl font-semibold text-blue-600">
                  {databases.filter(db => db.status === 'Creating').length}
                </div>
                <div className="text-sm text-gray-600">Creating</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Database Engines</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {['MySQL', 'PostgreSQL', 'SQL Server', 'MongoDB', 'Redis', 'MariaDB'].map(engine => {
                const count = databases.filter(db => db.engine === engine).length;
                return (
                  <div key={engine} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {getEngineIcon(engine)}
                      </div>
                      <span className="text-sm text-gray-700">{engine}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Storage Usage</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="text-2xl font-semibold text-gray-800">
                {databases.reduce((total, db) => total + db.storage, 0)} GB
              </div>
              <div className="text-sm text-gray-600">Total allocated storage</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Production</span>
                <span className="text-sm font-medium">
                  {databases.filter(db => db.resourceGroup.includes('production')).reduce((total, db) => total + db.storage, 0)} GB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Development</span>
                <span className="text-sm font-medium">
                  {databases.filter(db => db.resourceGroup.includes('development')).reduce((total, db) => total + db.storage, 0)} GB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Analytics</span>
                <span className="text-sm font-medium">
                  {databases.filter(db => db.resourceGroup.includes('analytics')).reduce((total, db) => total + db.storage, 0)} GB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Databases;