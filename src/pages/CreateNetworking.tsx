import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetworkingContext } from '../context/NetworkingContext';
import { ChevronLeft, ChevronRight, Info, Network, Shield, Globe, Activity, AlertCircle, Plus, Minus } from 'lucide-react';

interface FormData {
  resourceType: 'vnet' | 'nsg' | 'loadbalancer' | 'publicip';
  // Virtual Network fields
  vnetName: string;
  vnetResourceGroup: string;
  vnetLocation: string;
  addressSpaces: string[];
  dnsServers: string[];
  enableDdosProtection: boolean;
  // Subnet fields
  subnets: Array<{
    name: string;
    addressRange: string;
    enablePrivateEndpoint: boolean;
    serviceEndpoints: string[];
  }>;
  // NSG fields
  nsgName: string;
  nsgResourceGroup: string;
  nsgLocation: string;
  securityRules: Array<{
    name: string;
    priority: number;
    direction: 'Inbound' | 'Outbound';
    access: 'Allow' | 'Deny';
    protocol: 'TCP' | 'UDP' | 'Any' | 'ICMP';
    sourcePortRange: string;
    destinationPortRange: string;
    sourceAddressPrefix: string;
    destinationAddressPrefix: string;
    description: string;
  }>;
  // Load Balancer fields
  lbName: string;
  lbResourceGroup: string;
  lbLocation: string;
  lbType: 'Public' | 'Internal';
  lbSku: 'Basic' | 'Standard' | 'Gateway';
  // Public IP fields
  pipName: string;
  pipResourceGroup: string;
  pipLocation: string;
  pipVersion: 'IPv4' | 'IPv6';
  pipAssignment: 'Static' | 'Dynamic';
  pipSku: 'Basic' | 'Standard';
  pipTier: 'Regional' | 'Global';
  pipDnsName: string;
}

