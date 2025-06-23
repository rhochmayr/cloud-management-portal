import React, { createContext, useState, useContext, ReactNode } from 'react';

export type VirtualNetworkStatus = 'Available' | 'Creating' | 'Updating' | 'Deleting' | 'Failed';
export type SubnetStatus = 'Available' | 'Creating' | 'Updating' | 'Deleting';
export type NSGStatus = 'Available' | 'Creating' | 'Updating' | 'Deleting';
export type LoadBalancerStatus = 'Available' | 'Creating' | 'Updating' | 'Deleting' | 'Failed';
export type PublicIPStatus = 'Available' | 'Creating' | 'Updating' | 'Deleting' | 'Associated' | 'Unassociated';

export type VirtualNetwork = {
  id: string;
  name: string;
  status: VirtualNetworkStatus;
  resourceGroup: string;
  location: string;
  subscription: string;
  addressSpace: string[];
  dnsServers: string[];
  subnets: number;
  connectedDevices: number;
  created: string;
  peerings: number;
  ddosProtection: boolean;
};

export type Subnet = {
  id: string;
  name: string;
  status: SubnetStatus;
  virtualNetwork: string;
  addressRange: string;
  availableIPs: number;
  totalIPs: number;
  connectedDevices: number;
  routeTable?: string;
  networkSecurityGroup?: string;
  serviceEndpoints: string[];
  delegation?: string;
};

export type NetworkSecurityGroup = {
  id: string;
  name: string;
  status: NSGStatus;
  resourceGroup: string;
  location: string;
  subscription: string;
  associatedSubnets: number;
  associatedInterfaces: number;
  securityRules: number;
  defaultRules: number;
  created: string;
};

export type SecurityRule = {
  id: string;
  name: string;
  nsgId: string;
  priority: number;
  direction: 'Inbound' | 'Outbound';
  access: 'Allow' | 'Deny';
  protocol: 'TCP' | 'UDP' | 'Any' | 'ICMP';
  sourcePortRange: string;
  destinationPortRange: string;
  sourceAddressPrefix: string;
  destinationAddressPrefix: string;
  description?: string;
};

export type LoadBalancer = {
  id: string;
  name: string;
  status: LoadBalancerStatus;
  resourceGroup: string;
  location: string;
  subscription: string;
  type: 'Public' | 'Internal';
  sku: 'Basic' | 'Standard' | 'Gateway';
  frontendIPs: number;
  backendPools: number;
  loadBalancingRules: number;
  healthProbes: number;
  created: string;
};

export type PublicIP = {
  id: string;
  name: string;
  status: PublicIPStatus;
  resourceGroup: string;
  location: string;
  subscription: string;
  ipAddress?: string;
  version: 'IPv4' | 'IPv6';
  assignment: 'Static' | 'Dynamic';
  sku: 'Basic' | 'Standard';
  tier: 'Regional' | 'Global';
  associatedTo?: string;
  dnsName?: string;
  created: string;
};

export type RouteTable = {
  id: string;
  name: string;
  resourceGroup: string;
  location: string;
  subscription: string;
  routes: number;
  associatedSubnets: number;
  disableBgpRoutePropagation: boolean;
  created: string;
};

interface NetworkingContextType {
  virtualNetworks: VirtualNetwork[];
  subnets: Subnet[];
  networkSecurityGroups: NetworkSecurityGroup[];
  securityRules: SecurityRule[];
  loadBalancers: LoadBalancer[];
  publicIPs: PublicIP[];
  routeTables: RouteTable[];
  addVirtualNetwork: (vnet: Omit<VirtualNetwork, 'id' | 'created' | 'status'>) => void;
  addSubnet: (subnet: Omit<Subnet, 'id' | 'status'>) => void;
  addNetworkSecurityGroup: (nsg: Omit<NetworkSecurityGroup, 'id' | 'created' | 'status'>) => void;
  addLoadBalancer: (lb: Omit<LoadBalancer, 'id' | 'created' | 'status'>) => void;
  addPublicIP: (pip: Omit<PublicIP, 'id' | 'created' | 'status'>) => void;
  deleteVirtualNetwork: (id: string) => void;
  deleteNetworkSecurityGroup: (id: string) => void;
  deleteLoadBalancer: (id: string) => void;
  deletePublicIP: (id: string) => void;
  updateVirtualNetworkStatus: (id: string, status: VirtualNetworkStatus) => void;
  updateNSGStatus: (id: string, status: NSGStatus) => void;
  updateLoadBalancerStatus: (id: string, status: LoadBalancerStatus) => void;
  updatePublicIPStatus: (id: string, status: PublicIPStatus) => void;
}

const NetworkingContext = createContext<NetworkingContextType | undefined>(undefined);

const mockVirtualNetworks: VirtualNetwork[] = [
  {
    id: 'vnet-1',
    name: 'production-vnet',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    addressSpace: ['10.0.0.0/16'],
    dnsServers: ['168.63.129.16'],
    subnets: 3,
    connectedDevices: 12,
    created: '2023-04-15T10:30:00.000Z',
    peerings: 1,
    ddosProtection: true
  },
  {
    id: 'vnet-2',
    name: 'development-vnet',
    status: 'Available',
    resourceGroup: 'development-group',
    location: 'East US',
    subscription: 'Enterprise Dev/Test',
    addressSpace: ['10.1.0.0/16'],
    dnsServers: ['168.63.129.16'],
    subnets: 2,
    connectedDevices: 5,
    created: '2023-05-20T14:45:00.000Z',
    peerings: 0,
    ddosProtection: false
  },
  {
    id: 'vnet-3',
    name: 'hub-vnet',
    status: 'Available',
    resourceGroup: 'shared-services',
    location: 'North Europe',
    subscription: 'Enterprise Dev/Test',
    addressSpace: ['10.100.0.0/16', '10.101.0.0/16'],
    dnsServers: ['10.100.0.4', '10.100.0.5'],
    subnets: 5,
    connectedDevices: 25,
    created: '2023-03-10T09:15:00.000Z',
    peerings: 3,
    ddosProtection: true
  }
];

const mockSubnets: Subnet[] = [
  {
    id: 'subnet-1',
    name: 'default',
    status: 'Available',
    virtualNetwork: 'production-vnet',
    addressRange: '10.0.0.0/24',
    availableIPs: 245,
    totalIPs: 251,
    connectedDevices: 6,
    networkSecurityGroup: 'production-nsg',
    serviceEndpoints: ['Microsoft.Storage', 'Microsoft.Sql']
  },
  {
    id: 'subnet-2',
    name: 'web-tier',
    status: 'Available',
    virtualNetwork: 'production-vnet',
    addressRange: '10.0.1.0/24',
    availableIPs: 248,
    totalIPs: 251,
    connectedDevices: 3,
    networkSecurityGroup: 'web-nsg',
    serviceEndpoints: ['Microsoft.Storage']
  },
  {
    id: 'subnet-3',
    name: 'database-tier',
    status: 'Available',
    virtualNetwork: 'production-vnet',
    addressRange: '10.0.2.0/24',
    availableIPs: 248,
    totalIPs: 251,
    connectedDevices: 3,
    networkSecurityGroup: 'database-nsg',
    serviceEndpoints: ['Microsoft.Sql', 'Microsoft.KeyVault']
  },
  {
    id: 'subnet-4',
    name: 'default',
    status: 'Available',
    virtualNetwork: 'development-vnet',
    addressRange: '10.1.0.0/24',
    availableIPs: 249,
    totalIPs: 251,
    connectedDevices: 2,
    serviceEndpoints: []
  },
  {
    id: 'subnet-5',
    name: 'GatewaySubnet',
    status: 'Available',
    virtualNetwork: 'hub-vnet',
    addressRange: '10.100.0.0/27',
    availableIPs: 26,
    totalIPs: 27,
    connectedDevices: 1,
    serviceEndpoints: []
  }
];

const mockNetworkSecurityGroups: NetworkSecurityGroup[] = [
  {
    id: 'nsg-1',
    name: 'production-nsg',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    associatedSubnets: 1,
    associatedInterfaces: 0,
    securityRules: 5,
    defaultRules: 6,
    created: '2023-04-15T10:30:00.000Z'
  },
  {
    id: 'nsg-2',
    name: 'web-nsg',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    associatedSubnets: 1,
    associatedInterfaces: 0,
    securityRules: 3,
    defaultRules: 6,
    created: '2023-04-15T11:00:00.000Z'
  },
  {
    id: 'nsg-3',
    name: 'database-nsg',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    associatedSubnets: 1,
    associatedInterfaces: 0,
    securityRules: 2,
    defaultRules: 6,
    created: '2023-04-15T11:15:00.000Z'
  }
];

const mockSecurityRules: SecurityRule[] = [
  {
    id: 'rule-1',
    name: 'AllowHTTP',
    nsgId: 'nsg-2',
    priority: 100,
    direction: 'Inbound',
    access: 'Allow',
    protocol: 'TCP',
    sourcePortRange: '*',
    destinationPortRange: '80',
    sourceAddressPrefix: '*',
    destinationAddressPrefix: '*',
    description: 'Allow HTTP traffic'
  },
  {
    id: 'rule-2',
    name: 'AllowHTTPS',
    nsgId: 'nsg-2',
    priority: 110,
    direction: 'Inbound',
    access: 'Allow',
    protocol: 'TCP',
    sourcePortRange: '*',
    destinationPortRange: '443',
    sourceAddressPrefix: '*',
    destinationAddressPrefix: '*',
    description: 'Allow HTTPS traffic'
  },
  {
    id: 'rule-3',
    name: 'AllowSSH',
    nsgId: 'nsg-1',
    priority: 100,
    direction: 'Inbound',
    access: 'Allow',
    protocol: 'TCP',
    sourcePortRange: '*',
    destinationPortRange: '22',
    sourceAddressPrefix: '10.0.0.0/16',
    destinationAddressPrefix: '*',
    description: 'Allow SSH from VNet'
  }
];

const mockLoadBalancers: LoadBalancer[] = [
  {
    id: 'lb-1',
    name: 'production-lb',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    type: 'Public',
    sku: 'Standard',
    frontendIPs: 1,
    backendPools: 1,
    loadBalancingRules: 2,
    healthProbes: 1,
    created: '2023-04-20T10:30:00.000Z'
  },
  {
    id: 'lb-2',
    name: 'internal-lb',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    type: 'Internal',
    sku: 'Standard',
    frontendIPs: 1,
    backendPools: 1,
    loadBalancingRules: 1,
    healthProbes: 1,
    created: '2023-04-25T14:15:00.000Z'
  }
];

const mockPublicIPs: PublicIP[] = [
  {
    id: 'pip-1',
    name: 'production-lb-pip',
    status: 'Associated',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    ipAddress: '20.123.45.67',
    version: 'IPv4',
    assignment: 'Static',
    sku: 'Standard',
    tier: 'Regional',
    associatedTo: 'production-lb',
    dnsName: 'myapp-prod.westeurope.cloudapp.azure.com',
    created: '2023-04-20T10:30:00.000Z'
  },
  {
    id: 'pip-2',
    name: 'web-server-pip',
    status: 'Associated',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    ipAddress: '20.123.45.68',
    version: 'IPv4',
    assignment: 'Static',
    sku: 'Standard',
    tier: 'Regional',
    associatedTo: 'web-server-prod',
    created: '2023-04-15T10:30:00.000Z'
  },
  {
    id: 'pip-3',
    name: 'unassigned-pip',
    status: 'Unassociated',
    resourceGroup: 'development-group',
    location: 'East US',
    subscription: 'Enterprise Dev/Test',
    version: 'IPv4',
    assignment: 'Dynamic',
    sku: 'Basic',
    tier: 'Regional',
    created: '2023-06-01T16:20:00.000Z'
  }
];

const mockRouteTables: RouteTable[] = [
  {
    id: 'rt-1',
    name: 'production-routes',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    routes: 3,
    associatedSubnets: 2,
    disableBgpRoutePropagation: false,
    created: '2023-04-15T10:30:00.000Z'
  },
  {
    id: 'rt-2',
    name: 'hub-routes',
    resourceGroup: 'shared-services',
    location: 'North Europe',
    subscription: 'Enterprise Dev/Test',
    routes: 5,
    associatedSubnets: 3,
    disableBgpRoutePropagation: true,
    created: '2023-03-10T09:15:00.000Z'
  }
];

export const NetworkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [virtualNetworks, setVirtualNetworks] = useState<VirtualNetwork[]>(mockVirtualNetworks);
  const [subnets, setSubnets] = useState<Subnet[]>(mockSubnets);
  const [networkSecurityGroups, setNetworkSecurityGroups] = useState<NetworkSecurityGroup[]>(mockNetworkSecurityGroups);
  const [securityRules, setSecurityRules] = useState<SecurityRule[]>(mockSecurityRules);
  const [loadBalancers, setLoadBalancers] = useState<LoadBalancer[]>(mockLoadBalancers);
  const [publicIPs, setPublicIPs] = useState<PublicIP[]>(mockPublicIPs);
  const [routeTables, setRouteTables] = useState<RouteTable[]>(mockRouteTables);

  const addVirtualNetwork = (newVNet: Omit<VirtualNetwork, 'id' | 'created' | 'status'>) => {
    const vnet: VirtualNetwork = {
      ...newVNet,
      id: `vnet-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
    };
    
    setVirtualNetworks([...virtualNetworks, vnet]);
    
    // Simulate creation completion after 5 seconds
    setTimeout(() => {
      setVirtualNetworks(prevVNets => 
        prevVNets.map(v => 
          v.id === vnet.id ? { ...v, status: 'Available' } : v
        )
      );
    }, 5000);
  };

  const addSubnet = (newSubnet: Omit<Subnet, 'id' | 'status'>) => {
    const subnet: Subnet = {
      ...newSubnet,
      id: `subnet-${Date.now()}`,
      status: 'Creating',
    };
    
    setSubnets([...subnets, subnet]);
    
    // Simulate creation completion after 3 seconds
    setTimeout(() => {
      setSubnets(prevSubnets => 
        prevSubnets.map(s => 
          s.id === subnet.id ? { ...s, status: 'Available' } : s
        )
      );
    }, 3000);
  };

  const addNetworkSecurityGroup = (newNSG: Omit<NetworkSecurityGroup, 'id' | 'created' | 'status'>) => {
    const nsg: NetworkSecurityGroup = {
      ...newNSG,
      id: `nsg-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
    };
    
    setNetworkSecurityGroups([...networkSecurityGroups, nsg]);
    
    // Simulate creation completion after 3 seconds
    setTimeout(() => {
      setNetworkSecurityGroups(prevNSGs => 
        prevNSGs.map(n => 
          n.id === nsg.id ? { ...n, status: 'Available' } : n
        )
      );
    }, 3000);
  };

  const addLoadBalancer = (newLB: Omit<LoadBalancer, 'id' | 'created' | 'status'>) => {
    const lb: LoadBalancer = {
      ...newLB,
      id: `lb-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
    };
    
    setLoadBalancers([...loadBalancers, lb]);
    
    // Simulate creation completion after 4 seconds
    setTimeout(() => {
      setLoadBalancers(prevLBs => 
        prevLBs.map(l => 
          l.id === lb.id ? { ...l, status: 'Available' } : l
        )
      );
    }, 4000);
  };

  const addPublicIP = (newPIP: Omit<PublicIP, 'id' | 'created' | 'status'>) => {
    const pip: PublicIP = {
      ...newPIP,
      id: `pip-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
    };
    
    setPublicIPs([...publicIPs, pip]);
    
    // Simulate creation completion after 2 seconds
    setTimeout(() => {
      setPublicIPs(prevPIPs => 
        prevPIPs.map(p => 
          p.id === pip.id ? { ...p, status: 'Unassociated', ipAddress: generateRandomIP() } : p
        )
      );
    }, 2000);
  };

  const deleteVirtualNetwork = (id: string) => {
    setVirtualNetworks(virtualNetworks.filter(vnet => vnet.id !== id));
  };

  const deleteNetworkSecurityGroup = (id: string) => {
    setNetworkSecurityGroups(networkSecurityGroups.filter(nsg => nsg.id !== id));
  };

  const deleteLoadBalancer = (id: string) => {
    setLoadBalancers(loadBalancers.filter(lb => lb.id !== id));
  };

  const deletePublicIP = (id: string) => {
    setPublicIPs(publicIPs.filter(pip => pip.id !== id));
  };

  const updateVirtualNetworkStatus = (id: string, status: VirtualNetworkStatus) => {
    setVirtualNetworks(virtualNetworks.map(vnet => (vnet.id === id ? { ...vnet, status } : vnet)));
  };

  const updateNSGStatus = (id: string, status: NSGStatus) => {
    setNetworkSecurityGroups(networkSecurityGroups.map(nsg => (nsg.id === id ? { ...nsg, status } : nsg)));
  };

  const updateLoadBalancerStatus = (id: string, status: LoadBalancerStatus) => {
    setLoadBalancers(loadBalancers.map(lb => (lb.id === id ? { ...lb, status } : lb)));
  };

  const updatePublicIPStatus = (id: string, status: PublicIPStatus) => {
    setPublicIPs(publicIPs.map(pip => (pip.id === id ? { ...pip, status } : pip)));
  };

  return (
    <NetworkingContext.Provider value={{ 
      virtualNetworks,
      subnets,
      networkSecurityGroups,
      securityRules,
      loadBalancers,
      publicIPs,
      routeTables,
      addVirtualNetwork,
      addSubnet,
      addNetworkSecurityGroup,
      addLoadBalancer,
      addPublicIP,
      deleteVirtualNetwork,
      deleteNetworkSecurityGroup,
      deleteLoadBalancer,
      deletePublicIP,
      updateVirtualNetworkStatus,
      updateNSGStatus,
      updateLoadBalancerStatus,
      updatePublicIPStatus
    }}>
      {children}
    </NetworkingContext.Provider>
  );
};

const generateRandomIP = (): string => {
  const octet1 = Math.floor(Math.random() * 223) + 1; // 1-223 (avoid 0, 224-255)
  const octet2 = Math.floor(Math.random() * 256);
  const octet3 = Math.floor(Math.random() * 256);
  const octet4 = Math.floor(Math.random() * 254) + 1; // 1-254 (avoid 0, 255)
  return `${octet1}.${octet2}.${octet3}.${octet4}`;
};

export const useNetworkingContext = () => {
  const context = useContext(NetworkingContext);
  if (context === undefined) {
    throw new Error('useNetworkingContext must be used within a NetworkingProvider');
  }
  return context;
};