import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabaseContext, DatabaseEngine, DatabaseTier } from '../context/DatabaseContext';
import { ChevronLeft, ChevronRight, Info, Database, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  resourceGroup: string;
  location: string;
  engine: DatabaseEngine;
  version: string;
  tier: DatabaseTier;
  computeSize: string;
  storage: number;
  adminUsername: string;
  adminPassword: string;
  confirmPassword: string;
  enableBackup: boolean;
  backupRetention: number;
  enableSSL: boolean;
  allowAzureServices: boolean;
  enableFirewall: boolean;
  firewallStartIP: string;
  firewallEndIP: string;
}

const CreateDatabase: React.FC = () => {
  const navigate = useNavigate();
  const { addDatabase } = useDatabaseContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    resourceGroup: 'production-group',
    location: 'West Europe',
    engine: 'MySQL',
    version: '8.0',
    tier: 'Standard',
    computeSize: 'Standard_B2s',
    storage: 100,
    adminUsername: 'admin',
    adminPassword: '',
    confirmPassword: '',
    enableBackup: true,
    backupRetention: 7,
    enableSSL: true,
    allowAzureServices: true,
    enableFirewall: false,
    firewallStartIP: '',
    firewallEndIP: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: 'Basics' },
    { number: 2, title: 'Networking' },
    { number: 3, title: 'Security' },
    { number: 4, title: 'Additional settings' },
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

  const engineVersions: Record<DatabaseEngine, string[]> = {
    'MySQL': ['8.0', '5.7'],
    'PostgreSQL': ['15.0', '14.0', '13.0'],
    'SQL Server': ['2022', '2019', '2017'],
    'MongoDB': ['6.0', '5.0', '4.4'],
    'Redis': ['7.0', '6.2'],
    'MariaDB': ['10.6', '10.5', '10.4']
  };

  const computeSizes: Record<DatabaseTier, string[]> = {
    'Basic': ['Standard_B1ms', 'Standard_B2s'],
    'Standard': ['Standard_B2s', 'Standard_B4ms', 'Standard_B8ms'],
    'Premium': ['Standard_D2s_v3', 'Standard_D4s_v3', 'Standard_D8s_v3'],
    'General Purpose': ['Standard_D2s_v3', 'Standard_D4s_v3', 'Standard_D8s_v3', 'Standard_D16s_v3'],
    'Business Critical': ['Standard_M8ms', 'Standard_M16ms', 'Standard_M32ms']
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Database name is required';
      if (!formData.resourceGroup) newErrors.resourceGroup = 'Resource group is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.engine) newErrors.engine = 'Database engine is required';
      if (!formData.version) newErrors.version = 'Version is required';
      if (!formData.tier) newErrors.tier = 'Tier is required';
      if (!formData.computeSize) newErrors.computeSize = 'Compute size is required';
      if (!formData.storage) newErrors.storage = 'Storage size is required';
    } 
    else if (step === 3) {
      if (!formData.adminUsername) newErrors.adminUsername = 'Admin username is required';
      if (!formData.adminPassword) {
        newErrors.adminPassword = 'Admin password is required';
      } else if (formData.adminPassword.length < 8) {
        newErrors.adminPassword = 'Password must be at least 8 characters';
      }
      if (formData.adminPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.enableFirewall) {
        if (!formData.firewallStartIP) newErrors.firewallStartIP = 'Start IP is required';
        if (!formData.firewallEndIP) newErrors.firewallEndIP = 'End IP is required';
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

    // Update version options when engine changes
    if (name === 'engine') {
      setFormData(prev => ({
        ...prev,
        [name]: val as DatabaseEngine,
        version: engineVersions[val as DatabaseEngine][0]
      }));
    }

    // Update compute size options when tier changes
    if (name === 'tier') {
      setFormData(prev => ({
        ...prev,
        [name]: val as DatabaseTier,
        computeSize: computeSizes[val as DatabaseTier][0]
      }));
    }
  };

  const handleSubmit = () => {
    if (validateStep(5)) {
      // Add database
      addDatabase({
        name: formData.name,
        engine: formData.engine,
        version: formData.version,
        tier: formData.tier,
        resourceGroup: formData.resourceGroup,
        location: formData.location,
        subscription: 'Enterprise Dev/Test',
        port: getDefaultPort(formData.engine),
        storage: formData.storage,
        computeSize: formData.computeSize,
      });
      
      // Navigate back to database list
      navigate('/databases');
    }
  };

  const getDefaultPort = (engine: DatabaseEngine): number => {
    switch (engine) {
      case 'MySQL':
      case 'MariaDB':
        return 3306;
      case 'PostgreSQL':
        return 5432;
      case 'SQL Server':
        return 1433;
      case 'MongoDB':
        return 27017;
      case 'Redis':
        return 6379;
      default:
        return 3306;
    }
  };

  const calculateEstimatedCost = () => {
    const baseCosts: Record<DatabaseTier, number> = {
      'Basic': 15,
      'Standard': 45,
      'Premium': 120,
      'General Purpose': 200,
      'Business Critical': 450
    };
    
    const storageCost = formData.storage * 0.12; // $0.12 per GB
    const computeCost = baseCosts[formData.tier] || 45;
    const backupCost = formData.enableBackup ? 10 : 0;
    
    return {
      compute: computeCost,
      storage: storageCost,
      backup: backupCost,
      total: computeCost + storageCost + backupCost
    };
  };

  const costs = calculateEstimatedCost();

  const getEngineIcon = (engine: DatabaseEngine) => {
    const iconClass = "w-8 h-8";
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
        return <Database size={32} className="text-blue-700" />;
    }
  };

  const renderBasics = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4 flex">
        <div className="mr-3 text-blue-500">
          <Info size={20} />
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">Database deployment</p>
          <p className="mt-1">
            Choose your database engine and configuration. You can modify most settings after deployment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Database name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="my-database"
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
              value={formData.resourceGroup}
              onChange={handleChange}
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
              value={formData.location}
              onChange={handleChange}
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
            <label htmlFor="engine" className="block text-sm font-medium text-gray-700">
              Database engine <span className="text-red-500">*</span>
            </label>
            <select
              id="engine"
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.engine ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {Object.keys(engineVersions).map((engine) => (
                <option key={engine} value={engine}>
                  {engine}
                </option>
              ))}
            </select>
            {errors.engine && <p className="mt-1 text-sm text-red-500">{errors.engine}</p>}
          </div>
          
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-gray-700">
              Version <span className="text-red-500">*</span>
            </label>
            <select
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.version ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {engineVersions[formData.engine].map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
            {errors.version && <p className="mt-1 text-sm text-red-500">{errors.version}</p>}
          </div>
          
          <div>
            <label htmlFor="tier" className="block text-sm font-medium text-gray-700">
              Pricing tier <span className="text-red-500">*</span>
            </label>
            <select
              id="tier"
              name="tier"
              value={formData.tier}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.tier ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {Object.keys(computeSizes).map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
            {errors.tier && <p className="mt-1 text-sm text-red-500">{errors.tier}</p>}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="computeSize" className="block text-sm font-medium text-gray-700">
            Compute size <span className="text-red-500">*</span>
          </label>
          <select
            id="computeSize"
            name="computeSize"
            value={formData.computeSize}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.computeSize ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {computeSizes[formData.tier].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {errors.computeSize && <p className="mt-1 text-sm text-red-500">{errors.computeSize}</p>}
        </div>
        
        <div>
          <label htmlFor="storage" className="block text-sm font-medium text-gray-700">
            Storage (GB) <span className="text-red-500">*</span>
          </label>
          <select
            id="storage"
            name="storage"
            value={formData.storage}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.storage ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="20">20 GB</option>
            <option value="50">50 GB</option>
            <option value="100">100 GB</option>
            <option value="250">250 GB</option>
            <option value="500">500 GB</option>
            <option value="1000">1000 GB (1 TB)</option>
            <option value="2000">2000 GB (2 TB)</option>
          </select>
          {errors.storage && <p className="mt-1 text-sm text-red-500">{errors.storage}</p>}
        </div>
      </div>
    </div>
  );

  const renderNetworking = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Connectivity method
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="publicEndpoint"
                name="connectivityMethod"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                defaultChecked
              />
              <label htmlFor="publicEndpoint" className="ml-2 block text-sm text-gray-700">
                Public endpoint (accessible from any Azure service)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="privateEndpoint"
                name="connectivityMethod"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="privateEndpoint" className="ml-2 block text-sm text-gray-700">
                Private endpoint (accessible only from virtual network)
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="allowAzureServices"
              name="allowAzureServices"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.allowAzureServices}
              onChange={handleChange}
            />
            <label htmlFor="allowAzureServices" className="ml-2 block text-sm text-gray-700">
              Allow Azure services and resources to access this server
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            This will add a firewall rule that enables access from all Azure services.
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
            Configure firewall rules in the Security tab to control which IP addresses can connect to your database.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700">
            Admin username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="adminUsername"
            name="adminUsername"
            value={formData.adminUsername}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.adminUsername ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.adminUsername && <p className="mt-1 text-sm text-red-500">{errors.adminUsername}</p>}
        </div>
        
        <div>
          <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
            Admin password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="adminPassword"
            name="adminPassword"
            value={formData.adminPassword}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.adminPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.adminPassword && <p className="mt-1 text-sm text-red-500">{errors.adminPassword}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="enableSSL"
            name="enableSSL"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.enableSSL}
            onChange={handleChange}
          />
          <label htmlFor="enableSSL" className="ml-2 block text-sm text-gray-700">
            Enforce SSL connection
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="enableFirewall"
            name="enableFirewall"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.enableFirewall}
            onChange={handleChange}
          />
          <label htmlFor="enableFirewall" className="ml-2 block text-sm text-gray-700">
            Add current client IP address to firewall rules
          </label>
        </div>
      </div>
      
      {formData.enableFirewall && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
          <div>
            <label htmlFor="firewallStartIP" className="block text-sm font-medium text-gray-700">
              Start IP address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firewallStartIP"
              name="firewallStartIP"
              value={formData.firewallStartIP}
              onChange={handleChange}
              placeholder="192.168.1.1"
              className={`mt-1 block w-full px-3 py-2 border ${errors.firewallStartIP ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.firewallStartIP && <p className="mt-1 text-sm text-red-500">{errors.firewallStartIP}</p>}
          </div>
          
          <div>
            <label htmlFor="firewallEndIP" className="block text-sm font-medium text-gray-700">
              End IP address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firewallEndIP"
              name="firewallEndIP"
              value={formData.firewallEndIP}
              onChange={handleChange}
              placeholder="192.168.1.255"
              className={`mt-1 block w-full px-3 py-2 border ${errors.firewallEndIP ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.firewallEndIP && <p className="mt-1 text-sm text-red-500">{errors.firewallEndIP}</p>}
          </div>
        </div>
      )}
    </div>
  );

  const renderAdditionalSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="enableBackup"
            name="enableBackup"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.enableBackup}
            onChange={handleChange}
          />
          <label htmlFor="enableBackup" className="ml-2 block text-sm text-gray-700">
            Enable automated backups
          </label>
        </div>
        
        {formData.enableBackup && (
          <div className="ml-6">
            <label htmlFor="backupRetention" className="block text-sm font-medium text-gray-700">
              Backup retention period (days)
            </label>
            <select
              id="backupRetention"
              name="backupRetention"
              value={formData.backupRetention}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <div className="flex">
          <div className="mr-3 text-blue-500">
            <Info size={20} />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Additional configuration</p>
            <p className="mt-1">
              You can configure additional settings such as monitoring, tags, and advanced security features after the database is created.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Database Configuration Summary</h3>
        </div>
        <div className="p-4 divide-y divide-gray-200">
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">BASICS</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Database Name</div>
                <div className="text-sm flex items-center">
                  <div className="mr-2">
                    {getEngineIcon(formData.engine)}
                  </div>
                  {formData.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Resource Group</div>
                <div className="text-sm">{formData.resourceGroup}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm">{formData.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Engine</div>
                <div className="text-sm">{formData.engine} {formData.version}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Pricing Tier</div>
                <div className="text-sm">{formData.tier}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Compute Size</div>
                <div className="text-sm">{formData.computeSize}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Storage</div>
                <div className="text-sm">{formData.storage} GB</div>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">NETWORKING</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Connectivity</div>
                <div className="text-sm">Public endpoint</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Azure Services Access</div>
                <div className="text-sm">{formData.allowAzureServices ? 'Allowed' : 'Denied'}</div>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">SECURITY</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Admin Username</div>
                <div className="text-sm">{formData.adminUsername}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">SSL Enforcement</div>
                <div className="text-sm">{formData.enableSSL ? 'Enabled' : 'Disabled'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Firewall Rules</div>
                <div className="text-sm">{formData.enableFirewall ? 'Custom rules configured' : 'Default rules only'}</div>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">ADDITIONAL SETTINGS</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Automated Backups</div>
                <div className="text-sm">{formData.enableBackup ? 'Enabled' : 'Disabled'}</div>
              </div>
              {formData.enableBackup && (
                <div>
                  <div className="text-xs text-gray-500">Backup Retention</div>
                  <div className="text-sm">{formData.backupRetention} days</div>
                </div>
              )}
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasics();
      case 2:
        return renderNetworking();
      case 3:
        return renderSecurity();
      case 4:
        return renderAdditionalSettings();
      case 5:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center">
          <Database size={24} className="text-blue-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Create a database</h1>
        </div>
        <p className="mt-1 text-gray-600">Configure the settings for your new database</p>
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
              
              {currentStep < steps.length ? (
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
                  Create Database
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
                  <span className="text-sm text-gray-600">Compute</span>
                  <span className="text-sm font-medium">${costs.compute.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm font-medium">${costs.storage.toFixed(2)}</span>
                </div>
                {formData.enableBackup && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Backup</span>
                    <span className="text-sm font-medium">${costs.backup.toFixed(2)}</span>
                  </div>
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
                {getEngineIcon(formData.engine)}
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{formData.engine}</div>
                  <div className="text-xs text-gray-500">Version {formData.version}</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tier</span>
                  <span className="font-medium">{formData.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compute</span>
                  <span className="font-medium">{formData.computeSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium">{formData.storage} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{formData.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDatabase;