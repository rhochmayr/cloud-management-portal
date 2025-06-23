import React, { createContext, useState, useContext, ReactNode } from 'react';

export type StorageAccountType = 'Standard_LRS' | 'Standard_GRS' | 'Standard_RAGRS' | 'Premium_LRS' | 'Premium_ZRS';
export type StorageAccountStatus = 'Available' | 'Creating' | 'Updating' | 'Deleting' | 'Failed';
export type DiskType = 'Premium SSD' | 'Standard SSD' | 'Standard HDD' | 'Ultra SSD';
export type DiskStatus = 'Attached' | 'Unattached' | 'Reserved' | 'Creating' | 'Deleting';

export type StorageAccount = {
  id: string;
  name: string;
  status: StorageAccountStatus;
  resourceGroup: string;
  location: string;
  subscription: string;
  accountType: StorageAccountType;
  performance: 'Standard' | 'Premium';
  replication: string;
  accessTier: 'Hot' | 'Cool' | 'Archive';
  created: string;
  endpoint: string;
  usedCapacity: number; // in GB
  totalCapacity: number; // in GB
  containers: number;
  fileShares: number;
};

export type Disk = {
  id: string;
  name: string;
  status: DiskStatus;
  resourceGroup: string;
  location: string;
  subscription: string;
  type: DiskType;
  size: number; // in GB
  attachedTo?: string; // VM name if attached
  created: string;
  iops: number;
  throughput: number; // MB/s
  encryption: 'Platform-managed' | 'Customer-managed';
};

export type FileShare = {
  id: string;
  name: string;
  storageAccount: string;
  quota: number; // in GB
  usedCapacity: number; // in GB
  protocol: 'SMB' | 'NFS';
  tier: 'Transaction optimized' | 'Hot' | 'Cool' | 'Premium';
  created: string;
  lastModified: string;
};

export type BlobContainer = {
  id: string;
  name: string;
  storageAccount: string;
  accessLevel: 'Private' | 'Blob' | 'Container';
  blobCount: number;
  usedCapacity: number; // in GB
  created: string;
  lastModified: string;
};

interface StorageContextType {
  storageAccounts: StorageAccount[];
  disks: Disk[];
  fileShares: FileShare[];
  blobContainers: BlobContainer[];
  addStorageAccount: (account: Omit<StorageAccount, 'id' | 'created' | 'status' | 'endpoint'>) => void;
  addDisk: (disk: Omit<Disk, 'id' | 'created' | 'status'>) => void;
  deleteStorageAccount: (id: string) => void;
  deleteDisk: (id: string) => void;
  updateStorageAccountStatus: (id: string, status: StorageAccountStatus) => void;
  updateDiskStatus: (id: string, status: DiskStatus) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const mockStorageAccounts: StorageAccount[] = [
  {
    id: 'sa-1',
    name: 'prodstorageaccount',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    accountType: 'Standard_LRS',
    performance: 'Standard',
    replication: 'Locally-redundant storage (LRS)',
    accessTier: 'Hot',
    created: '2023-04-15T10:30:00.000Z',
    endpoint: 'https://prodstorageaccount.blob.core.windows.net/',
    usedCapacity: 245,
    totalCapacity: 500,
    containers: 8,
    fileShares: 3
  },
  {
    id: 'sa-2',
    name: 'devstorageaccount',
    status: 'Available',
    resourceGroup: 'development-group',
    location: 'East US',
    subscription: 'Enterprise Dev/Test',
    accountType: 'Standard_GRS',
    performance: 'Standard',
    replication: 'Geo-redundant storage (GRS)',
    accessTier: 'Cool',
    created: '2023-05-20T14:45:00.000Z',
    endpoint: 'https://devstorageaccount.blob.core.windows.net/',
    usedCapacity: 89,
    totalCapacity: 200,
    containers: 4,
    fileShares: 1
  },
  {
    id: 'sa-3',
    name: 'premiumstorageaccount',
    status: 'Available',
    resourceGroup: 'production-group',
    location: 'North Europe',
    subscription: 'Enterprise Dev/Test',
    accountType: 'Premium_LRS',
    performance: 'Premium',
    replication: 'Locally-redundant storage (LRS)',
    accessTier: 'Hot',
    created: '2023-06-10T09:15:00.000Z',
    endpoint: 'https://premiumstorageaccount.blob.core.windows.net/',
    usedCapacity: 156,
    totalCapacity: 1000,
    containers: 12,
    fileShares: 5
  }
];

const mockDisks: Disk[] = [
  {
    id: 'disk-1',
    name: 'web-server-prod_OsDisk',
    status: 'Attached',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    type: 'Premium SSD',
    size: 128,
    attachedTo: 'web-server-prod',
    created: '2023-04-15T10:30:00.000Z',
    iops: 500,
    throughput: 100,
    encryption: 'Platform-managed'
  },
  {
    id: 'disk-2',
    name: 'web-server-prod_DataDisk_0',
    status: 'Attached',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    type: 'Premium SSD',
    size: 256,
    attachedTo: 'web-server-prod',
    created: '2023-04-15T10:35:00.000Z',
    iops: 1100,
    throughput: 125,
    encryption: 'Platform-managed'
  },
  {
    id: 'disk-3',
    name: 'backup-disk-001',
    status: 'Unattached',
    resourceGroup: 'production-group',
    location: 'West Europe',
    subscription: 'Enterprise Dev/Test',
    type: 'Standard SSD',
    size: 512,
    created: '2023-06-01T16:20:00.000Z',
    iops: 500,
    throughput: 60,
    encryption: 'Customer-managed'
  },
  {
    id: 'disk-4',
    name: 'db-server-dev_OsDisk',
    status: 'Attached',
    resourceGroup: 'development-group',
    location: 'East US',
    subscription: 'Enterprise Dev/Test',
    type: 'Standard SSD',
    size: 128,
    attachedTo: 'db-server-dev',
    created: '2023-05-20T14:45:00.000Z',
    iops: 500,
    throughput: 60,
    encryption: 'Platform-managed'
  }
];

const mockFileShares: FileShare[] = [
  {
    id: 'fs-1',
    name: 'shared-documents',
    storageAccount: 'prodstorageaccount',
    quota: 100,
    usedCapacity: 45,
    protocol: 'SMB',
    tier: 'Transaction optimized',
    created: '2023-04-20T10:30:00.000Z',
    lastModified: '2023-12-15T14:22:00.000Z'
  },
  {
    id: 'fs-2',
    name: 'application-logs',
    storageAccount: 'prodstorageaccount',
    quota: 50,
    usedCapacity: 23,
    protocol: 'SMB',
    tier: 'Hot',
    created: '2023-05-01T09:15:00.000Z',
    lastModified: '2023-12-15T16:45:00.000Z'
  },
  {
    id: 'fs-3',
    name: 'backup-files',
    storageAccount: 'premiumstorageaccount',
    quota: 200,
    usedCapacity: 156,
    protocol: 'NFS',
    tier: 'Premium',
    created: '2023-06-15T11:30:00.000Z',
    lastModified: '2023-12-15T02:00:00.000Z'
  }
];

const mockBlobContainers: BlobContainer[] = [
  {
    id: 'bc-1',
    name: 'website-assets',
    storageAccount: 'prodstorageaccount',
    accessLevel: 'Blob',
    blobCount: 1247,
    usedCapacity: 89,
    created: '2023-04-15T10:30:00.000Z',
    lastModified: '2023-12-15T18:30:00.000Z'
  },
  {
    id: 'bc-2',
    name: 'application-data',
    storageAccount: 'prodstorageaccount',
    accessLevel: 'Private',
    blobCount: 567,
    usedCapacity: 134,
    created: '2023-04-20T14:15:00.000Z',
    lastModified: '2023-12-15T12:15:00.000Z'
  },
  {
    id: 'bc-3',
    name: 'backup-container',
    storageAccount: 'premiumstorageaccount',
    accessLevel: 'Private',
    blobCount: 89,
    usedCapacity: 245,
    created: '2023-06-10T09:15:00.000Z',
    lastModified: '2023-12-15T03:00:00.000Z'
  }
];

export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storageAccounts, setStorageAccounts] = useState<StorageAccount[]>(mockStorageAccounts);
  const [disks, setDisks] = useState<Disk[]>(mockDisks);
  const [fileShares, setFileShares] = useState<FileShare[]>(mockFileShares);
  const [blobContainers, setBlobContainers] = useState<BlobContainer[]>(mockBlobContainers);

  const addStorageAccount = (newAccount: Omit<StorageAccount, 'id' | 'created' | 'status' | 'endpoint'>) => {
    const account: StorageAccount = {
      ...newAccount,
      id: `sa-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
      endpoint: `https://${newAccount.name}.blob.core.windows.net/`,
    };
    
    setStorageAccounts([...storageAccounts, account]);
    
    // Simulate account creation completion after 5 seconds
    setTimeout(() => {
      setStorageAccounts(prevAccounts => 
        prevAccounts.map(acc => 
          acc.id === account.id ? { ...acc, status: 'Available' } : acc
        )
      );
    }, 5000);
  };

  const addDisk = (newDisk: Omit<Disk, 'id' | 'created' | 'status'>) => {
    const disk: Disk = {
      ...newDisk,
      id: `disk-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
    };
    
    setDisks([...disks, disk]);
    
    // Simulate disk creation completion after 3 seconds
    setTimeout(() => {
      setDisks(prevDisks => 
        prevDisks.map(d => 
          d.id === disk.id ? { ...d, status: 'Unattached' } : d
        )
      );
    }, 3000);
  };

  const deleteStorageAccount = (id: string) => {
    setStorageAccounts(storageAccounts.filter(account => account.id !== id));
  };

  const deleteDisk = (id: string) => {
    setDisks(disks.filter(disk => disk.id !== id));
  };

  const updateStorageAccountStatus = (id: string, status: StorageAccountStatus) => {
    setStorageAccounts(storageAccounts.map(account => (account.id === id ? { ...account, status } : account)));
  };

  const updateDiskStatus = (id: string, status: DiskStatus) => {
    setDisks(disks.map(disk => (disk.id === id ? { ...disk, status } : disk)));
  };

  return (
    <StorageContext.Provider value={{ 
      storageAccounts, 
      disks, 
      fileShares, 
      blobContainers, 
      addStorageAccount, 
      addDisk, 
      deleteStorageAccount, 
      deleteDisk, 
      updateStorageAccountStatus, 
      updateDiskStatus 
    }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorageContext must be used within a StorageProvider');
  }
  return context;
};