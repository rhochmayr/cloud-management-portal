import React from 'react';
import { Link } from 'react-router-dom';
import { useVMContext } from '../context/VMContext';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Server, Database, Activity, TrendingUp, Users, Shield, HardDrive, Network } from 'lucide-react';

const Overview: React.FC = () => {
  const { vms } = useVMContext();
  const { databases } = useDatabaseContext();

  const totalResources = vms.length + databases.length;
  const runningVMs = vms.filter(vm => vm.status === 'Running').length;
  const runningDatabases = databases.filter(db => db.status === 'Running').length;

  const recentActivity = [
    { id: 1, type: 'VM', action: 'Created', resource: 'web-server-prod', time: '2 hours ago' },
    { id: 2, type: 'Database', action: 'Started', resource: 'prod-mysql-db', time: '4 hours ago' },
    { id: 3, type: 'VM', action: 'Stopped', resource: 'test-vm-staging', time: '6 hours ago' },
    { id: 4, type: 'Database', action: 'Backup completed', resource: 'cache-redis-db', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
        <p className="text-gray-600">Monitor and manage your cloud infrastructure</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Virtual Machines</p>
              <p className="text-2xl font-semibold text-gray-900">{vms.length}</p>
              <p className="text-sm text-green-600">{runningVMs} running</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Databases</p>
              <p className="text-2xl font-semibold text-gray-900">{databases.length}</p>
              <p className="text-sm text-green-600">{runningDatabases} running</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-semibold text-gray-900">{totalResources}</p>
              <p className="text-sm text-gray-500">Across all services</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
              <p className="text-2xl font-semibold text-gray-900">$2,847</p>
              <p className="text-sm text-green-600">-12% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/create-vm"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 rounded p-2 mr-3">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create VM</p>
                <p className="text-sm text-gray-500">Deploy new virtual machine</p>
              </div>
            </Link>

            <Link
              to="/create-database"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-green-100 rounded p-2 mr-3">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Database</p>
                <p className="text-sm text-gray-500">Deploy new database</p>
              </div>
            </Link>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="bg-purple-100 rounded p-2 mr-3">
                <Network className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Configure Network</p>
                <p className="text-sm text-gray-500">Set up virtual networks</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="bg-orange-100 rounded p-2 mr-3">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Security Center</p>
                <p className="text-sm text-gray-500">Review security settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View all</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className={`rounded-full p-2 mr-3 ${
                    activity.type === 'VM' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'VM' ? (
                      <Server className={`h-4 w-4 ${activity.type === 'VM' ? 'text-blue-600' : 'text-green-600'}`} />
                    ) : (
                      <Database className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action} {activity.resource}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Health */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Resource Health</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">All systems operational</span>
                </div>
                <span className="text-sm text-gray-500">100%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Virtual Machines</span>
                </div>
                <span className="text-sm text-gray-500">{runningVMs}/{vms.length} healthy</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Databases</span>
                </div>
                <span className="text-sm text-gray-500">{runningDatabases}/{databases.length} healthy</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Storage</span>
                </div>
                <span className="text-sm text-gray-500">78% utilized</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Networking</span>
                </div>
                <span className="text-sm text-gray-500">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;