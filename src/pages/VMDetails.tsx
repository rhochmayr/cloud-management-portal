import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVMContext } from '../context/VMContext';
import { Server, Play, Square, RotateCcw, Download, Shield, Clipboard, ChevronDown, Settings, HardDrive, Network, Activity } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

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

const VMDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vms, updateVMStatus } = useVMContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  const vm = vms.find(vm => vm.id === id);
  
  if (!vm) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">Virtual Machine Not Found</h2>
        <p className="mt-2 text-gray-600">The virtual machine you're looking for doesn't exist or has been deleted.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to VM List
        </Link>
      </div>
    );
  }
  
  const handleStatusChange = (newStatus: 'Running' | 'Stopped' | 'Failed') => {
    updateVMStatus(vm.id, newStatus);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded p-2 mr-3">
            <Server size={24} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{vm.name}</h1>
            <div className="flex items-center mt-1">
              <StatusBadge status={vm.status} />
              <span className="ml-2 text-sm text-gray-600">Virtual machine</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {vm.status !== 'Running' && (
            <button 
              onClick={() => handleStatusChange('Running')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Play size={16} className="mr-2" />
              Start
            </button>
          )}
          {vm.status === 'Running' && (
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
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Connect
          </button>
          <button className="text-gray-500 hover:text-gray-700 px-2 focus:outline-none">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <Tab
              active={activeTab === 'overview'}
              icon={<Server size={16} />}
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
              active={activeTab === 'disks'}
              icon={<HardDrive size={16} />}
              label="Disks"
              onClick={() => setActiveTab('disks')}
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
                        <dd className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer">{vm.resourceGroup}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1"><StatusBadge status={vm.status} /></dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900">{vm.location}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Subscription</dt>
                        <dd className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer">{vm.subscription}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Subscription ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">e7829b94-0644-4ab0-baef-b50f1d3...</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Operating system</dt>
                        <dd className="mt-1 text-sm text-gray-900">{vm.os}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Size</dt>
                        <dd className="mt-1 text-sm text-gray-900">{vm.size} (2 vCPUs, 4 GiB memory)</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Public IP address</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          {vm.ipAddress}
                          <button className="ml-2 text-gray-400 hover:text-gray-600">
                            <Clipboard size={14} />
                          </button>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Virtual network/subnet</dt>
                        <dd className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer">vnet-{vm.name}/default</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">DNS name</dt>
                        <dd className="mt-1 text-sm text-gray-900">Not configured</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Time created</dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(vm.created).toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tags</dt>
                        <dd className="mt-1 text-sm text-blue-600 hover:underline cursor-pointer">Add tags</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Monitoring</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View all metrics</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-700">CPU Usage (%)</h4>
                        <div className="text-sm text-gray-500">Last 24 hours</div>
                      </div>
                      <div className="h-40 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <div className="mt-2">CPU usage chart</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Network Usage</h4>
                        <div className="text-sm text-gray-500">Last 24 hours</div>
                      </div>
                      <div className="h-40 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <div className="mt-2">Network usage chart</div>
                        </div>
                      </div>
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
                        <dt className="text-sm font-medium text-gray-500">Computer name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{vm.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Operating system</dt>
                        <dd className="mt-1 text-sm text-gray-900">{vm.os}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">VM generation</dt>
                        <dd className="mt-1 text-sm text-gray-900">V2</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">VM architecture</dt>
                        <dd className="mt-1 text-sm text-gray-900">x64</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Agent status</dt>
                        <dd className="mt-1 text-sm text-gray-900">Ready</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Agent version</dt>
                        <dd className="mt-1 text-sm text-gray-900">2.13.1.1</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Hibernation</dt>
                        <dd className="mt-1 text-sm text-gray-900">Disabled</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Disk controller type</dt>
                        <dd className="mt-1 text-sm text-gray-900">SCSI</dd>
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
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Enable disk encryption</h4>
                          <p className="mt-1 text-sm text-gray-600">Encrypt your virtual machine disks for enhanced security.</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">Configure backup</h4>
                          <p className="mt-1 text-sm text-gray-600">Protect your VM with regular automated backups.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'disks' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">OS disk</h3>
                  <p className="text-sm text-gray-600">The operating system disk for this VM</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Host caching
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded p-1 mr-3">
                              <HardDrive size={18} className="text-blue-700" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-blue-600 hover:underline">{vm.name}_OsDisk</div>
                              <div className="text-xs text-gray-500">OS Disk</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          128 GiB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Premium SSD LRS
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Read/write
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Data disks</h3>
                    <p className="text-sm text-gray-600">Additional data storage for this VM</p>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="mr-2">+</span>
                    Add data disk
                  </button>
                </div>
                
                {vm.disks > 1 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            LUN
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Host caching
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            0
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 rounded p-1 mr-3">
                                <HardDrive size={18} className="text-blue-700" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-blue-600 hover:underline">{vm.name}_DataDisk_0</div>
                                <div className="text-xs text-gray-500">Data Disk</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            256 GiB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Premium SSD LRS
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            None
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-800 focus:outline-none">
                              Detach
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <HardDrive size={48} />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No data disks</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no data disks attached to this virtual machine.
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span className="mr-2">+</span>
                        Add data disk
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'networking' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Network interfaces</h3>
                  <p className="text-sm text-gray-600">Virtual network adapter(s) connected to this VM</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Private IP
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Public IP
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subnet
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Network security group
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded p-1 mr-3">
                              <Network size={18} className="text-blue-700" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-blue-600 hover:underline">{vm.name}-nic</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          10.0.0.4
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vm.ipAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                          default
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                          {vm.name}-nsg
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Inbound port rules</h3>
                  <p className="text-sm text-gray-600">Rules that allow inbound traffic to this VM</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Port
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Protocol
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          1000
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Allow-SSH
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          22
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          TCP
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Any
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          Allow
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          1001
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Allow-HTTP
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          80
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          TCP
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Any
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          Allow
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VMDetails;