const CreateNetworking: React.FC = () => {
  const navigate = useNavigate();
  const { addVirtualNetwork, addNetworkSecurityGroup, addLoadBalancer, addPublicIP } = useNetworkingContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    resourceType: 'vnet',
    // Virtual Network defaults
    vnetName: '',
    vnetResourceGroup: 'production-group',
    vnetLocation: 'West Europe',
    addressSpaces: ['10.0.0.0/16'],
    dnsServers: ['168.63.129.16'],
    enableDdosProtection: false,
    // Subnet defaults
    subnets: [
      {
        name: 'default',
        addressRange: '10.0.0.0/24',
        enablePrivateEndpoint: false,
        serviceEndpoints: []
      }
    ],
    // NSG defaults
    nsgName: '',
    nsgResourceGroup: 'production-group',
    nsgLocation: 'West Europe',
    securityRules: [],
    // Load Balancer defaults
    lbName: '',
    lbResourceGroup: 'production-group',
    lbLocation: 'West Europe',
    lbType: 'Public',
    lbSku: 'Standard',
    // Public IP defaults
    pipName: '',
    pipResourceGroup: 'production-group',
    pipLocation: 'West Europe',
    pipVersion: 'IPv4',
    pipAssignment: 'Static',
    pipSku: 'Standard',
    pipTier: 'Regional',
    pipDnsName: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resourceGroups = [
    'production-group',
    'development-group',
    'staging-group',
    'testing-group',
    'shared-services'
  ];

  const regions = [
    'West Europe',
    'North Europe',
    'East US',
    'West US',
    'Southeast Asia',
    'Central US',
    'South Central US',
    'East Asia',
    'Japan East',
    'UK South'
  ];

  const serviceEndpoints = [
    'Microsoft.Storage',
    'Microsoft.Sql',
    'Microsoft.KeyVault',
    'Microsoft.ServiceBus',
    'Microsoft.EventHub',
    'Microsoft.CosmosDB',
    'Microsoft.Web',
    'Microsoft.ContainerRegistry'
  ];

  const getSteps = () => {
    switch (formData.resourceType) {
      case 'vnet':
        return [
          { number: 1, title: 'Basics' },
          { number: 2, title: 'IP Addresses' },
          { number: 3, title: 'Security' },
          { number: 4, title: 'Review + create' }
        ];
      case 'nsg':
        return [
          { number: 1, title: 'Basics' },
          { number: 2, title: 'Security Rules' },
          { number: 3, title: 'Review + create' }
        ];
      case 'loadbalancer':
        return [
          { number: 1, title: 'Basics' },
          { number: 2, title: 'Frontend IP' },
          { number: 3, title: 'Review + create' }
        ];
      case 'publicip':
        return [
          { number: 1, title: 'Basics' },
          { number: 2, title: 'Review + create' }
        ];
      default:
        return [{ number: 1, title: 'Basics' }];
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      switch (formData.resourceType) {
        case 'vnet':
          if (!formData.vnetName) newErrors.vnetName = 'Virtual network name is required';
          if (!formData.vnetResourceGroup) newErrors.vnetResourceGroup = 'Resource group is required';
          if (!formData.vnetLocation) newErrors.vnetLocation = 'Location is required';
          break;
        case 'nsg':
          if (!formData.nsgName) newErrors.nsgName = 'Network security group name is required';
          if (!formData.nsgResourceGroup) newErrors.nsgResourceGroup = 'Resource group is required';
          if (!formData.nsgLocation) newErrors.nsgLocation = 'Location is required';
          break;
        case 'loadbalancer':
          if (!formData.lbName) newErrors.lbName = 'Load balancer name is required';
          if (!formData.lbResourceGroup) newErrors.lbResourceGroup = 'Resource group is required';
          if (!formData.lbLocation) newErrors.lbLocation = 'Location is required';
          break;
        case 'publicip':
          if (!formData.pipName) newErrors.pipName = 'Public IP name is required';
          if (!formData.pipResourceGroup) newErrors.pipResourceGroup = 'Resource group is required';
          if (!formData.pipLocation) newErrors.pipLocation = 'Location is required';
          break;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    const val = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number'
      ? parseInt(value) || 0
      : value;
    
    setFormData({
      ...formData,
      [name]: val
    });
    
    // Clear error when user fixes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleResourceTypeChange = (resourceType: 'vnet' | 'nsg' | 'loadbalancer' | 'publicip') => {
    setFormData({
      ...formData,
      resourceType
    });
    setCurrentStep(1);
    setErrors({});
  };

  const addAddressSpace = () => {
    setFormData({
      ...formData,
      addressSpaces: [...formData.addressSpaces, '']
    });
  };

  const removeAddressSpace = (index: number) => {
    setFormData({
      ...formData,
      addressSpaces: formData.addressSpaces.filter((_, i) => i !== index)
    });
  };

  const updateAddressSpace = (index: number, value: string) => {
    const newAddressSpaces = [...formData.addressSpaces];
    newAddressSpaces[index] = value;
    setFormData({
      ...formData,
      addressSpaces: newAddressSpaces
    });
  };

  const addSubnet = () => {
    setFormData({
      ...formData,
      subnets: [...formData.subnets, {
        name: '',
        addressRange: '',
        enablePrivateEndpoint: false,
        serviceEndpoints: []
      }]
    });
  };

  const removeSubnet = (index: number) => {
    setFormData({
      ...formData,
      subnets: formData.subnets.filter((_, i) => i !== index)
    });
  };

  const updateSubnet = (index: number, field: string, value: any) => {
    const newSubnets = [...formData.subnets];
    newSubnets[index] = { ...newSubnets[index], [field]: value };
    setFormData({
      ...formData,
      subnets: newSubnets
    });
  };

  const addSecurityRule = () => {
    setFormData({
      ...formData,
      securityRules: [...formData.securityRules, {
        name: '',
        priority: 100,
        direction: 'Inbound',
        access: 'Allow',
        protocol: 'TCP',
        sourcePortRange: '*',
        destinationPortRange: '',
        sourceAddressPrefix: '*',
        destinationAddressPrefix: '*',
        description: ''
      }]
    });
  };

  const removeSecurityRule = (index: number) => {
    setFormData({
      ...formData,
      securityRules: formData.securityRules.filter((_, i) => i !== index)
    });
  };

  const updateSecurityRule = (index: number, field: string, value: any) => {
    const newRules = [...formData.securityRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setFormData({
      ...formData,
      securityRules: newRules
    });
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      switch (formData.resourceType) {
        case 'vnet':
          addVirtualNetwork({
            name: formData.vnetName,
            resourceGroup: formData.vnetResourceGroup,
            location: formData.vnetLocation,
            subscription: 'Enterprise Dev/Test',
            addressSpace: formData.addressSpaces.filter(space => space.trim() !== ''),
            dnsServers: formData.dnsServers,
            subnets: formData.subnets.length,
            connectedDevices: 0,
            peerings: 0,
            ddosProtection: formData.enableDdosProtection,
          });
          break;
        case 'nsg':
          addNetworkSecurityGroup({
            name: formData.nsgName,
            resourceGroup: formData.nsgResourceGroup,
            location: formData.nsgLocation,
            subscription: 'Enterprise Dev/Test',
            associatedSubnets: 0,
            associatedInterfaces: 0,
            securityRules: formData.securityRules.length,
            defaultRules: 6,
          });
          break;
        case 'loadbalancer':
          addLoadBalancer({
            name: formData.lbName,
            resourceGroup: formData.lbResourceGroup,
            location: formData.lbLocation,
            subscription: 'Enterprise Dev/Test',
            type: formData.lbType,
            sku: formData.lbSku,
            frontendIPs: 1,
            backendPools: 1,
            loadBalancingRules: 0,
            healthProbes: 0,
          });
          break;
        case 'publicip':
          addPublicIP({
            name: formData.pipName,
            resourceGroup: formData.pipResourceGroup,
            location: formData.pipLocation,
            subscription: 'Enterprise Dev/Test',
            version: formData.pipVersion,
            assignment: formData.pipAssignment,
            sku: formData.pipSku,
            tier: formData.pipTier,
            dnsName: formData.pipDnsName || undefined,
          });
          break;
      }
      
      navigate('/networking');
    }
  };

  const calculateEstimatedCost = () => {
    const baseCosts = {
      vnet: 0, // VNets are free
      nsg: 0, // NSGs are free
      loadbalancer: formData.lbSku === 'Basic' ? 18.25 : 22.56,
      publicip: formData.pipSku === 'Basic' ? 3.65 : 4.38
    };
    
    const ddosCost = formData.enableDdosProtection ? 2944.00 : 0; // DDoS Protection Standard
    const dataCost = 10.00; // Estimated data transfer
    
    return {
      base: baseCosts[formData.resourceType],
      ddos: ddosCost,
      data: dataCost,
      total: baseCosts[formData.resourceType] + ddosCost + dataCost
    };
  };

  const costs = calculateEstimatedCost();

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'vnet':
        return <Network size={32} className="text-blue-600" />;
      case 'nsg':
        return <Shield size={32} className="text-red-600" />;
      case 'loadbalancer':
        return <Activity size={32} className="text-purple-600" />;
      case 'publicip':
        return <Globe size={32} className="text-orange-600" />;
      default:
        return <Network size={32} className="text-blue-600" />;
    }
  };

  const renderResourceTypeSelection = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4 flex">
        <div className="mr-3 text-blue-500">
          <Info size={20} />
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Choose networking resource type</p>
          <p className="mt-1">
            Select the type of networking resource you want to create. Each resource type has different configuration options.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleResourceTypeChange('vnet')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            formData.resourceType === 'vnet'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-3">
            <Network size={24} className="text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Virtual Network</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create an isolated network environment in Azure with custom IP address ranges and subnets.
          </p>
        </button>

        <button
          onClick={() => handleResourceTypeChange('nsg')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            formData.resourceType === 'nsg'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-3">
            <Shield size={24} className="text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Network Security Group</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create firewall rules to control network traffic to and from Azure resources.
          </p>
        </button>

        <button
          onClick={() => handleResourceTypeChange('loadbalancer')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            formData.resourceType === 'loadbalancer'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-3">
            <Activity size={24} className="text-purple-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Load Balancer</h3>
          </div>
          <p className="text-sm text-gray-600">
            Distribute incoming network traffic across multiple backend resources for high availability.
          </p>
        </button>

        <button
          onClick={() => handleResourceTypeChange('publicip')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            formData.resourceType === 'publicip'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-3">
            <Globe size={24} className="text-orange-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Public IP Address</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create a public IP address for internet connectivity to your Azure resources.
          </p>
        </button>
      </div>
    </div>
  );

  const renderVNetBasics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="vnetName" className="block text-sm font-medium text-gray-700">
            Virtual network name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="vnetName"
            name="vnetName"
            value={formData.vnetName}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.vnetName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="my-virtual-network"
          />
          {errors.vnetName && <p className="mt-1 text-sm text-red-500">{errors.vnetName}</p>}
        </div>
        
        <div>
          <label htmlFor="vnetResourceGroup" className="block text-sm font-medium text-gray-700">
            Resource group <span className="text-red-500">*</span>
          </label>
          <select
            id="vnetResourceGroup"
            name="vnetResourceGroup"
            value={formData.vnetResourceGroup}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.vnetResourceGroup ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {resourceGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.vnetResourceGroup && <p className="mt-1 text-sm text-red-500">{errors.vnetResourceGroup}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="vnetLocation" className="block text-sm font-medium text-gray-700">
          Location <span className="text-red-500">*</span>
        </label>
        <select
          id="vnetLocation"
          name="vnetLocation"
          value={formData.vnetLocation}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.vnetLocation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        {errors.vnetLocation && <p className="mt-1 text-sm text-red-500">{errors.vnetLocation}</p>}
      </div>
    </div>
  );

  const renderVNetIPAddresses = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Address spaces</h3>
          <button
            type="button"
            onClick={addAddressSpace}
            className="inline-flex items-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            <Plus size={16} className="mr-1" />
            Add address space
          </button>
        </div>
        
        {formData.addressSpaces.map((space, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={space}
              onChange={(e) => updateAddressSpace(index, e.target.value)}
              placeholder="10.0.0.0/16"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.addressSpaces.length > 1 && (
              <button
                type="button"
                onClick={() => removeAddressSpace(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Minus size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Subnets</h3>
          <button
            type="button"
            onClick={addSubnet}
            className="inline-flex items-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            <Plus size={16} className="mr-1" />
            Add subnet
          </button>
        </div>
        
        {formData.subnets.map((subnet, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">Subnet {index + 1}</h4>
              {formData.subnets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubnet(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus size={16} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subnet name
                </label>
                <input
                  type="text"
                  value={subnet.name}
                  onChange={(e) => updateSubnet(index, 'name', e.target.value)}
                  placeholder="default"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address range
                </label>
                <input
                  type="text"
                  value={subnet.addressRange}
                  onChange={(e) => updateSubnet(index, 'addressRange', e.target.value)}
                  placeholder="10.0.0.0/24"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  id={`privateEndpoint-${index}`}
                  type="checkbox"
                  checked={subnet.enablePrivateEndpoint}
                  onChange={(e) => updateSubnet(index, 'enablePrivateEndpoint', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`privateEndpoint-${index}`} className="ml-2 block text-sm text-gray-700">
                  Enable private endpoint network policies
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVNetSecurity = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center">
          <input
            id="enableDdosProtection"
            name="enableDdosProtection"
            type="checkbox"
            checked={formData.enableDdosProtection}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableDdosProtection" className="ml-2 block text-sm text-gray-700">
            Enable DDoS Protection Standard
          </label>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Provides enhanced DDoS mitigation capabilities for resources in this virtual network. Additional charges apply.
        </p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex">
        <div className="mr-3 text-yellow-500">
          <AlertCircle size={20} />
        </div>
        <div className="text-sm text-yellow-800">
          <p className="font-medium">Security recommendations</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Create network security groups to control traffic flow</li>
            <li>Use service endpoints for secure access to Azure services</li>
            <li>Consider enabling DDoS Protection for production workloads</li>
            <li>Implement network segmentation using subnets</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderNSGBasics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nsgName" className="block text-sm font-medium text-gray-700">
            Network security group name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nsgName"
            name="nsgName"
            value={formData.nsgName}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.nsgName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="my-network-security-group"
          />
          {errors.nsgName && <p className="mt-1 text-sm text-red-500">{errors.nsgName}</p>}
        </div>
        
        <div>
          <label htmlFor="nsgResourceGroup" className="block text-sm font-medium text-gray-700">
            Resource group <span className="text-red-500">*</span>
          </label>
          <select
            id="nsgResourceGroup"
            name="nsgResourceGroup"
            value={formData.nsgResourceGroup}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.nsgResourceGroup ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {resourceGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.nsgResourceGroup && <p className="mt-1 text-sm text-red-500">{errors.nsgResourceGroup}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="nsgLocation" className="block text-sm font-medium text-gray-700">
          Location <span className="text-red-500">*</span>
        </label>
        <select
          id="nsgLocation"
          name="nsgLocation"
          value={formData.nsgLocation}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.nsgLocation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        {errors.nsgLocation && <p className="mt-1 text-sm text-red-500">{errors.nsgLocation}</p>}
      </div>
    </div>
  );

  const renderNSGSecurityRules = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Security rules</h3>
        <button
          type="button"
          onClick={addSecurityRule}
          className="inline-flex items-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
        >
          <Plus size={16} className="mr-1" />
          Add security rule
        </button>
      </div>
      
      {formData.securityRules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Shield size={48} className="mx-auto mb-4 text-gray-400" />
          <p>No custom security rules defined. Default rules will be applied.</p>
        </div>
      ) : (
        formData.securityRules.map((rule, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">Security Rule {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeSecurityRule(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Minus size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rule name</label>
                <input
                  type="text"
                  value={rule.name}
                  onChange={(e) => updateSecurityRule(index, 'name', e.target.value)}
                  placeholder="Allow-HTTP"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <input
                  type="number"
                  value={rule.priority}
                  onChange={(e) => updateSecurityRule(index, 'priority', parseInt(e.target.value))}
                  min="100"
                  max="4096"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Direction</label>
                <select
                  value={rule.direction}
                  onChange={(e) => updateSecurityRule(index, 'direction', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Inbound">Inbound</option>
                  <option value="Outbound">Outbound</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Action</label>
                <select
                  value={rule.access}
                  onChange={(e) => updateSecurityRule(index, 'access', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Allow">Allow</option>
                  <option value="Deny">Deny</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Protocol</label>
                <select
                  value={rule.protocol}
                  onChange={(e) => updateSecurityRule(index, 'protocol', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination port</label>
                <input
                  type="text"
                  value={rule.destinationPortRange}
                  onChange={(e) => updateSecurityRule(index, 'destinationPortRange', e.target.value)}
                  placeholder="80, 443, 8080-8090"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={rule.description}
                onChange={(e) => updateSecurityRule(index, 'description', e.target.value)}
                placeholder="Allow HTTP traffic"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderLoadBalancerBasics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="lbName" className="block text-sm font-medium text-gray-700">
            Load balancer name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lbName"
            name="lbName"
            value={formData.lbName}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.lbName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="my-load-balancer"
          />
          {errors.lbName && <p className="mt-1 text-sm text-red-500">{errors.lbName}</p>}
        </div>
        
        <div>
          <label htmlFor="lbResourceGroup" className="block text-sm font-medium text-gray-700">
            Resource group <span className="text-red-500">*</span>
          </label>
          <select
            id="lbResourceGroup"
            name="lbResourceGroup"
            value={formData.lbResourceGroup}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.lbResourceGroup ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {resourceGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.lbResourceGroup && <p className="mt-1 text-sm text-red-500">{errors.lbResourceGroup}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="lbLocation" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            id="lbLocation"
            name="lbLocation"
            value={formData.lbLocation}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.lbLocation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.lbLocation && <p className="mt-1 text-sm text-red-500">{errors.lbLocation}</p>}
        </div>
        
        <div>
          <label htmlFor="lbType" className="block text-sm font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="lbType"
            name="lbType"
            value={formData.lbType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Public">Public</option>
            <option value="Internal">Internal</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="lbSku" className="block text-sm font-medium text-gray-700">
          SKU <span className="text-red-500">*</span>
        </label>
        <select
          id="lbSku"
          name="lbSku"
          value={formData.lbSku}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Basic">Basic</option>
          <option value="Standard">Standard</option>
          <option value="Gateway">Gateway</option>
        </select>
      </div>
    </div>
  );

  const renderPublicIPBasics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pipName" className="block text-sm font-medium text-gray-700">
            Public IP name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pipName"
            name="pipName"
            value={formData.pipName}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.pipName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="my-public-ip"
          />
          {errors.pipName && <p className="mt-1 text-sm text-red-500">{errors.pipName}</p>}
        </div>
        
        <div>
          <label htmlFor="pipResourceGroup" className="block text-sm font-medium text-gray-700">
            Resource group <span className="text-red-500">*</span>
          </label>
          <select
            id="pipResourceGroup"
            name="pipResourceGroup"
            value={formData.pipResourceGroup}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.pipResourceGroup ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {resourceGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.pipResourceGroup && <p className="mt-1 text-sm text-red-500">{errors.pipResourceGroup}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pipLocation" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            id="pipLocation"
            name="pipLocation"
            value={formData.pipLocation}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.pipLocation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.pipLocation && <p className="mt-1 text-sm text-red-500">{errors.pipLocation}</p>}
        </div>
        
        <div>
          <label htmlFor="pipVersion" className="block text-sm font-medium text-gray-700">
            IP Version <span className="text-red-500">*</span>
          </label>
          <select
            id="pipVersion"
            name="pipVersion"
            value={formData.pipVersion}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="IPv4">IPv4</option>
            <option value="IPv6">IPv6</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pipSku" className="block text-sm font-medium text-gray-700">
            SKU <span className="text-red-500">*</span>
          </label>
          <select
            id="pipSku"
            name="pipSku"
            value={formData.pipSku}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="pipAssignment" className="block text-sm font-medium text-gray-700">
            Assignment <span className="text-red-500">*</span>
          </label>
          <select
            id="pipAssignment"
            name="pipAssignment"
            value={formData.pipAssignment}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Static">Static</option>
            <option value="Dynamic">Dynamic</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="pipDnsName" className="block text-sm font-medium text-gray-700">
          DNS name label (optional)
        </label>
        <input
          type="text"
          id="pipDnsName"
          name="pipDnsName"
          value={formData.pipDnsName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="my-app"
        />
        <p className="mt-1 text-sm text-gray-500">
          Creates a DNS name: {formData.pipDnsName || 'my-app'}.{formData.pipLocation.toLowerCase().replace(' ', '')}.cloudapp.azure.com
        </p>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Configuration Summary</h3>
        </div>
        <div className="p-4 divide-y divide-gray-200">
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">BASICS</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Resource Type</div>
                <div className="text-sm flex items-center">
                  <div className="mr-2">
                    {getResourceIcon(formData.resourceType)}
                  </div>
                  {formData.resourceType === 'vnet' && 'Virtual Network'}
                  {formData.resourceType === 'nsg' && 'Network Security Group'}
                  {formData.resourceType === 'loadbalancer' && 'Load Balancer'}
                  {formData.resourceType === 'publicip' && 'Public IP Address'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Name</div>
                <div className="text-sm">
                  {formData.resourceType === 'vnet' && formData.vnetName}
                  {formData.resourceType === 'nsg' && formData.nsgName}
                  {formData.resourceType === 'loadbalancer' && formData.lbName}
                  {formData.resourceType === 'publicip' && formData.pipName}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Resource Group</div>
                <div className="text-sm">
                  {formData.resourceType === 'vnet' && formData.vnetResourceGroup}
                  {formData.resourceType === 'nsg' && formData.nsgResourceGroup}
                  {formData.resourceType === 'loadbalancer' && formData.lbResourceGroup}
                  {formData.resourceType === 'publicip' && formData.pipResourceGroup}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm">
                  {formData.resourceType === 'vnet' && formData.vnetLocation}
                  {formData.resourceType === 'nsg' && formData.nsgLocation}
                  {formData.resourceType === 'loadbalancer' && formData.lbLocation}
                  {formData.resourceType === 'publicip' && formData.pipLocation}
                </div>
              </div>
            </div>
          </div>
          
          {formData.resourceType === 'vnet' && (
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-500">VIRTUAL NETWORK</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">Address Spaces</div>
                  <div className="text-sm">{formData.addressSpaces.filter(space => space.trim() !== '').join(', ')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Subnets</div>
                  <div className="text-sm">{formData.subnets.length} configured</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">DDoS Protection</div>
                  <div className="text-sm">{formData.enableDdosProtection ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>
            </div>
          )}
          
          {formData.resourceType === 'nsg' && (
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-500">NETWORK SECURITY GROUP</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">Security Rules</div>
                  <div className="text-sm">{formData.securityRules.length} custom rules</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Default Rules</div>
                  <div className="text-sm">6 default rules will be applied</div>
                </div>
              </div>
            </div>
          )}
          
          {formData.resourceType === 'loadbalancer' && (
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-500">LOAD BALANCER</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="text-sm">{formData.lbType}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">SKU</div>
                  <div className="text-sm">{formData.lbSku}</div>
                </div>
              </div>
            </div>
          )}
          
          {formData.resourceType === 'publicip' && (
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-500">PUBLIC IP ADDRESS</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">IP Version</div>
                  <div className="text-sm">{formData.pipVersion}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Assignment</div>
                  <div className="text-sm">{formData.pipAssignment}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">SKU</div>
                  <div className="text-sm">{formData.pipSku}</div>
                </div>
                {formData.pipDnsName && (
                  <div>
                    <div className="text-xs text-gray-500">DNS Name</div>
                    <div className="text-sm">{formData.pipDnsName}.{formData.pipLocation.toLowerCase().replace(' ', '')}.cloudapp.azure.com</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex">
        <div className="mr-3 text-blue-500">
          <Info size={20} />
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Validation passed</p>
          <p className="mt-1">
            All configuration settings have been validated and are ready for deployment.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (currentStep === 1 && formData.resourceType === 'vnet') {
      return renderResourceTypeSelection();
    }
    
    switch (formData.resourceType) {
      case 'vnet':
        switch (currentStep) {
          case 1: return renderVNetBasics();
          case 2: return renderVNetIPAddresses();
          case 3: return renderVNetSecurity();
          case 4: return renderReview();
          default: return renderVNetBasics();
        }
      case 'nsg':
        switch (currentStep) {
          case 1: return renderNSGBasics();
          case 2: return renderNSGSecurityRules();
          case 3: return renderReview();
          default: return renderNSGBasics();
        }
      case 'loadbalancer':
        switch (currentStep) {
          case 1: return renderLoadBalancerBasics();
          case 2: return renderReview();
          case 3: return renderReview();
          default: return renderLoadBalancerBasics();
        }
      case 'publicip':
        switch (currentStep) {
          case 1: return renderPublicIPBasics();
          case 2: return renderReview();
          default: return renderPublicIPBasics();
        }
      default:
        return renderResourceTypeSelection();
    }
  };

  const steps = getSteps();
  const isLastStep = currentStep === steps.length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center">
          {getResourceIcon(formData.resourceType)}
          <div className="ml-3">
            <h1 className="text-2xl font-semibold text-gray-800">Create networking resource</h1>
            <p className="mt-1 text-gray-600">Configure the settings for your new networking resource</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 pr-0 md:pr-6">
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => step.number < currentStep && setCurrentStep(step.number)}
                  className={`px-4 py-3 text-sm font-medium ${
                    currentStep === step.number
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } ${step.number < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                  disabled={step.number > currentStep}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              {renderStepContent()}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-between border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {!isLastStep ? (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <ChevronRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Resource
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/4 mt-6 md:mt-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Estimated cost</h3>
              <button className="text-blue-600 hover:text-blue-800 focus:outline-none">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"/>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="text-xl font-semibold text-gray-800">${costs.total.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Estimated monthly cost</div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base cost</span>
                  <span className="text-sm font-medium">${costs.base.toFixed(2)}</span>
                </div>
                {costs.ddos > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">DDoS Protection</span>
                    <span className="text-sm font-medium">${costs.ddos.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data transfer</span>
                  <span className="text-sm font-medium">${costs.data.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Costs indicated here are estimates only. Pricing may vary depending on your subscription type, usage patterns, and currency exchange rates.
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Selected Configuration</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                {getResourceIcon(formData.resourceType)}
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {formData.resourceType === 'vnet' && 'Virtual Network'}
                    {formData.resourceType === 'nsg' && 'Network Security Group'}
                    {formData.resourceType === 'loadbalancer' && 'Load Balancer'}
                    {formData.resourceType === 'publicip' && 'Public IP Address'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formData.resourceType === 'vnet' && formData.vnetLocation}
                    {formData.resourceType === 'nsg' && formData.nsgLocation}
                    {formData.resourceType === 'loadbalancer' && formData.lbLocation}
                    {formData.resourceType === 'publicip' && formData.pipLocation}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Resource Type</span>
                  <span className="font-medium">
                    {formData.resourceType === 'vnet' && 'VNet'}
                    {formData.resourceType === 'nsg' && 'NSG'}
                    {formData.resourceType === 'loadbalancer' && 'Load Balancer'}
                    {formData.resourceType === 'publicip' && 'Public IP'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resource Group</span>
                  <span className="font-medium">
                    {formData.resourceType === 'vnet' && formData.vnetResourceGroup}
                    {formData.resourceType === 'nsg' && formData.nsgResourceGroup}
                    {formData.resourceType === 'loadbalancer' && formData.lbResourceGroup}
                    {formData.resourceType === 'publicip' && formData.pipResourceGroup}
                  </span>
                </div>
                {formData.resourceType === 'vnet' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address Spaces</span>
                      <span className="font-medium">{formData.addressSpaces.filter(space => space.trim() !== '').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subnets</span>
                      <span className="font-medium">{formData.subnets.length}</span>
                    </div>
                  </>
                )}
                {formData.resourceType === 'nsg' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Rules</span>
                    <span className="font-medium">{formData.securityRules.length}</span>
                  </div>
                )}
                {formData.resourceType === 'loadbalancer' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium">{formData.lbType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU</span>
                      <span className="font-medium">{formData.lbSku}</span>
                    </div>
                  </>
                )}
                {formData.resourceType === 'publicip' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assignment</span>
                      <span className="font-medium">{formData.pipAssignment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU</span>
                      <span className="font-medium">{formData.pipSku}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNetworking;