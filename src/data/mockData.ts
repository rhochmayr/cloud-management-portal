import { VM, VMSize } from '../context/VMContext';

export const mockVMs: VM[] = [
  {
    id: 'vm-1',
    name: 'web-server-prod',
    status: 'Running',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    os: 'Ubuntu 22.04',
    size: 'Standard_F2s_v2',
    ipAddress: '172.16.254.1',
    disks: 2,
    created: '2023-04-15T10:30:00.000Z',
  },
  {
    id: 'vm-2',
    name: 'db-server-dev',
    status: 'Stopped',
    resourceGroup: 'development-group',
    location: 'East US',
    subscription: 'Enterprise Dev/Test',
    os: 'Windows Server 2022',
    size: 'Standard_D4s_v3',
    ipAddress: '172.16.254.2',
    disks: 3,
    created: '2023-05-20T14:45:00.000Z',
  },
  {
    id: 'vm-3',
    name: 'test-vm-staging',
    status: 'Running',
    resourceGroup: 'staging-group',
    location: 'North Europe',
    subscription: 'Enterprise Dev/Test',
    os: 'CentOS 8',
    size: 'Standard_B2s',
    ipAddress: '172.16.254.3',
    disks: 1,
    created: '2023-06-10T09:15:00.000Z',
  }
];

export const vmSizes: VMSize[] = [
  {
    name: 'Standard_B1s',
    vcpus: 1,
    memory: 1,
    price: 8.76
  },
  {
    name: 'Standard_B2s',
    vcpus: 2,
    memory: 4,
    price: 35.04
  },
  {
    name: 'Standard_F2s_v2',
    vcpus: 2,
    memory: 4,
    price: 70.08
  },
  {
    name: 'Standard_D2s_v3',
    vcpus: 2,
    memory: 8,
    price: 84.10
  },
  {
    name: 'Standard_D4s_v3',
    vcpus: 4,
    memory: 16,
    price: 168.19
  }
];

export const regions = [
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

export const operatingSystems = [
  'Ubuntu Server 22.04 LTS',
  'Windows Server 2022',
  'Debian 11',
  'CentOS 8',
  'Red Hat Enterprise Linux 8',
  'SUSE Linux Enterprise Server 15',
  'Ubuntu Server 20.04 LTS',
  'Windows Server 2019'
];

export const resourceGroups = [
  'production-group',
  'development-group',
  'staging-group',
  'testing-group',
  'shared-services'
];