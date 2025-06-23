import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStorageContext } from '../context/StorageContext';
import { Plus, RefreshCw, Filter, Download, Search, MoreHorizontal, HardDrive, Database, Folder, Archive, Trash2, ExternalLink } from 'lucide-react';
import StorageStatusBadge from '../components/StorageStatusBadge';

const Storage: React.FC = () => {
  const { storageAccounts, disks, fileShares, blobContainers, deleteDisk, deleteStorageAccount } = useStorageContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('accounts');
  
  const filteredStorageAccounts = storageAccounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDisks = disks.filter(disk => 
    disk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disk.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disk.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (disk.attachedTo && disk.attachedTo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFileShares = fileShares.filter(share => 
    share.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    share.storageAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlobContainers = blobContainers.filter(container => 
    container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.storageAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStorageTypeIcon = (type: string) => {
    switch (type) {
      case 'Premium SSD':
        return <div className="w-5 h-5 bg-purple-500 rounded text-white flex items-center justify-center text-xs font-bold">P</div>;
      case 'Standard SSD':
        return <div className="w-5 h-5 bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold">S</div>;
      case 'Standard HDD':
        return <div className="w-5 h-5 bg-gray-500 rounded text-white flex items-center justify-center text-xs font-bold">H</div>;
      case 'Ultra SSD':
        return <div className="w-5 h-5 bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold">U</div>;
      default:
        return <HardDrive size={20} className="text-blue-700" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 GB';
    const k = 1024;
    const sizes = ['GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const renderStorageAccounts = () => (
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
              Performance
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Replication
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStorageAccounts.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No storage accounts found. <Link to="/create-storage-account" className="text-blue-600 hover:underline">Create one</Link>
              </td>
            </tr>
          ) : (
            filteredStorageAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/storage-account/${account.id}`} className="flex items-center">
                    <div className="bg-blue-100 rounded p-1 mr-3">
                      <Database size={18} className="text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.accountType}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StorageStatusBadge status={account.status} type="account" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.performance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.replication}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.resourceGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getUsagePercentage(account.usedCapacity, account.totalCapacity)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{getUsagePercentage(account.usedCapacity, account.totalCapacity)}%</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatBytes(account.usedCapacity)} / {formatBytes(account.totalCapacity)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => window.open(account.endpoint, '_blank')}
                      className="text-blue-600 hover:text-blue-800" 
                      title="Open in Azure Storage Explorer"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => deleteStorageAccount(account.id)}
                      className="text-red-600 hover:text-red-800" 
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
  );

  const renderDisks = () => (
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
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attached to
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IOPS
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredDisks.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No disks found. <Link to="/create-disk" className="text-blue-600 hover:underline">Create one</Link>
              </td>
            </tr>
          ) : (
            filteredDisks.map((disk) => (
              <tr key={disk.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/disk/${disk.id}`} className="flex items-center">
                    <div className="bg-blue-100 rounded p-1 mr-3">
                      {getStorageTypeIcon(disk.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{disk.name}</div>
                      <div className="text-xs text-gray-500">{disk.encryption}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StorageStatusBadge status={disk.status} type="disk" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {disk.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {disk.size} GB
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {disk.attachedTo ? (
                    <Link to={`/vm/${disk.attachedTo}`} className="text-blue-600 hover:underline">
                      {disk.attachedTo}
                    </Link>
                  ) : (
                    <span className="text-gray-400">Not attached</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {disk.resourceGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {disk.iops.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => deleteDisk(disk.id)}
                      className="text-red-600 hover:text-red-800" 
                      title="Delete"
                      disabled={disk.status === 'Attached'}
                    >
                      <Trash2 size={18} />
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
  );

  const renderFileShares = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Storage Account
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Protocol
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tier
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Modified
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredFileShares.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No file shares found.
              </td>
            </tr>
          ) : (
            filteredFileShares.map((share) => (
              <tr key={share.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded p-1 mr-3">
                      <Folder size={18} className="text-green-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{share.name}</div>
                      <div className="text-xs text-gray-500">File Share</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                  {share.storageAccount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {share.protocol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {share.tier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getUsagePercentage(share.usedCapacity, share.quota)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{getUsagePercentage(share.usedCapacity, share.quota)}%</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatBytes(share.usedCapacity)} / {formatBytes(share.quota)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(share.lastModified).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="Connect">
                      <ExternalLink size={18} />
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
  );

  const renderBlobContainers = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Storage Account
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Access Level
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Blob Count
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Modified
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredBlobContainers.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No blob containers found.
              </td>
            </tr>
          ) : (
            filteredBlobContainers.map((container) => (
              <tr key={container.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded p-1 mr-3">
                      <Archive size={18} className="text-purple-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{container.name}</div>
                      <div className="text-xs text-gray-500">Blob Container</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                  {container.storageAccount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    container.accessLevel === 'Private' ? 'bg-red-100 text-red-800' :
                    container.accessLevel === 'Blob' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {container.accessLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {container.blobCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatBytes(container.usedCapacity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(container.lastModified).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="Browse">
                      <ExternalLink size={18} />
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
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'accounts':
        return renderStorageAccounts();
      case 'disks':
        return renderDisks();
      case 'fileshares':
        return renderFileShares();
      case 'containers':
        return renderBlobContainers();
      default:
        return renderStorageAccounts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Storage</h1>
          <p className="text-gray-600">Manage your storage infrastructure</p>
        </div>
        <button 
          onClick={() => navigate('/create-storage')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Storage
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'accounts' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database size={16} className="mr-2" />
              Storage Accounts ({storageAccounts.length})
            </button>
            <button
              onClick={() => setActiveTab('disks')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'disks' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <HardDrive size={16} className="mr-2" />
              Disks ({disks.length})
            </button>
            <button
              onClick={() => setActiveTab('fileshares')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'fileshares' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Folder size={16} className="mr-2" />
              File Shares ({fileShares.length})
            </button>
            <button
              onClick={() => setActiveTab('containers')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'containers' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Archive size={16} className="mr-2" />
              Blob Containers ({blobContainers.length})
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="Filter storage resources..."
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
        
        {renderTabContent()}
        
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          {activeTab === 'accounts' && `Showing ${filteredStorageAccounts.length} of ${storageAccounts.length} storage accounts`}
          {activeTab === 'disks' && `Showing ${filteredDisks.length} of ${disks.length} disks`}
          {activeTab === 'fileshares' && `Showing ${filteredFileShares.length} of ${fileShares.length} file shares`}
          {activeTab === 'containers' && `Showing ${filteredBlobContainers.length} of ${blobContainers.length} blob containers`}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Storage Summary</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View all</button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-3xl font-semibold text-blue-600">
                  {storageAccounts.length}
                </div>
                <div className="text-sm text-gray-600">Storage Accounts</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="text-3xl font-semibold text-purple-600">
                  {disks.length}
                </div>
                <div className="text-sm text-gray-600">Disks</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-3xl font-semibold text-green-600">
                  {fileShares.length}
                </div>
                <div className="text-sm text-gray-600">File Shares</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <div className="text-3xl font-semibold text-orange-600">
                  {blobContainers.length}
                </div>
                <div className="text-sm text-gray-600">Containers</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Disk Types</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {['Premium SSD', 'Standard SSD', 'Standard HDD', 'Ultra SSD'].map(type => {
                const count = disks.filter(disk => disk.type === type).length;
                return (
                  <div key={type} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {getStorageTypeIcon(type)}
                      </div>
                      <span className="text-sm text-gray-700">{type}</span>
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
                {formatBytes(storageAccounts.reduce((total, account) => total + account.usedCapacity, 0))}
              </div>
              <div className="text-sm text-gray-600">Total used storage</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Production</span>
                <span className="text-sm font-medium">
                  {formatBytes(storageAccounts.filter(acc => acc.resourceGroup.includes('production')).reduce((total, acc) => total + acc.usedCapacity, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Development</span>
                <span className="text-sm font-medium">
                  {formatBytes(storageAccounts.filter(acc => acc.resourceGroup.includes('development')).reduce((total, acc) => total + acc.usedCapacity, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Premium</span>
                <span className="text-sm font-medium">
                  {formatBytes(storageAccounts.filter(acc => acc.performance === 'Premium').reduce((total, acc) => total + acc.usedCapacity, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Cost Optimization</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View recommendations</button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="text-2xl font-semibold text-gray-800">$456.78</div>
              <div className="text-sm text-gray-600">Estimated monthly cost</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Storage Accounts</span>
                <span className="text-sm font-medium">$234.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Managed Disks</span>
                <span className="text-sm font-medium">$189.28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data Transfer</span>
                <span className="text-sm font-medium">$33.00</span>
              </div>
            </div>
            <div className="mt-4 p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="text-xs text-yellow-800">
                💡 Consider moving infrequently accessed data to Cool tier to save costs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storage;