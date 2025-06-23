import React, { createContext, useState, useContext, ReactNode } from 'react';

export type BillingPeriod = 'Current' | 'Previous' | 'Last 3 Months' | 'Last 6 Months' | 'Last Year';
export type CostBreakdownType = 'Service' | 'Resource Group' | 'Location' | 'Tag';
export type BudgetStatus = 'Under Budget' | 'Near Limit' | 'Over Budget';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';
export type PaymentStatus = 'Successful' | 'Failed' | 'Pending' | 'Refunded';

export type CostData = {
  date: string;
  amount: number;
  service?: string;
  resourceGroup?: string;
  location?: string;
};

export type ServiceCost = {
  service: string;
  currentCost: number;
  previousCost: number;
  trend: number; // percentage change
  usage: string;
  category: 'Compute' | 'Storage' | 'Networking' | 'Database' | 'Security' | 'Other';
};

export type Budget = {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: 'Monthly' | 'Quarterly' | 'Annually';
  status: BudgetStatus;
  alerts: {
    threshold: number;
    enabled: boolean;
    recipients: string[];
  };
  scope: {
    type: 'Subscription' | 'Resource Group' | 'Service';
    value: string;
  };
  created: string;
  lastUpdated: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  period: {
    start: string;
    end: string;
  };
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  downloadUrl: string;
  items: InvoiceItem[];
};

export type InvoiceItem = {
  service: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  resourceGroup?: string;
};

export type PaymentMethod = {
  id: string;
  type: 'Credit Card' | 'Bank Transfer' | 'PayPal';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  status: 'Active' | 'Expired' | 'Inactive';
};

export type PaymentHistory = {
  id: string;
  date: string;
  amount: number;
  currency: string;
  method: string;
  invoiceId: string;
  status: PaymentStatus;
  transactionId: string;
};

export type CostAlert = {
  id: string;
  name: string;
  type: 'Budget' | 'Anomaly' | 'Forecast';
  threshold: number;
  currentValue: number;
  triggered: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  created: string;
  lastTriggered?: string;
};

export type UsageMetric = {
  service: string;
  metric: string;
  current: number;
  previous: number;
  unit: string;
  trend: number;
  limit?: number;
};

export type CostOptimization = {
  id: string;
  title: string;
  description: string;
  category: 'Right-sizing' | 'Reserved Instances' | 'Storage Optimization' | 'Scheduling' | 'Unused Resources';
  potentialSavings: number;
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  status: 'New' | 'In Progress' | 'Implemented' | 'Dismissed';
  resources: string[];
  recommendation: string;
  created: string;
};

export type BillingMetrics = {
  currentMonthCost: number;
  previousMonthCost: number;
  monthlyTrend: number;
  yearToDateCost: number;
  forecastedCost: number;
  totalBudget: number;
  budgetUtilization: number;
  averageDailyCost: number;
  costPerResource: number;
  topCostService: string;
  topCostAmount: number;
};

interface BillingContextType {
  billingMetrics: BillingMetrics;
  costData: CostData[];
  serviceCosts: ServiceCost[];
  budgets: Budget[];
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  paymentHistory: PaymentHistory[];
  costAlerts: CostAlert[];
  usageMetrics: UsageMetric[];
  costOptimizations: CostOptimization[];
  selectedPeriod: BillingPeriod;
  setSelectedPeriod: (period: BillingPeriod) => void;
  createBudget: (budget: Omit<Budget, 'id' | 'created' | 'lastUpdated'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  updateOptimizationStatus: (id: string, status: CostOptimization['status']) => void;
  downloadInvoice: (invoiceId: string) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const mockBillingMetrics: BillingMetrics = {
  currentMonthCost: 3247.89,
  previousMonthCost: 3421.56,
  monthlyTrend: -5.1,
  yearToDateCost: 38974.68,
  forecastedCost: 3180.45,
  totalBudget: 4000.00,
  budgetUtilization: 81.2,
  averageDailyCost: 108.26,
  costPerResource: 69.11,
  topCostService: 'Virtual Machines',
  topCostAmount: 1456.78
};

const generateCostData = (days: number = 30): CostData[] => {
  const data: CostData[] = [];
  const baseAmount = 100;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 40;
    const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
    const amount = Math.max(50, (baseAmount + variation) * weekendMultiplier);
    
    data.push({
      date: date.toISOString().split('T')[0],
      amount: Math.round(amount * 100) / 100
    });
  }
  
  return data;
};

const mockServiceCosts: ServiceCost[] = [
  {
    service: 'Virtual Machines',
    currentCost: 1456.78,
    previousCost: 1523.45,
    trend: -4.4,
    usage: '47 instances',
    category: 'Compute'
  },
  {
    service: 'Storage Accounts',
    currentCost: 567.23,
    previousCost: 534.12,
    trend: 6.2,
    usage: '2.3 TB',
    category: 'Storage'
  },
  {
    service: 'SQL Databases',
    currentCost: 445.67,
    previousCost: 423.89,
    trend: 5.1,
    usage: '8 databases',
    category: 'Database'
  },
  {
    service: 'Load Balancers',
    currentCost: 234.56,
    previousCost: 245.78,
    trend: -4.6,
    usage: '3 load balancers',
    category: 'Networking'
  },
  {
    service: 'Public IP Addresses',
    currentCost: 156.78,
    previousCost: 167.89,
    trend: -6.6,
    usage: '12 IP addresses',
    category: 'Networking'
  },
  {
    service: 'Security Center',
    currentCost: 123.45,
    previousCost: 98.76,
    trend: 25.0,
    usage: '47 resources',
    category: 'Security'
  },
  {
    service: 'Monitoring',
    currentCost: 89.34,
    previousCost: 76.23,
    trend: 17.2,
    usage: '156 metrics',
    category: 'Other'
  },
  {
    service: 'Backup',
    currentCost: 67.89,
    previousCost: 72.34,
    trend: -6.1,
    usage: '890 GB',
    category: 'Storage'
  }
];

const mockBudgets: Budget[] = [
  {
    id: 'budget-1',
    name: 'Monthly Infrastructure Budget',
    amount: 4000,
    spent: 3247.89,
    period: 'Monthly',
    status: 'Under Budget',
    alerts: {
      threshold: 80,
      enabled: true,
      recipients: ['admin@company.com', 'finance@company.com']
    },
    scope: {
      type: 'Subscription',
      value: 'Enterprise Dev/Test'
    },
    created: '2023-01-01T00:00:00.000Z',
    lastUpdated: '2023-12-01T10:00:00.000Z'
  },
  {
    id: 'budget-2',
    name: 'Production Environment',
    amount: 2500,
    spent: 2456.78,
    period: 'Monthly',
    status: 'Near Limit',
    alerts: {
      threshold: 90,
      enabled: true,
      recipients: ['ops@company.com']
    },
    scope: {
      type: 'Resource Group',
      value: 'production-group'
    },
    created: '2023-06-01T00:00:00.000Z',
    lastUpdated: '2023-11-15T14:30:00.000Z'
  },
  {
    id: 'budget-3',
    name: 'Development & Testing',
    amount: 800,
    spent: 567.23,
    period: 'Monthly',
    status: 'Under Budget',
    alerts: {
      threshold: 75,
      enabled: true,
      recipients: ['dev@company.com']
    },
    scope: {
      type: 'Resource Group',
      value: 'development-group'
    },
    created: '2023-03-15T00:00:00.000Z',
    lastUpdated: '2023-10-20T09:15:00.000Z'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2023-12-001',
    amount: 3247.89,
    tax: 324.79,
    total: 3572.68,
    currency: 'USD',
    period: {
      start: '2023-12-01T00:00:00.000Z',
      end: '2023-12-31T23:59:59.000Z'
    },
    status: 'Pending',
    dueDate: '2024-01-15T00:00:00.000Z',
    downloadUrl: '/invoices/INV-2023-12-001.pdf',
    items: [
      {
        service: 'Virtual Machines',
        description: 'Compute hours for Standard_D2s_v3 instances',
        quantity: 744,
        unitPrice: 1.96,
        amount: 1456.78,
        resourceGroup: 'production-group'
      },
      {
        service: 'Storage Accounts',
        description: 'Blob storage and transactions',
        quantity: 2300,
        unitPrice: 0.25,
        amount: 567.23,
        resourceGroup: 'production-group'
      }
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2023-11-001',
    amount: 3421.56,
    tax: 342.16,
    total: 3763.72,
    currency: 'USD',
    period: {
      start: '2023-11-01T00:00:00.000Z',
      end: '2023-11-30T23:59:59.000Z'
    },
    status: 'Paid',
    dueDate: '2023-12-15T00:00:00.000Z',
    paidDate: '2023-12-10T14:30:00.000Z',
    downloadUrl: '/invoices/INV-2023-11-001.pdf',
    items: []
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2023-10-001',
    amount: 2987.34,
    tax: 298.73,
    total: 3286.07,
    currency: 'USD',
    period: {
      start: '2023-10-01T00:00:00.000Z',
      end: '2023-10-31T23:59:59.000Z'
    },
    status: 'Paid',
    dueDate: '2023-11-15T00:00:00.000Z',
    paidDate: '2023-11-12T09:45:00.000Z',
    downloadUrl: '/invoices/INV-2023-10-001.pdf',
    items: []
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'Credit Card',
    name: 'Corporate Visa',
    lastFour: '4567',
    expiryDate: '12/2025',
    isDefault: true,
    status: 'Active'
  },
  {
    id: 'pm-2',
    type: 'Bank Transfer',
    name: 'Corporate Account',
    isDefault: false,
    status: 'Active'
  },
  {
    id: 'pm-3',
    type: 'Credit Card',
    name: 'Backup Card',
    lastFour: '8901',
    expiryDate: '08/2024',
    isDefault: false,
    status: 'Expired'
  }
];

const mockPaymentHistory: PaymentHistory[] = [
  {
    id: 'pay-1',
    date: '2023-12-10T14:30:00.000Z',
    amount: 3763.72,
    currency: 'USD',
    method: 'Corporate Visa ****4567',
    invoiceId: 'inv-2',
    status: 'Successful',
    transactionId: 'txn_1234567890'
  },
  {
    id: 'pay-2',
    date: '2023-11-12T09:45:00.000Z',
    amount: 3286.07,
    currency: 'USD',
    method: 'Corporate Visa ****4567',
    invoiceId: 'inv-3',
    status: 'Successful',
    transactionId: 'txn_0987654321'
  },
  {
    id: 'pay-3',
    date: '2023-10-15T16:20:00.000Z',
    amount: 2945.83,
    currency: 'USD',
    method: 'Corporate Account',
    invoiceId: 'inv-4',
    status: 'Successful',
    transactionId: 'txn_1122334455'
  }
];

const mockCostAlerts: CostAlert[] = [
  {
    id: 'alert-1',
    name: 'Production Budget Alert',
    type: 'Budget',
    threshold: 2250,
    currentValue: 2456.78,
    triggered: true,
    severity: 'High',
    message: 'Production environment has exceeded 90% of monthly budget',
    created: '2023-12-15T10:30:00.000Z',
    lastTriggered: '2023-12-15T10:30:00.000Z'
  },
  {
    id: 'alert-2',
    name: 'Storage Cost Anomaly',
    type: 'Anomaly',
    threshold: 600,
    currentValue: 567.23,
    triggered: false,
    severity: 'Medium',
    message: 'Storage costs are trending higher than usual',
    created: '2023-12-10T08:15:00.000Z'
  },
  {
    id: 'alert-3',
    name: 'Monthly Forecast Alert',
    type: 'Forecast',
    threshold: 4000,
    currentValue: 3180.45,
    triggered: false,
    severity: 'Low',
    message: 'Forecasted monthly cost is within budget',
    created: '2023-12-01T00:00:00.000Z'
  }
];

const mockUsageMetrics: UsageMetric[] = [
  {
    service: 'Virtual Machines',
    metric: 'Compute Hours',
    current: 1456,
    previous: 1523,
    unit: 'hours',
    trend: -4.4
  },
  {
    service: 'Storage',
    metric: 'Data Stored',
    current: 2.3,
    previous: 2.1,
    unit: 'TB',
    trend: 9.5
  },
  {
    service: 'Networking',
    metric: 'Data Transfer',
    current: 456.7,
    previous: 423.2,
    unit: 'GB',
    trend: 7.9
  },
  {
    service: 'Databases',
    metric: 'DTU Hours',
    current: 2340,
    previous: 2156,
    unit: 'DTU-hours',
    trend: 8.5
  }
];

const mockCostOptimizations: CostOptimization[] = [
  {
    id: 'opt-1',
    title: 'Right-size Virtual Machines',
    description: 'Several VMs are consistently using less than 40% of their allocated resources',
    category: 'Right-sizing',
    potentialSavings: 456.78,
    effort: 'Medium',
    impact: 'High',
    status: 'New',
    resources: ['web-server-prod', 'db-server-dev'],
    recommendation: 'Consider downsizing from Standard_D4s_v3 to Standard_D2s_v3',
    created: '2023-12-10T09:00:00.000Z'
  },
  {
    id: 'opt-2',
    title: 'Purchase Reserved Instances',
    description: 'Long-running VMs could benefit from reserved instance pricing',
    category: 'Reserved Instances',
    potentialSavings: 1234.56,
    effort: 'Low',
    impact: 'High',
    status: 'In Progress',
    resources: ['web-server-prod', 'api-server-prod'],
    recommendation: 'Purchase 1-year reserved instances for production workloads',
    created: '2023-11-15T14:30:00.000Z'
  },
  {
    id: 'opt-3',
    title: 'Optimize Storage Tiers',
    description: 'Move infrequently accessed data to cooler storage tiers',
    category: 'Storage Optimization',
    potentialSavings: 234.56,
    effort: 'Low',
    impact: 'Medium',
    status: 'Implemented',
    resources: ['prodstorageaccount'],
    recommendation: 'Implement lifecycle policies to automatically move old data to cool tier',
    created: '2023-10-20T11:20:00.000Z'
  },
  {
    id: 'opt-4',
    title: 'Schedule Development Resources',
    description: 'Development VMs are running 24/7 but only used during business hours',
    category: 'Scheduling',
    potentialSavings: 345.67,
    effort: 'Medium',
    impact: 'Medium',
    status: 'New',
    resources: ['dev-vm-01', 'dev-vm-02', 'test-vm-staging'],
    recommendation: 'Implement auto-shutdown for development resources outside business hours',
    created: '2023-12-05T16:45:00.000Z'
  }
];

export const BillingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [billingMetrics] = useState<BillingMetrics>(mockBillingMetrics);
  const [costData] = useState<CostData[]>(generateCostData(30));
  const [serviceCosts] = useState<ServiceCost[]>(mockServiceCosts);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [paymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);
  const [costAlerts] = useState<CostAlert[]>(mockCostAlerts);
  const [usageMetrics] = useState<UsageMetric[]>(mockUsageMetrics);
  const [costOptimizations, setCostOptimizations] = useState<CostOptimization[]>(mockCostOptimizations);
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('Current');

  const createBudget = (newBudget: Omit<Budget, 'id' | 'created' | 'lastUpdated'>) => {
    const budget: Budget = {
      ...newBudget,
      id: `budget-${Date.now()}`,
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setBudgets([...budgets, budget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map(budget => 
      budget.id === id 
        ? { ...budget, ...updates, lastUpdated: new Date().toISOString() }
        : budget
    ));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const addPaymentMethod = (newMethod: Omit<PaymentMethod, 'id'>) => {
    const method: PaymentMethod = {
      ...newMethod,
      id: `pm-${Date.now()}`,
    };
    setPaymentMethods([...paymentMethods, method]);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id ? { ...method, ...updates } : method
    ));
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const updateOptimizationStatus = (id: string, status: CostOptimization['status']) => {
    setCostOptimizations(costOptimizations.map(opt => 
      opt.id === id ? { ...opt, status } : opt
    ));
  };

  const downloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      // Simulate download
      console.log(`Downloading invoice: ${invoice.downloadUrl}`);
    }
  };

  return (
    <BillingContext.Provider value={{
      billingMetrics,
      costData,
      serviceCosts,
      budgets,
      invoices,
      paymentMethods,
      paymentHistory,
      costAlerts,
      usageMetrics,
      costOptimizations,
      selectedPeriod,
      setSelectedPeriod,
      createBudget,
      updateBudget,
      deleteBudget,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod,
      updateOptimizationStatus,
      downloadInvoice
    }}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBillingContext = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBillingContext must be used within a BillingProvider');
  }
  return context;
};