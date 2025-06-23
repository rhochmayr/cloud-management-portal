import React, { createContext, useState, useContext, ReactNode } from 'react';
import { mockVMs } from '../data/mockData';

export type VMSize = {
  name: string;
  vcpus: number;
  memory: number;
  price: number;
};

export type VMStatus = 'Running' | 'Stopped' | 'Failed' | 'Creating';

export type VM = {
  id: string;
  name: string;
  status: VMStatus;
  resourceGroup: string;
  location: string;
  subscription: string;
  os: string;
  size: string;
  ipAddress: string;
  disks: number;
  created: string;
};

interface VMContextType {
  vms: VM[];
  addVM: (vm: Omit<VM, 'id' | 'created' | 'status'>) => void;
  deleteVM: (id: string) => void;
  updateVMStatus: (id: string, status: VMStatus) => void;
}

const VMContext = createContext<VMContextType | undefined>(undefined);

export const VMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vms, setVMs] = useState<VM[]>(mockVMs);

  const addVM = (newVM: Omit<VM, 'id' | 'created' | 'status'>) => {
    const vm: VM = {
      ...newVM,
      id: `vm-${Date.now()}`,
      created: new Date().toISOString(),
      status: 'Creating',
    };
    
    setVMs([...vms, vm]);
    
    // Simulate VM creation completion after 3 seconds
    setTimeout(() => {
      setVMs(prevVMs => 
        prevVMs.map(v => 
          v.id === vm.id ? { ...v, status: 'Running' } : v
        )
      );
    }, 3000);
  };

  const deleteVM = (id: string) => {
    setVMs(vms.filter(vm => vm.id !== id));
  };

  const updateVMStatus = (id: string, status: VMStatus) => {
    setVMs(vms.map(vm => (vm.id === id ? { ...vm, status } : vm)));
  };

  return (
    <VMContext.Provider value={{ vms, addVM, deleteVM, updateVMStatus }}>
      {children}
    </VMContext.Provider>
  );
};

export const useVMContext = () => {
  const context = useContext(VMContext);
  if (context === undefined) {
    throw new Error('useVMContext must be used within a VMProvider');
  }
  return context;
};