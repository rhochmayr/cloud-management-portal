import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorageContext } from '../context/StorageContext';
import { ChevronLeft, ChevronRight, Info, HardDrive, AlertCircle, Database, Folder, Archive } from 'lucide-react';

interface StorageAccountFormData {
  name: string;
  resourceGroup: string;
  location: string;
  accountType: 'Standard_LRS' | 'Standard_GRS' | 'Standard_RAGRS' | 'Premium_LRS' | 'Premium_ZRS';
  performance: 'Standard' | 'Premium';
  accessTier: 'Hot' | 'Cool' | 'Archive';
  enableHierarchicalNamespace: boolean;
  enableBlobPublicAccess: boolean;
  minimumTlsVersion: string;
  allowSharedKeyAccess: boolean;
  enableHttpsTrafficOnly: boolean;
  enableLargeFileShares: boolean;
  usedCapacity: number;
  totalCapacity: number;
  containers: number;
  fileShares: number;
}

interface DiskFormData {
  name: string;
  resourceGroup: string;
  location: string;
  type: 'Premium SSD' | 'Standard SSD' | 'Standard HDD' | 'Ultra SSD';
  size: number;
  iops: number;
  throughput: number;
  encryption: 'Platform-managed' | 'Customer-managed';
  enableBurstingCredit: boolean;
  enableSharedDisk: boolean;
  maxShares: number;
  diskAccessId: string;
  networkAccessPolicy: 'AllowAll' | 'AllowPrivate' | 'DenyAll';
}

const CreateStorage: React.FC = () => {
  const navigate = useNavigate();
  const { addStorageAccount, addDisk } = useStorageContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [storageType, setStorageType] = useState<'account' | 'disk' | 'fileshare' | 'container'>('account');
  
  const [storageAccountData, setStorageAccountData] = useState<StorageAccountFormData>({
    name: '',
    resourceGroup: 'production-group',
    location: 'West Europe',
    accountType: 'Standard_LRS',
    performance: 'Standard',
    accessTier: 'Hot',
    enableHierarchicalNamespace: false,
    enableBlobPublicAccess: true,
    minimumTlsVersion: '1.2',
    allowSharedKeyAccess: true,
    enableHttpsTrafficOnly: true,
    enableLargeFileShares: false,
    usedCapacity: 0,
    totalCapacity: 500,
    containers: 0,
    fileShares: 0,
  });

  const [diskData, setDiskData] = useState<DiskFormData>({
    name: '',
    resourceGroup: 'production-group',
    location: 'West Europe',
    type: 'Premium SSD',
    size: 128,
    iops: 500,
    throughput: 100,
    encryption: 'Platform-managed',
    enableBurstingCredit: false,
    enableSharedDisk: false,
    maxShares: 1,
    diskAccessId: '',
    networkAccessPolicy: 'AllowAll',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: 'Basics' },
    { number: 2, title: 'Advanced' },
    { number: 3, title: 'Networking' },
    { number: 4, title: 'Data protection' },
    { number: 5, title: 'Encryption' },
    { number: 6, title: 'Review + create' }
  ];

  const diskSteps = [
    { number: 1, title: 'Basics' },
    { number: 2, title: 'Encryption' },
    { number: 3, title: 'Networking' },
    { number: 4, title: 'Advanced' },
    { number: 5, title: 'Review + create' }
  ];

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

  const accountTypes = [
    { value: 'Standard_LRS', label: 'Locally-redundant storage (LRS)', description: 'Lowest cost option, data replicated within single datacenter' },
    { value: 'Standard_GRS', label: 'Geo-redundant storage (GRS)', description: 'Data replicated to secondary region for disaster recovery' },
    { value: 'Standard_RAGRS', label: 'Read-access geo-redundant storage (RA-GRS)', description: 'GRS with read access to secondary region' },
    { value: 'Premium_LRS', label: 'Premium locally-redundant storage (Premium LRS)', description: 'High-performance SSD storage' },
    { value: 'Premium_ZRS', label: 'Premium zone-redundant storage (Premium ZRS)', description: 'High-performance with zone redundancy' }
  ];

  const diskTypes = [
    { value: 'Premium SSD', label: 'Premium SSD', description: 'High-performance SSD for production workloads', baseIOPS: 500, baseThroughput: 100 },
    { value: 'Standard SSD', label: 'Standard SSD', description: 'Balanced performance and cost for general workloads', baseIOPS: 500, baseThroughput: 60 },
    { value: 'Standard HDD', label: 'Standard HDD', description: 'Cost-effective storage for infrequent access', baseIOPS: 500, baseThroughput: 60 },
    { value: 'Ultra SSD', label: 'Ultra SSD', description: 'Highest performance for mission-critical workloads', baseIOPS: 1200, baseThroughput: 300 }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (storageType === 'account') {
      if (step === 1) {
        if (!storageAccountData.name) newErrors.name = 'Storage account name is required';
        if (storageAccountData.name && (storageAccountData.name.length < 3 || storageAccountData.name.length > 24)) {
          newErrors.name = 'Storage account name must be between 3 and 24 characters';
        }
        if (storageAccountData.name && !/^[a-z0-9]+$/.test(storageAccountData.name)) {
          newErrors.name = 'Storage account name can only contain lowercase letters and numbers';
        }
        if (!storageAccountData.resourceGroup) newErrors.resourceGroup = 'Resource group is required';
        if (!storageAccountData.location) newErrors.location = 'Location is required';
      }
    } else if (storageType === 'disk') {
      if (step === 1) {
        if (!diskData.name) newErrors.name = 'Disk name is required';
        if (!diskData.resourceGroup) newErrors.resourceGroup = 'Resource group is required';
        if (!diskData.location) newErrors.location = 'Location is required';
        if (!diskData.size) newErrors.size = 'Disk size is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const maxSteps = storageType === 'disk' ? diskSteps.length : steps.length;
      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleStorageAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    const val = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number'
      ? parseInt(value) || 0
      : value;
    
    setStorageAccountData({
      ...storageAccountData,
      [name]: val
    });
    
    // Clear error when user fixes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Update performance tier based on account type
    if (name === 'accountType') {
      const isPremium = value.startsWith('Premium');
      setStorageAccountData(prev => ({
        ...prev,
        [name]: val,
        performance: isPremium ? 'Premium' : 'Standard'
      }));
    }
  };

  const handleDiskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    const val = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number'
      ? parseInt(value) || 0
      : value;
    
    setDiskData({
      ...diskData,
      [name]: val
    });
    
    // Clear error when user fixes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Update IOPS and throughput based on disk type and size
    if (name === 'type' || name === 'size') {
      const selectedType = name === 'type' ? value : diskData.type;
      const selectedSize = name === 'size' ? parseInt(value) : diskData.size;
      const typeConfig = diskTypes.find(t => t.value === selectedType);
      
      if (typeConfig) {
        const sizeMultiplier = Math.max(1, selectedSize / 128);
        setDiskData(prev => ({
          ...prev,
          [name]: val,
          iops: Math.round(typeConfig.baseIOPS * sizeMultiplier),
          throughput: Math.round(typeConfig.baseThroughput * sizeMultiplier)
        }));
      }
    }
  };

  const handleSubmit = () => {
    const maxSteps = storageType === 'disk' ? diskSteps.length : steps.length;
    if (validateStep(maxSteps)) {
      if (storageType === 'account') {
        addStorageAccount({
          name: storageAccountData.name,
          resourceGroup: storageAccountData.resourceGroup,
          location: storageAccountData.location,
          subscription: 'Enterprise Dev/Test',
          accountType: storageAccountData.accountType,
          performance: storageAccountData.performance,
          replication: accountTypes.find(t => t.value === storageAccountData.accountType)?.label.split(' (')[0] || 'LRS',
          accessTier: storageAccountData.accessTier,
          usedCapacity: storageAccountData.usedCapacity,
          totalCapacity: storageAccountData.totalCapacity,
          containers: storageAccountData.containers,
          fileShares: storageAccountData.fileShares,
        });
      } else if (storageType === 'disk') {
        addDisk({
          name: diskData.name,
          resourceGroup: diskData.resourceGroup,
          location: diskData.location,
          subscription: 'Enterprise Dev/Test',
          type: diskData.type,
          size: diskData.size,
          iops: diskData.iops,
          throughput: diskData.throughput,
          encryption: diskData.encryption,
        });
      }
      
      navigate('/storage');
    }
  };

  const calculateEstimatedCost = () => {
    if (storageType === 'account') {
      const baseCosts = {
        'Standard_LRS': 0.018,
        'Standard_GRS': 0.036,
        'Standard_RAGRS': 0.045,
        'Premium_LRS': 0.15,
        'Premium_ZRS': 0.188
      };
      
      const storageCost = (storageAccountData.totalCapacity * baseCosts[storageAccountData.accountType]) || 0;
      const transactionCost = 5.00; // Base transaction cost
      const dataCost = storageAccountData.accessTier === 'Hot' ? 10 : storageAccountData.accessTier === 'Cool' ? 5 : 2;
      
      return {
        storage: storageCost,
        transactions: transactionCost,
        data: dataCost,
        total: storageCost + transactionCost + dataCost
      };
    } else {
      const diskCosts = {
        'Premium SSD': 0.135,
        'Standard SSD': 0.095,
        'Standard HDD': 0.045,
        'Ultra SSD': 0.30
      };
      
      const diskCost = (diskData.size * diskCosts[diskData.type]) || 0;
      const iopsOverage = Math.max(0, diskData.iops - 500) * 0.0005;
      const throughputOverage = Math.max(0, diskData.throughput - 100) * 0.002;
      
      return {
        disk: diskCost,
        iops: iopsOverage,
        throughput: throughputOverage,
        total: diskCost + iopsOverage + throughputOverage
      };
    }
  };

  const costs = calculateEstimatedCost();

  const getStorageTypeIcon = (type: string) => {
    switch (type) {
      case 'account':
        return <Database size={24} className="text-blue-600" />;
      case 'disk':
        return <HardDrive size={24} className="text-purple-600" />;
      case 'fileshare':
        return <Folder size={24} className="text-green-600" />;
      case 'container':
        return <Archive size={24} className="text-orange-600" />;
      default:
        return <Database size={24} className="text-blue-600" />;
    }
  };

  const renderStorageTypeSelection = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4 flex">
        <div className="mr-3 text-blue-500">
          <Info size={20} />
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Choose storage type</p>
          <p className="mt-1">
            Select the type of storage resource you want to create. Each type serves different use cases and has specific configuration options.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setStorageType('account')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            storageType === 'account' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded p-2 mr-3">
              <Database size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Storage Account</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create a storage account for blobs, files, queues, and tables. Provides a unique namespace for your Azure Storage data.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            • Blob storage • File shares • Queue storage • Table storage
          </div>
        </button>

        <button
          onClick={() => setStorageType('disk')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            storageType === 'disk' 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 rounded p-2 mr-3">
              <HardDrive size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Managed Disk</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create a managed disk for virtual machines. Azure handles the storage account management automatically.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            • OS disks • Data disks • Premium SSD • Standard SSD • Standard HDD
          </div>
        </button>

        <button
          onClick={() => setStorageType('fileshare')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            storageType === 'fileshare' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 rounded p-2 mr-3">
              <Folder size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">File Share</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create a file share for shared storage accessible via SMB or NFS protocols. Perfect for application data sharing.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            • SMB protocol • NFS protocol • Premium tier • Transaction optimized
          </div>
        </button>

        <button
          onClick={() => setStorageType('container')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            storageType === 'container' 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 rounded p-2 mr-3">
              <Archive size={24} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Blob Container</h3>
          </div>
          <p className="text-sm text-gray-600">
            Create a blob container for unstructured data storage. Ideal for documents, images, videos, and backup data.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            • Block blobs • Page blobs • Append blobs • Hot/Cool/Archive tiers
          </div>
        </button>
      </div>
    </div>
  );

  const renderStorageAccountBasics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Storage account name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={storageAccountData.name}
              onChange={handleStorageAccountChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="mystorageaccount"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            <p className="mt-1 text-xs text-gray-500">Must be 3-24 characters, lowercase letters and numbers only</p>
          </div>
          
          <div>
            <label htmlFor="resourceGroup" className="block text-sm font-medium text-gray-700">
              Resource group <span className="text-red-500">*</span>
            </label>
            <select
              id="resourceGroup"
              name="resourceGroup"
              value={storageAccountData.resourceGroup}
              onChange={handleStorageAccountChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.resourceGroup ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {resourceGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.resourceGroup && <p className="mt-1 text-sm text-red-500">{errors.resourceGroup}</p>}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              name="location"
              value={storageAccountData.location}
              onChange={handleStorageAccountChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="performance" className="block text-sm font-medium text-gray-700">
              Performance <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="performanceStandard"
                  name="performance"
                  type="radio"
                  value="Standard"
                  checked={storageAccountData.performance === 'Standard'}
                  onChange={handleStorageAccountChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="performanceStandard" className="ml-2 block text-sm text-gray-700">
                  Standard - General-purpose v2 account
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="performancePremium"
                  name="performance"
                  type="radio"
                  value="Premium"
                  checked={storageAccountData.performance === 'Premium'}
                  onChange={handleStorageAccountChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="performancePremium" className="ml-2 block text-sm text-gray-700">
                  Premium - High-performance storage
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
              Redundancy <span className="text-red-500">*</span>
            </label>
            <select
              id="accountType"
              name="accountType"
              value={storageAccountData.accountType}
              onChange={handleStorageAccountChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {accountTypes
                .filter(type => storageAccountData.performance === 'Premium' ? type.value.startsWith('Premium') : !type.value.startsWith('Premium'))
                .map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {accountTypes.find(t => t.value === storageAccountData.accountType)?.description}
            </p>
          </div>
          
          <div>
            <label htmlFor="accessTier" className="block text-sm font-medium text-gray-700">
              Access tier
            </label>
            <select
              id="accessTier"
              name="accessTier"
              value={storageAccountData.accessTier}
              onChange={handleStorageAccountChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={storageAccountData.performance === 'Premium'}
            >
              <option value="Hot">Hot - Frequently accessed data</option>
              <option value="Cool">Cool - Infrequently accessed data</option>
              <option value="Archive">Archive - Rarely accessed data</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiskBasics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Disk name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={diskData.name}
              onChange={handleDiskChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="my-disk"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="resourceGroup" className="block text-sm font-medium text-gray-700">
              Resource group <span className="text-red-500">*</span>
            </label>
            <select
              id="resourceGroup"
              name="resourceGroup"
              value={diskData.resourceGroup}
              onChange={handleDiskChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.resourceGroup ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {resourceGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.resourceGroup && <p className="mt-1 text-sm text-red-500">{errors.resourceGroup}</p>}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              name="location"
              value={diskData.location}
              onChange={handleDiskChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Disk type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={diskData.type}
              onChange={handleDiskChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {diskTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {diskTypes.find(t => t.value === diskData.type)?.description}
            </p>
          </div>
          
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size (GB) <span className="text-red-500">*</span>
            </label>
            <select
              id="size"
              name="size"
              value={diskData.size}
              onChange={handleDiskChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.size ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="32">32 GB</option>
              <option value="64">64 GB</option>
              <option value="128">128 GB</option>
              <option value="256">256 GB</option>
              <option value="512">512 GB</option>
              <option value="1024">1024 GB (1 TB)</option>
              <option value="2048">2048 GB (2 TB)</option>
              <option value="4096">4096 GB (4 TB)</option>
            </select>
            {errors.size && <p className="mt-1 text-sm text-red-500">{errors.size}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="iops" className="block text-sm font-medium text-gray-700">
                IOPS
              </label>
              <input
                type="number"
                id="iops"
                name="iops"
                value={diskData.iops}
                onChange={handleDiskChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="throughput" className="block text-sm font-medium text-gray-700">
                Throughput (MB/s)
              </label>
              <input
                type="number"
                id="throughput"
                name="throughput"
                value={diskData.throughput}
                onChange={handleDiskChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => {
    if (storageType === 'account') {
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="enableHierarchicalNamespace"
                name="enableHierarchicalNamespace"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={storageAccountData.enableHierarchicalNamespace}
                onChange={handleStorageAccountChange}
              />
              <label htmlFor="enableHierarchicalNamespace" className="ml-2 block text-sm text-gray-700">
                Enable hierarchical namespace (Data Lake Storage Gen2)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="enableBlobPublicAccess"
                name="enableBlobPublicAccess"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={storageAccountData.enableBlobPublicAccess}
                onChange={handleStorageAccountChange}
              />
              <label htmlFor="enableBlobPublicAccess" className="ml-2 block text-sm text-gray-700">
                Allow blob public access
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="enableLargeFileShares"
                name="enableLargeFileShares"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={storageAccountData.enableLargeFileShares}
                onChange={handleStorageAccountChange}
                disabled={storageAccountData.performance === 'Premium'}
              />
              <label htmlFor="enableLargeFileShares" className="ml-2 block text-sm text-gray-700">
                Enable large file shares
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="minimumTlsVersion" className="block text-sm font-medium text-gray-700">
              Minimum TLS version
            </label>
            <select
              id="minimumTlsVersion"
              name="minimumTlsVersion"
              value={storageAccountData.minimumTlsVersion}
              onChange={handleStorageAccountChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1.0">TLS 1.0</option>
              <option value="1.1">TLS 1.1</option>
              <option value="1.2">TLS 1.2</option>
            </select>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="enableBurstingCredit"
                name="enableBurstingCredit"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={diskData.enableBurstingCredit}
                onChange={handleDiskChange}
              />
              <label htmlFor="enableBurstingCredit" className="ml-2 block text-sm text-gray-700">
                Enable bursting credit
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="enableSharedDisk"
                name="enableSharedDisk"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={diskData.enableSharedDisk}
                onChange={handleDiskChange}
              />
              <label htmlFor="enableSharedDisk" className="ml-2 block text-sm text-gray-700">
                Enable shared disk
              </label>
            </div>
          </div>
          
          {diskData.enableSharedDisk && (
            <div>
              <label htmlFor="maxShares" className="block text-sm font-medium text-gray-700">
                Max shares
              </label>
              <select
                id="maxShares"
                name="maxShares"
                value={diskData.maxShares}
                onChange={handleDiskChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
          )}
        </div>
      );
    }
  };

  const renderNetworking = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Network access
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="networkPublic"
                name="networkAccess"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                defaultChecked
              />
              <label htmlFor="networkPublic" className="ml-2 block text-sm text-gray-700">
                Enable public access from all networks
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="networkSelected"
                name="networkAccess"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="networkSelected" className="ml-2 block text-sm text-gray-700">
                Enable public access from selected virtual networks and IP addresses
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="networkPrivate"
                name="networkAccess"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="networkPrivate" className="ml-2 block text-sm text-gray-700">
                Disable public access and use private access
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="enableHttpsTrafficOnly"
              name="enableHttpsTrafficOnly"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={storageType === 'account' ? storageAccountData.enableHttpsTrafficOnly : true}
              onChange={storageType === 'account' ? handleStorageAccountChange : undefined}
              disabled={storageType === 'disk'}
            />
            <label htmlFor="enableHttpsTrafficOnly" className="ml-2 block text-sm text-gray-700">
              Secure transfer required (HTTPS only)
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Require secure transfer (HTTPS) to ensure the security of your data in transit.
          </p>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex">
        <div className="mr-3 text-yellow-500">
          <AlertCircle size={20} />
        </div>
        <div className="text-sm text-yellow-800">
          <p className="font-medium">Network security</p>
          <p className="mt-1">
            Configure network access carefully to ensure your storage is secure while remaining accessible to authorized users and applications.
          </p>
        </div>
      </div>
    </div>
  );

  const renderDataProtection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="enableSoftDelete"
            name="enableSoftDelete"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            defaultChecked
          />
          <label htmlFor="enableSoftDelete" className="ml-2 block text-sm text-gray-700">
            Enable soft delete for blobs
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="enableVersioning"
            name="enableVersioning"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableVersioning" className="ml-2 block text-sm text-gray-700">
            Enable versioning for blobs
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="enableChangeTracking"
            name="enableChangeTracking"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableChangeTracking" className="ml-2 block text-sm text-gray-700">
            Enable blob change tracking
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="retentionDays" className="block text-sm font-medium text-gray-700">
          Soft delete retention period (days)
        </label>
        <select
          id="retentionDays"
          name="retentionDays"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          defaultValue="7"
        >
          <option value="1">1 day</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
          <option value="365">365 days</option>
        </select>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <div className="flex">
          <div className="mr-3 text-blue-500">
            <Info size={20} />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Data protection features</p>
            <p className="mt-1">
              These features help protect your data from accidental deletion or modification. Soft delete allows recovery of deleted blobs within the retention period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEncryption = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Encryption type
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="encryptionPlatform"
                name="encryption"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                checked={storageType === 'disk' ? diskData.encryption === 'Platform-managed' : true}
                onChange={storageType === 'disk' ? handleDiskChange : undefined}
                value="Platform-managed"
              />
              <label htmlFor="encryptionPlatform" className="ml-2 block text-sm text-gray-700">
                Microsoft-managed keys (MMK)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="encryptionCustomer"
                name="encryption"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                checked={storageType === 'disk' ? diskData.encryption === 'Customer-managed' : false}
                onChange={storageType === 'disk' ? handleDiskChange : undefined}
                value="Customer-managed"
              />
              <label htmlFor="encryptionCustomer" className="ml-2 block text-sm text-gray-700">
                Customer-managed keys (CMK)
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="enableInfrastructureEncryption"
            name="enableInfrastructureEncryption"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableInfrastructureEncryption" className="ml-2 block text-sm text-gray-700">
            Enable infrastructure encryption
          </label>
        </div>
      </div>
      
      <div className="bg-green-50 border border-green-100 rounded-md p-4">
        <div className="flex">
          <div className="mr-3 text-green-500">
            <Info size={20} />
          </div>
          <div className="text-sm text-green-800">
            <p className="font-medium">Encryption at rest</p>
            <p className="mt-1">
              All data stored in Azure Storage is automatically encrypted using 256-bit AES encryption. Choose between Microsoft-managed or customer-managed keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => {
    const currentData = storageType === 'account' ? storageAccountData : diskData;
    
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {storageType === 'account' ? 'Storage Account' : 'Managed Disk'} Configuration Summary
            </h3>
          </div>
          <div className="p-4 divide-y divide-gray-200">
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-500">BASICS</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="text-sm flex items-center">
                    <div className="mr-2">
                      {getStorageTypeIcon(storageType)}
                    </div>
                    {currentData.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Resource Group</div>
                  <div className="text-sm">{currentData.resourceGroup}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="text-sm">{currentData.location}</div>
                </div>
                {storageType === 'account' ? (
                  <>
                    <div>
                      <div className="text-xs text-gray-500">Performance</div>
                      <div className="text-sm">{storageAccountData.performance}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Redundancy</div>
                      <div className="text-sm">{accountTypes.find(t => t.value === storageAccountData.accountType)?.label.split(' (')[0]}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Access Tier</div>
                      <div className="text-sm">{storageAccountData.accessTier}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-xs text-gray-500">Disk Type</div>
                      <div className="text-sm">{diskData.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Size</div>
                      <div className="text-sm">{diskData.size} GB</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">IOPS</div>
                      <div className="text-sm">{diskData.iops.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Throughput</div>
                      <div className="text-sm">{diskData.throughput} MB/s</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-500">SECURITY</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">Encryption</div>
                  <div className="text-sm">
                    {storageType === 'disk' ? diskData.encryption : 'Microsoft-managed keys'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Secure Transfer</div>
                  <div className="text-sm">
                    {storageType === 'account' ? (storageAccountData.enableHttpsTrafficOnly ? 'Required' : 'Optional') : 'Required'}
                  </div>
                </div>
                {storageType === 'account' && (
                  <>
                    <div>
                      <div className="text-xs text-gray-500">Minimum TLS</div>
                      <div className="text-sm">TLS {storageAccountData.minimumTlsVersion}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Public Access</div>
                      <div className="text-sm">{storageAccountData.enableBlobPublicAccess ? 'Allowed' : 'Disabled'}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="py-3">
              <h4 className="text-sm font-medium text-gray-500">NETWORKING</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <div className="text-xs text-gray-500">Network Access</div>
                  <div className="text-sm">Public endpoint (all networks)</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Routing Preference</div>
                  <div className="text-sm">Microsoft network routing</div>
                </div>
              </div>
            </div>
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
  };

  const renderStepContent = () => {
    if (currentStep === 1 && storageType === 'account') {
      return renderStorageTypeSelection();
    }
    
    const maxSteps = storageType === 'disk' ? diskSteps.length : steps.length;
    const adjustedStep = storageType === 'account' ? currentStep - 1 : currentStep;
    
    switch (adjustedStep) {
      case 1:
        return storageType === 'account' ? renderStorageAccountBasics() : renderDiskBasics();
      case 2:
        return storageType === 'account' ? renderAdvancedSettings() : renderEncryption();
      case 3:
        return renderNetworking();
      case 4:
        return storageType === 'account' ? renderDataProtection() : renderAdvancedSettings();
      case 5:
        return storageType === 'account' ? renderEncryption() : renderReview();
      case 6:
        return renderReview();
      default:
        return null;
    }
  };

  const getCurrentSteps = () => {
    if (storageType === 'account') {
      return [
        { number: 1, title: 'Storage type' },
        ...steps
      ];
    }
    return diskSteps;
  };

  const currentSteps = getCurrentSteps();
  const maxSteps = currentSteps.length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center">
          {getStorageTypeIcon(storageType)}
          <h1 className="text-2xl font-semibold text-gray-800 ml-2">Create storage</h1>
        </div>
        <p className="mt-1 text-gray-600">Configure the settings for your new storage resource</p>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 pr-0 md:pr-6">
          <div className="mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {currentSteps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => step.number < currentStep && setCurrentStep(step.number)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
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
              
              {currentStep < maxSteps ? (
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
                  Create {storageType === 'account' ? 'Storage Account' : 'Disk'}
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
                {storageType === 'account' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Storage</span>
                      <span className="text-sm font-medium">${costs.storage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Transactions</span>
                      <span className="text-sm font-medium">${costs.transactions.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Data operations</span>
                      <span className="text-sm font-medium">${costs.data.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Disk</span>
                      <span className="text-sm font-medium">${costs.disk.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IOPS</span>
                      <span className="text-sm font-medium">${costs.iops.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Throughput</span>
                      <span className="text-sm font-medium">${costs.throughput.toFixed(2)}</span>
                    </div>
                  </>
                )}
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
                {getStorageTypeIcon(storageType)}
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {storageType === 'account' ? 'Storage Account' : 'Managed Disk'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {storageType === 'account' ? storageAccountData.performance : diskData.type}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">
                    {storageType === 'account' ? storageAccountData.accountType : diskData.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">
                    {storageType === 'account' ? storageAccountData.location : diskData.location}
                  </span>
                </div>
                {storageType === 'account' ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access Tier</span>
                    <span className="font-medium">{storageAccountData.accessTier}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium">{diskData.size} GB</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStorage;