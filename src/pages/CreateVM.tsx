import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVMContext } from '../context/VMContext';
import { ChevronLeft, ChevronRight, Info, Server } from 'lucide-react';
import { operatingSystems, regions, resourceGroups, vmSizes } from '../data/mockData';

interface FormData {
  name: string;
  resourceGroup: string;
  region: string;
  os: string;
  size: string;
  username: string;
  password: string;
  confirmPassword: string;
  diskType: string;
  diskSize: number;
  enablePublicIP: boolean;
}

const CreateVM: React.FC = () => {
  const navigate = useNavigate();
  const { addVM } = useVMContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    resourceGroup: resourceGroups[0],
    region: regions[0],
    os: operatingSystems[0],
    size: vmSizes[0].name,
    username: 'admin',
    password: '',
    confirmPassword: '',
    diskType: 'Premium SSD',
    diskSize: 128,
    enablePublicIP: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: 'Basics' },
    { number: 2, title: 'Disks' },
    { number: 3, title: 'Networking' },
    { number: 4, title: 'Management' },
    { number: 5, title: 'Advanced' },
    { number: 6, title: 'Review + create' }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.resourceGroup) newErrors.resourceGroup = 'Resource group is required';
      if (!formData.region) newErrors.region = 'Region is required';
      if (!formData.os) newErrors.os = 'Operating system is required';
      if (!formData.size) newErrors.size = 'VM size is required';
    } 
    else if (step === 2) {
      if (!formData.diskType) newErrors.diskType = 'Disk type is required';
      if (!formData.diskSize) newErrors.diskSize = 'Disk size is required';
    }
    else if (step === 6) {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSubmit = () => {
    if (validateStep(6)) {
      // Create IP address for the VM (mock)
      const ipOctet1 = Math.floor(Math.random() * 255);
      const ipOctet2 = Math.floor(Math.random() * 255);
      const ipOctet3 = Math.floor(Math.random() * 255);
      const ipOctet4 = Math.floor(Math.random() * 255);
      const ipAddress = `${ipOctet1}.${ipOctet2}.${ipOctet3}.${ipOctet4}`;
      
      // Add VM
      addVM({
        name: formData.name,
        resourceGroup: formData.resourceGroup,
        location: formData.region,
        subscription: 'Enterprise Dev/Test',
        os: formData.os,
        size: formData.size,
        ipAddress,
        disks: 1,
      });
      
      // Navigate back to VM list
      navigate('/');
    }
  };

  const getSelectedVMSize = () => {
    return vmSizes.find(size => size.name === formData.size) || vmSizes[0];
  };

  const calculateEstimatedCost = () => {
    const vmSize = getSelectedVMSize();
    const diskCost = formData.diskSize * 0.095; // Simplified cost calculation
    
    return {
      vm: vmSize.price,
      disk: diskCost,
      networking: formData.enablePublicIP ? 15.50 : 0,
      management: 10.00,
      total: vmSize.price + diskCost + (formData.enablePublicIP ? 15.50 : 0) + 10.00
    };
  };

  const costs = calculateEstimatedCost();

  const renderBasics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                VM name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
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
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.region ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && <p className="mt-1 text-sm text-red-500">{errors.region}</p>}
            </div>
          </div>
        </div>
        
        <div>
          <div className="space-y-4">
            <div>
              <label htmlFor="os" className="block text-sm font-medium text-gray-700">
                Operating system <span className="text-red-500">*</span>
              </label>
              <select
                id="os"
                name="os"
                value={formData.os}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.os ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                {operatingSystems.map((os) => (
                  <option key={os} value={os}>
                    {os}
                  </option>
                ))}
              </select>
              {errors.os && <p className="mt-1 text-sm text-red-500">{errors.os}</p>}
            </div>
            
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                VM size <span className="text-red-500">*</span>
              </label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.size ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                {vmSizes.map((size) => (
                  <option key={size.name} value={size.name}>
                    {size.name} ({size.vcpus} vCPUs, {size.memory} GB RAM)
                  </option>
                ))}
              </select>
              {errors.size && <p className="mt-1 text-sm text-red-500">{errors.size}</p>}
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Administrator username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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
      </div>
    </div>
  );

  const renderDisks = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4 flex">
        <div className="mr-3 text-blue-500">
          <Info size={20} />
        </div>
        <div className="text-sm text-blue-800">
          <p className="font-medium">VM disk encryption</p>
          <p className="mt-1">
            Azure disk storage encryption automatically encrypts your data stored on Azure managed disks (OS and data disks) at rest by default when persisting it to the cloud.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="diskType" className="block text-sm font-medium text-gray-700">
            OS disk type <span className="text-red-500">*</span>
          </label>
          <select
            id="diskType"
            name="diskType"
            value={formData.diskType}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.diskType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="Premium SSD">Premium SSD (locally-redundant storage)</option>
            <option value="Standard SSD">Standard SSD (locally-redundant storage)</option>
            <option value="Standard HDD">Standard HDD (locally-redundant storage)</option>
          </select>
          {errors.diskType && <p className="mt-1 text-sm text-red-500">{errors.diskType}</p>}
        </div>
        
        <div>
          <label htmlFor="diskSize" className="block text-sm font-medium text-gray-700">
            Disk size (GB) <span className="text-red-500">*</span>
          </label>
          <select
            id="diskSize"
            name="diskSize"
            value={formData.diskSize}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.diskSize ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="64">64 GB</option>
            <option value="128">128 GB</option>
            <option value="256">256 GB</option>
            <option value="512">512 GB</option>
            <option value="1024">1024 GB (1 TB)</option>
          </select>
          {errors.diskSize && <p className="mt-1 text-sm text-red-500">{errors.diskSize}</p>}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="deleteWithVM"
              name="deleteWithVM"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked
              readOnly
            />
            <label htmlFor="deleteWithVM" className="ml-2 block text-sm text-gray-700">
              Delete disk with VM
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Data disks</h3>
        <p className="text-sm text-gray-600">You can attach additional data disks after creating this virtual machine.</p>
        
        <button className="mt-4 inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          + Add data disk
        </button>
      </div>
    </div>
  );

  const renderNetworking = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Virtual network/subnet
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            defaultValue="default"
          >
            <option value="default">(new) vnet-{formData.name}/default</option>
            <option>Existing virtual networks</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Public IP
          </label>
          <div className="mt-2">
            <div className="flex items-center">
              <input
                id="enablePublicIP"
                name="enablePublicIP"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.enablePublicIP}
                onChange={(e) => setFormData({
                  ...formData,
                  enablePublicIP: e.target.checked
                })}
              />
              <label htmlFor="enablePublicIP" className="ml-2 block text-sm text-gray-700">
                Create new public IP address
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            NIC network security group
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            defaultValue="basic"
          >
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
            <option value="none">None</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Public inbound ports
          </label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="portsNone"
                name="ports"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="portsNone" className="ml-2 block text-sm text-gray-700">
                None
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="portsSelected"
                name="ports"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                defaultChecked
              />
              <label htmlFor="portsSelected" className="ml-2 block text-sm text-gray-700">
                Allow selected ports
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select inbound ports
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            defaultValue="ssh"
          >
            <option value="ssh">SSH (22)</option>
            <option value="http">HTTP (80)</option>
            <option value="https">HTTPS (443)</option>
            <option value="rdp">RDP (3389)</option>
          </select>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex">
        <div className="mr-3 text-yellow-500">
          <AlertCircle size={20} />
        </div>
        <div className="text-sm text-yellow-800">
          <p className="font-medium">Security notice</p>
          <p className="mt-1">
            This will allow all IP addresses to access your virtual machine. It is recommended to use the Advanced network security group controls to limit inbound traffic to known IP addresses.
          </p>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">VM Configuration Summary</h3>
        </div>
        <div className="p-4 divide-y divide-gray-200">
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">BASICS</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">VM Name</div>
                <div className="text-sm">{formData.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Resource Group</div>
                <div className="text-sm">{formData.resourceGroup}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Region</div>
                <div className="text-sm">{formData.region}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Operating System</div>
                <div className="text-sm">{formData.os}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Size</div>
                <div className="text-sm">{formData.size}</div>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">DISKS</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">OS Disk Type</div>
                <div className="text-sm">{formData.diskType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">OS Disk Size</div>
                <div className="text-sm">{formData.diskSize} GB</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Data Disks</div>
                <div className="text-sm">None</div>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">NETWORKING</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Virtual Network</div>
                <div className="text-sm">vnet-{formData.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Subnet</div>
                <div className="text-sm">default</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Public IP</div>
                <div className="text-sm">{formData.enablePublicIP ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Inbound Ports</div>
                <div className="text-sm">SSH (22)</div>
              </div>
            </div>
          </div>
          
          <div className="py-3">
            <h4 className="text-sm font-medium text-gray-500">MANAGEMENT</h4>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div className="text-xs text-gray-500">Administrator Username</div>
                <div className="text-sm">{formData.username}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Authentication Type</div>
                <div className="text-sm">Password</div>
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasics();
      case 2:
        return renderDisks();
      case 3:
        return renderNetworking();
      case 4:
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium">Management Options</h3>
            <p className="text-gray-600">Configure monitoring, backup, and identity options</p>
          </div>
        );
      case 5:
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium">Advanced Options</h3>
            <p className="text-gray-600">Configure extensions, custom data and VM agent settings</p>
          </div>
        );
      case 6:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center">
          <Server size={24} className="text-blue-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Create a virtual machine</h1>
        </div>
        <p className="mt-1 text-gray-600">Configure the settings for your new virtual machine</p>
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
                  Create VM
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
                  <span className="text-sm text-gray-600">Virtual Machine</span>
                  <span className="text-sm font-medium">${costs.vm.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm font-medium">${costs.disk.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Networking</span>
                  <span className="text-sm font-medium">${costs.networking.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Management</span>
                  <span className="text-sm font-medium">${costs.management.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Costs indicated here are estimates only. Pricing may vary depending on your Microsoft agreement, date of purchase, subscription type, usage costs, and currency exchange rates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVM;