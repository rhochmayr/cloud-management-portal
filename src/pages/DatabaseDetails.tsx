import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Database, Play, Square, RotateCcw, Download, Shield, Clipboard, Settings, HardDrive, Network, Activity, Copy, Eye, EyeOff } from 'lucide-react';
import DatabaseStatusBadge from '../components/DatabaseStatusBadge';

interface TabProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
      active 
        ? 'text-blue-600 border-blue-600' 
        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

const DatabaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { databases, updateDatabaseStatus } = useDatabaseContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showConnectionString, setShowConnectionString] = useState(false);
  
  const database = databases.find(db => db.id === id);
  
  if (!database) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">Database Not Found</h2>
        <p className="mt-2 text-gray-600">The database you're looking for doesn't exist or has been deleted.</p>
        <Link to="/databases" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to Database List
        </Link>
      </div>
    );
  }
  
  const handleStatusChange = (newStatus: 'Running' | 'Stopped' | 'Failed') => {
    updateDatabaseStatus(database.id, newStatus);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getEngineIcon = (engine: string) => {
    const iconClass = "w-6 h-6";
    switch (engine) {
      case 'MySQL':
        return <div className={`${iconClass} bg-orange-500 rounded text-white flex items-center justify-center text-sm font-bold`}>My</div>;
      case 'PostgreSQL':
        return <div className={`${iconClass} bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold`}>Pg</div>;
      case 'SQL Server':
        return <div className={`${iconClass} bg-red-600 rounded text-white flex items-center justify-center text-sm font-bold`}>MS</div>;
      case 'MongoDB':
        return <div className={`${iconClass} bg-green-600 rounded text-white flex items-center justify-center text-sm font-bold`}>Mo</div>;
      case 'Redis':
        return <div className={`${iconClass} bg-red-500 rounded text-white flex items-center justify-center text-sm font-bold`}>Re</div>;
      case 'MariaDB':
        return <div className={`${iconClass} bg-blue-800 rounded text-white flex items-center justify-center text-sm font-bold`}>Ma</div>;
      default:
        return <Database size={24} className="text-blue-700" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded p-2 mr-3">
            {getEngineIcon(database.engine)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{database.name}</h1>
            <div className="flex items-center mt-1">
              <DatabaseStatusBadge status={database.status} />
              <span className="ml-2 text-sm text-gray-600">{database.engine} {database.version}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {database.status !== 'Running' && (
            <button 
              onClick={() => handleStatusChange('Running')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Play size={16} className="mr-2" />
              Start
            </button>
          )}
          {database.status === 'Running' && (
            <button 
              onClick={() => handleStatusChange('Stopped')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Square size={16} className="mr-2" />
              Stop
            </button>
          )}
          <button 
            onClick={() => handleStatusChange('Running')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RotateCcw size={16} className="mr-2" />
            Restart
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download size={16} className="mr-2" />
            Backup
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <Tab
              active={activeTab === 'overview'}
              icon={<Database size={16} />}
              label="Overview"
              onClick={() => setActiveTab('overview')}
            />
            <Tab
              active={activeTab === 'activity'}
              icon={<Activity size={16} />}
              label="Activity log"
              onClick={() => setActiveTab('activity')}
            />
            <Tab
              active={activeTab === 'networking'}
              icon={<Network size={16} />}
              label="Networking"
              onClick={() => setActiveTab('networking')}
            />
            <Tab
              active={activeTab === 'security'}
              icon={<Shield size={16} />}
              label="Security"
              onClick={() => setActiveTab('security')}
            />
            <Tab
              active={activeTab === 'settings'}
              icon={<Settings size={16} />}
              label="Settings"
              onClick={() => setActiveTab('settings')}
            />
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Essentials</h3>
                  </div>
                  <div className="p-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Resource group</dt>
                        <dd className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer">{database.resourceGroup}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1"><DatabaseStatusBadge status={database.status} /></dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.location}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Subscription</dt>
                        <dd className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer">{database.subscription}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Engine</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.engine} {database.version}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tier</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.tier}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Compute size</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.computeSize}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Storage</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.storage} GB</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Server endpoint</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          {database.endpoint}
                          <button 
                            onClick={() => copyToClipboard(database.endpoint)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <Clipboard size={14} />
                          </button>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Port</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.port}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Time created</dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(database.created).toLocaleString()}</dd>
                      </div>
                      {database.lastBackup && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Last backup</dt>
                          <dd className="mt-1 text-sm text-gray-900">{new Date(database.lastBackup).toLocaleString()}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Connection String</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowConnectionString(!showConnectionString)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          {showConnectionString ? <EyeOff size={16} className="mr-1" /> : <Eye size={16} className="mr-1" />}
                          {showConnectionString ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(database.connectionString)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Copy size={16} className="mr-1" />
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      {showConnectionString ? (
                        <div className="bg-gray-100 rounded p-3 font-mono text-sm break-all">
                          {database.connectionString}
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded p-3 font-mono text-sm text-gray-500">
                          Connection string is hidden. Click "Show" to reveal.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Properties</h3>
                  </div>
                  <div className="p-4">
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Database name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Engine version</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.version}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Performance tier</dt>
                        <dd className="mt-1 text-sm text-gray-900">{database.tier}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Backup retention</dt>
                        <dd className="mt-1 text-sm text-gray-900">7 days</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">SSL enforcement</dt>
                        <dd className="mt-1 text-sm text-gray-900">Enabled</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Firewall</dt>
                        <dd className="mt-1 text-sm text-gray-900">Configured</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Recommended</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View all</button>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Enable Advanced Threat Protection</h4>
                          <p className="mt-1 text-sm text-gray-600">Protect your database from SQL injection and other threats.</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <HardDrive className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Configure automated backups</h4>
                          <p className="mt-1 text-sm text-gray-600">Set up regular automated backups for data protection.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'networking' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Connection security</h3>
                  <p className="text-sm text-gray-600">Configure firewall rules and SSL settings</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Firewall rules</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rule name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start IP
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            End IP
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            AllowAllWindowsAzureIps
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            0.0.0.0
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            0.0.0.0
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                            <button>Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ClientIPAddress
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            192.168.1.1
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            192.168.1.255
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                            <button>Edit</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">SSL settings</h3>
                  <p className="text-sm text-gray-600">Configure SSL enforcement and minimum TLS version</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">SSL enforcement</h4>
                        <p className="text-sm text-gray-600">Require SSL connections to the database</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 mr-2">Enabled</span>
                        <div className="w-10 h-6 bg-green-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Minimum TLS version</h4>
                        <p className="text-sm text-gray-600">Minimum TLS version required for connections</p>
                      </div>
                      <select className="text-sm border border-gray-300 rounded px-3 py-1">
                        <option>TLS 1.2</option>
                        <option>TLS 1.3</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseDetails;