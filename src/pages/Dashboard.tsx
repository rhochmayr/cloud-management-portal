import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVMContext } from '../context/VMContext';
import { Plus, RefreshCw, Filter, Download, Search, MoreHorizontal, Play, Square, RotateCcw, Server } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const Dashboard: React.FC = () => {
  const { vms, updateVMStatus } = useVMContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredVMs = vms.filter(vm => 
    vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vm.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (vmId: string, newStatus: 'Running' | 'Stopped' | 'Failed') => {
    updateVMStatus(vmId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Virtual Machines</h1>
          <p className="text-gray-600">Manage your virtual machine infrastructure</p>
        </div>
        <button 
          onClick={() => navigate('/create-vm')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create VM
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="Filter resources..."
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
                  Subscription
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource Group
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVMs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No virtual machines found. <Link to="/create-vm" className="text-blue-600 hover:underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                filteredVMs.map((vm) => (
                  <tr key={vm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/vm/${vm.id}`} className="flex items-center">
                        <div className="bg-blue-100 rounded p-1 mr-3">
                          <Server size={18} className="text-blue-700" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-600 hover:underline">{vm.name}</div>
                          <div className="text-xs text-gray-500">{vm.os}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={vm.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vm.subscription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vm.resourceGroup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vm.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vm.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vm.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {vm.status !== 'Running' && (
                          <button 
                            onClick={() => handleStatusChange(vm.id, 'Running')}
                            className="text-green-600 hover:text-green-800" 
                            title="Start"
                          >
                            <Play size={18} />
                          </button>
                        )}
                        {vm.status !== 'Stopped' && (
                          <button 
                            onClick={() => handleStatusChange(vm.id, 'Stopped')}
                            className="text-red-600 hover:text-red-800" 
                            title="Stop"
                          >
                            <Square size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusChange(vm.id, 'Running')}
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
          Showing {filteredVMs.length} of {vms.length} virtual machines
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Resource Usage</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View all</button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">CPU</span>
                  <span className="text-sm text-gray-600">24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Memory</span>
                  <span className="text-sm text-gray-600">52%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm text-gray-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">VM Status Summary</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-3xl font-semibold text-green-600">
                  {vms.filter(vm => vm.status === 'Running').length}
                </div>
                <div className="text-sm text-gray-600">Running</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="text-3xl font-semibold text-red-600">
                  {vms.filter(vm => vm.status === 'Stopped').length}
                </div>
                <div className="text-sm text-gray-600">Stopped</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="text-3xl font-semibold text-yellow-600">
                  {vms.filter(vm => vm.status === 'Failed').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-3xl font-semibold text-blue-600">
                  {vms.filter(vm => vm.status === 'Creating').length}
                </div>
                <div className="text-sm text-gray-600">Creating</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Cost Management</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="text-2xl font-semibold text-gray-800">$1,245.32</div>
              <div className="text-sm text-gray-600">Estimated monthly costs</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Compute</span>
                <span className="text-sm font-medium">$845.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-medium">$245.82</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Networking</span>
                <span className="text-sm font-medium">$154.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;