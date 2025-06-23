import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNetworkingContext } from '../context/NetworkingContext';
import { Plus, RefreshCw, Filter, Download, Search, MoreHorizontal, Network, Shield, Globe, Route, Trash2, ExternalLink, Settings, Activity } from 'lucide-react';
import NetworkingStatusBadge from '../components/NetworkingStatusBadge';

const Networking: React.FC = () => {
  const { 
    virtualNetworks, 
    subnets, 
    networkSecurityGroups, 
    loadBalancers, 
    publicIPs, 
    routeTables,
    deleteVirtualNetwork,
    deleteNetworkSecurityGroup,
    deleteLoadBalancer,
    deletePublicIP
  } = useNetworkingContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('vnets');
  
  const filteredVirtualNetworks = virtualNetworks.filter(vnet => 
    vnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vnet.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vnet.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubnets = subnets.filter(subnet => 
    subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subnet.virtualNetwork.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subnet.addressRange.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNSGs = networkSecurityGroups.filter(nsg => 
    nsg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nsg.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nsg.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLoadBalancers = loadBalancers.filter(lb => 
    lb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lb.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lb.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPublicIPs = publicIPs.filter(pip => 
    pip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pip.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pip.ipAddress && pip.ipAddress.includes(searchTerm))
  );

  const getNetworkIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'vnet':
        return <div className={`${iconClass} bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold`}>VN</div>;
      case 'subnet':
        return <div className={`${iconClass} bg-green-500 rounded text-white flex items-center justify-center text-xs font-bold`}>SN</div>;
      case 'nsg':
        return <div className={`${iconClass} bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold`}>SG</div>;
      case 'loadbalancer':
        return <div className={`${iconClass} bg-purple-500 rounded text-white flex items-center justify-center text-xs font-bold`}>LB</div>;
      case 'publicip':
        return <div className={`${iconClass} bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold`}>IP</div>;
      case 'route':
        return <div className={`${iconClass} bg-indigo-500 rounded text-white flex items-center justify-center text-xs font-bold`}>RT</div>;
      default:
        return <Network size={20} className="text-blue-700" />;
    }
  };

  const formatAddressSpace = (addressSpace: string[]) => {
    if (addressSpace.length === 1) return addressSpace[0];
    return `${addressSpace[0]} (+${addressSpace.length - 1} more)`;
  };

  const getUtilizationPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const renderVirtualNetworks = () => (
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
              Address Space
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subnets
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Connected Devices
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredVirtualNetworks.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No virtual networks found. <Link to="/create-networking" className="text-blue-600 hover:underline">Create one</Link>
              </td>
            </tr>
          ) : (
            filteredVirtualNetworks.map((vnet) => (
              <tr key={vnet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/vnet/${vnet.id}`} className="flex items-center">
                    <div className="bg-blue-100 rounded p-1 mr-3">
                      {getNetworkIcon('vnet')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{vnet.name}</div>
                      <div className="text-xs text-gray-500">Virtual Network</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NetworkingStatusBadge status={vnet.status} type="vnet" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatAddressSpace(vnet.addressSpace)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vnet.subnets}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vnet.connectedDevices}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vnet.resourceGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vnet.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => deleteVirtualNetwork(vnet.id)}
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

  const renderSubnets = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Virtual Network
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address Range
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Available IPs
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Connected Devices
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Network Security Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Endpoints
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSubnets.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No subnets found.
              </td>
            </tr>
          ) : (
            filteredSubnets.map((subnet) => (
              <tr key={subnet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded p-1 mr-3">
                      {getNetworkIcon('subnet')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{subnet.name}</div>
                      <div className="text-xs text-gray-500">Subnet</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                  {subnet.virtualNetwork}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subnet.addressRange}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getUtilizationPercentage(subnet.availableIPs, subnet.totalIPs)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{subnet.availableIPs}/{subnet.totalIPs}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subnet.connectedDevices}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subnet.networkSecurityGroup ? (
                    <Link to={`/nsg/${subnet.networkSecurityGroup}`} className="text-blue-600 hover:underline">
                      {subnet.networkSecurityGroup}
                    </Link>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subnet.serviceEndpoints.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {subnet.serviceEndpoints.slice(0, 2).map((endpoint, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {endpoint.replace('Microsoft.', '')}
                        </span>
                      ))}
                      {subnet.serviceEndpoints.length > 2 && (
                        <span className="text-xs text-gray-500">+{subnet.serviceEndpoints.length - 2} more</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderNetworkSecurityGroups = () => (
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
              Associated Subnets
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Associated Interfaces
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Security Rules
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredNSGs.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No network security groups found. <Link to="/create-networking" className="text-blue-600 hover:underline">Create one</Link>
              </td>
            </tr>
          ) : (
            filteredNSGs.map((nsg) => (
              <tr key={nsg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/nsg/${nsg.id}`} className="flex items-center">
                    <div className="bg-red-100 rounded p-1 mr-3">
                      {getNetworkIcon('nsg')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{nsg.name}</div>
                      <div className="text-xs text-gray-500">Network Security Group</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NetworkingStatusBadge status={nsg.status} type="nsg" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {nsg.associatedSubnets}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {nsg.associatedInterfaces}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{nsg.securityRules} custom</div>
                    <div className="text-xs text-gray-400">{nsg.defaultRules} default</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {nsg.resourceGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {nsg.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => deleteNetworkSecurityGroup(nsg.id)}
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

  const renderLoadBalancers = () => (
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
              SKU
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Frontend IPs
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Backend Pools
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLoadBalancers.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No load balancers found. <Link to="/create-networking" className="text-blue-600 hover:underline">Create one</Link>
              </td>
            </tr>
          ) : (
            filteredLoadBalancers.map((lb) => (
              <tr key={lb.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/loadbalancer/${lb.id}`} className="flex items-center">
                    <div className="bg-purple-100 rounded p-1 mr-3">
                      {getNetworkIcon('loadbalancer')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{lb.name}</div>
                      <div className="text-xs text-gray-500">Load Balancer</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NetworkingStatusBadge status={lb.status} type="loadbalancer" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lb.type === 'Public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {lb.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lb.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lb.frontendIPs}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lb.backendPools}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lb.resourceGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => deleteLoadBalancer(lb.id)}
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

  const renderPublicIPs = () => (
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
              IP Address
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignment
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Associated To
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPublicIPs.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No public IP addresses found. <Link to="/create-networking" className="text-blue-600 hover:underline">Create one</Link>
              </td>
            </tr>
          ) : (
            filteredPublicIPs.map((pip) => (
              <tr key={pip.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/publicip/${pip.id}`} className="flex items-center">
                    <div className="bg-orange-100 rounded p-1 mr-3">
                      {getNetworkIcon('publicip')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{pip.name}</div>
                      <div className="text-xs text-gray-500">Public IP Address</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NetworkingStatusBadge status={pip.status} type="publicip" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pip.ipAddress || <span className="text-gray-400">Not assigned</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pip.assignment === 'Static' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pip.assignment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pip.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pip.associatedTo ? (
                    <Link to={`/resource/${pip.associatedTo}`} className="text-blue-600 hover:underline">
                      {pip.associatedTo}
                    </Link>
                  ) : (
                    <span className="text-gray-400">Not associated</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pip.resourceGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => deletePublicIP(pip.id)}
                      className="text-red-600 hover:text-red-800" 
                      title="Delete"
                      disabled={pip.status === 'Associated'}
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

  const renderRouteTables = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Routes
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Associated Subnets
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              BGP Route Propagation
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource Group
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {routeTables.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No route tables found.
              </td>
            </tr>
          ) : (
            routeTables.map((rt) => (
              <tr key={rt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded p-1 mr-3">
                      {getNetworkIcon('route')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:underline">{rt.name}</div>
                      <div className="text-xs text-gray-500">Route Table</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rt.routes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rt.associatedSubnets}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rt.disableBgpRoutePropagation ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {rt.disableBgpRoutePropagation ? 'Disabled' : 'Enabled'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rt.resourceGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rt.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
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
      case 'vnets':
        return renderVirtualNetworks();
      case 'subnets':
        return renderSubnets();
      case 'nsgs':
        return renderNetworkSecurityGroups();
      case 'loadbalancers':
        return renderLoadBalancers();
      case 'publicips':
        return renderPublicIPs();
      case 'routes':
        return renderRouteTables();
      default:
        return renderVirtualNetworks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Networking</h1>
          <p className="text-gray-600">Manage your network infrastructure</p>
        </div>
        <button 
          onClick={() => navigate('/create-networking')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Networking
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('vnets')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'vnets' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Network size={16} className="mr-2" />
              Virtual Networks ({virtualNetworks.length})
            </button>
            <button
              onClick={() => setActiveTab('subnets')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'subnets' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Route size={16} className="mr-2" />
              Subnets ({subnets.length})
            </button>
            <button
              onClick={() => setActiveTab('nsgs')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'nsgs' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield size={16} className="mr-2" />
              Network Security Groups ({networkSecurityGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('loadbalancers')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'loadbalancers' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity size={16} className="mr-2" />
              Load Balancers ({loadBalancers.length})
            </button>
            <button
              onClick={() => setActiveTab('publicips')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'publicips' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe size={16} className="mr-2" />
              Public IP Addresses ({publicIPs.length})
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'routes' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Route size={16} className="mr-2" />
              Route Tables ({routeTables.length})
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              placeholder="Filter networking resources..."
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
          {activeTab === 'vnets' && `Showing ${filteredVirtualNetworks.length} of ${virtualNetworks.length} virtual networks`}
          {activeTab === 'subnets' && `Showing ${filteredSubnets.length} of ${subnets.length} subnets`}
          {activeTab === 'nsgs' && `Showing ${filteredNSGs.length} of ${networkSecurityGroups.length} network security groups`}
          {activeTab === 'loadbalancers' && `Showing ${filteredLoadBalancers.length} of ${loadBalancers.length} load balancers`}
          {activeTab === 'publicips' && `Showing ${filteredPublicIPs.length} of ${publicIPs.length} public IP addresses`}
          {activeTab === 'routes' && `Showing ${routeTables.length} route tables`}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Network Overview</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View topology</button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-3xl font-semibold text-blue-600">
                  {virtualNetworks.length}
                </div>
                <div className="text-sm text-gray-600">Virtual Networks</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-3xl font-semibold text-green-600">
                  {subnets.length}
                </div>
                <div className="text-sm text-gray-600">Subnets</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="text-3xl font-semibold text-red-600">
                  {networkSecurityGroups.length}
                </div>
                <div className="text-sm text-gray-600">Security Groups</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="text-3xl font-semibold text-purple-600">
                  {loadBalancers.length}
                </div>
                <div className="text-sm text-gray-600">Load Balancers</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">IP Address Usage</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="text-2xl font-semibold text-gray-800">
                {subnets.reduce((total, subnet) => total + (subnet.totalIPs - subnet.availableIPs), 0)}
              </div>
              <div className="text-sm text-gray-600">Total IPs in use</div>
            </div>
            <div className="space-y-2">
              {virtualNetworks.slice(0, 3).map(vnet => {
                const vnetSubnets = subnets.filter(subnet => subnet.virtualNetwork === vnet.name);
                const totalIPs = vnetSubnets.reduce((total, subnet) => total + subnet.totalIPs, 0);
                const usedIPs = vnetSubnets.reduce((total, subnet) => total + (subnet.totalIPs - subnet.availableIPs), 0);
                const utilization = totalIPs > 0 ? Math.round((usedIPs / totalIPs) * 100) : 0;
                
                return (
                  <div key={vnet.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{vnet.name}</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{utilization}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Security Status</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View recommendations</button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">DDoS Protection</span>
                </div>
                <span className="text-sm text-gray-500">
                  {virtualNetworks.filter(vnet => vnet.ddosProtection).length}/{virtualNetworks.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">NSG Protected Subnets</span>
                </div>
                <span className="text-sm text-gray-500">
                  {subnets.filter(subnet => subnet.networkSecurityGroup).length}/{subnets.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Service Endpoints</span>
                </div>
                <span className="text-sm text-gray-500">
                  {subnets.filter(subnet => subnet.serviceEndpoints.length > 0).length} configured
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Network Peerings</span>
                </div>
                <span className="text-sm text-gray-500">
                  {virtualNetworks.reduce((total, vnet) => total + vnet.peerings, 0)} active
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Cost Optimization</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View details</button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="text-2xl font-semibold text-gray-800">$234.56</div>
              <div className="text-sm text-gray-600">Estimated monthly cost</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Virtual Networks</span>
                <span className="text-sm font-medium">$45.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Load Balancers</span>
                <span className="text-sm font-medium">$89.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Public IPs</span>
                <span className="text-sm font-medium">$67.20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data Transfer</span>
                <span className="text-sm font-medium">$32.86</span>
              </div>
            </div>
            <div className="mt-4 p-2 bg-green-50 rounded border border-green-200">
              <div className="text-xs text-green-800">
                💡 Consider using Standard SKU load balancers for better cost efficiency
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Networking;