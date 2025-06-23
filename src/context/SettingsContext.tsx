import React, { createContext, useState, useContext, ReactNode } from 'react';

export type NotificationChannel = 'Email' | 'SMS' | 'Slack' | 'Teams' | 'Webhook';
export type NotificationSeverity = 'All' | 'Critical' | 'High' | 'Medium';
export type ThemeMode = 'Light' | 'Dark' | 'Auto';
export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Japanese' | 'Chinese';
export type TimeZone = 'UTC' | 'EST' | 'PST' | 'GMT' | 'CET' | 'JST' | 'CST';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  company: string;
  avatar?: string;
  bio: string;
  location: string;
  timeZone: TimeZone;
  language: Language;
  dateFormat: DateFormat;
  currency: Currency;
  lastLogin: string;
  created: string;
};

export type NotificationPreference = {
  id: string;
  type: string;
  channels: NotificationChannel[];
  severity: NotificationSeverity;
  enabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'Immediate' | 'Hourly' | 'Daily' | 'Weekly';
};

export type SecuritySetting = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'Authentication' | 'Authorization' | 'Audit' | 'Encryption' | 'Network';
  level: 'Basic' | 'Standard' | 'Advanced';
  lastModified: string;
};

export type IntegrationConfig = {
  id: string;
  name: string;
  type: 'Monitoring' | 'ITSM' | 'CI/CD' | 'Communication' | 'Storage' | 'Analytics';
  status: 'Connected' | 'Disconnected' | 'Error' | 'Configuring';
  description: string;
  endpoint?: string;
  lastSync?: string;
  settings: Record<string, any>;
  enabled: boolean;
};

export type BillingSettings = {
  billingContact: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: {
    type: 'Credit Card' | 'Bank Transfer' | 'Invoice';
    lastFour?: string;
    expiryDate?: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  invoiceSettings: {
    frequency: 'Monthly' | 'Quarterly' | 'Annually';
    format: 'PDF' | 'CSV' | 'JSON';
    autoSend: boolean;
    recipients: string[];
  };
  budgetAlerts: {
    enabled: boolean;
    threshold: number;
    recipients: string[];
  };
  costCenter: string;
  purchaseOrder: string;
};

export type APIKey = {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed?: string;
  expiresAt?: string;
  status: 'Active' | 'Inactive' | 'Expired';
};

export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'Success' | 'Failed' | 'Warning';
};

export type BackupConfig = {
  enabled: boolean;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  retention: number; // days
  location: string;
  encryption: boolean;
  lastBackup?: string;
  nextBackup?: string;
  autoRestore: boolean;
};

interface SettingsContextType {
  userProfile: UserProfile;
  notificationPreferences: NotificationPreference[];
  securitySettings: SecuritySetting[];
  integrations: IntegrationConfig[];
  billingSettings: BillingSettings;
  apiKeys: APIKey[];
  auditLogs: AuditLog[];
  backupConfig: BackupConfig;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateNotificationPreference: (id: string, updates: Partial<NotificationPreference>) => void;
  updateSecuritySetting: (id: string, enabled: boolean) => void;
  updateIntegration: (id: string, updates: Partial<IntegrationConfig>) => void;
  updateBillingSettings: (updates: Partial<BillingSettings>) => void;
  createAPIKey: (name: string, permissions: string[]) => void;
  deleteAPIKey: (id: string) => void;
  updateBackupConfig: (updates: Partial<BackupConfig>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const mockUserProfile: UserProfile = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'admin@company.com',
  phone: '+1 (555) 123-4567',
  jobTitle: 'Cloud Infrastructure Manager',
  department: 'IT Operations',
  company: 'Acme Corporation',
  bio: 'Experienced cloud infrastructure professional with 10+ years in enterprise environments.',
  location: 'San Francisco, CA',
  timeZone: 'PST',
  language: 'English',
  dateFormat: 'MM/DD/YYYY',
  currency: 'USD',
  lastLogin: '2023-12-15T16:30:00.000Z',
  created: '2023-01-15T10:00:00.000Z'
};

const mockNotificationPreferences: NotificationPreference[] = [
  {
    id: 'notif-1',
    type: 'Critical Alerts',
    channels: ['Email', 'SMS', 'Slack'],
    severity: 'Critical',
    enabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'Immediate'
  },
  {
    id: 'notif-2',
    type: 'Performance Alerts',
    channels: ['Email', 'Slack'],
    severity: 'High',
    enabled: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'Hourly'
  },
  {
    id: 'notif-3',
    type: 'Security Alerts',
    channels: ['Email', 'Teams'],
    severity: 'All',
    enabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'Immediate'
  },
  {
    id: 'notif-4',
    type: 'Cost Alerts',
    channels: ['Email'],
    severity: 'Medium',
    enabled: true,
    quietHours: {
      enabled: true,
      start: '18:00',
      end: '09:00'
    },
    frequency: 'Daily'
  },
  {
    id: 'notif-5',
    type: 'Maintenance Notifications',
    channels: ['Email', 'Slack'],
    severity: 'All',
    enabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'Immediate'
  }
];

const mockSecuritySettings: SecuritySetting[] = [
  {
    id: 'sec-1',
    name: 'Multi-Factor Authentication',
    description: 'Require MFA for all user logins',
    enabled: true,
    category: 'Authentication',
    level: 'Standard',
    lastModified: '2023-12-01T10:00:00.000Z'
  },
  {
    id: 'sec-2',
    name: 'Session Timeout',
    description: 'Automatically log out users after 30 minutes of inactivity',
    enabled: true,
    category: 'Authentication',
    level: 'Basic',
    lastModified: '2023-11-15T14:30:00.000Z'
  },
  {
    id: 'sec-3',
    name: 'IP Whitelisting',
    description: 'Restrict access to specific IP addresses',
    enabled: false,
    category: 'Network',
    level: 'Advanced',
    lastModified: '2023-10-20T09:15:00.000Z'
  },
  {
    id: 'sec-4',
    name: 'Audit Logging',
    description: 'Log all user actions and system events',
    enabled: true,
    category: 'Audit',
    level: 'Standard',
    lastModified: '2023-12-10T16:45:00.000Z'
  },
  {
    id: 'sec-5',
    name: 'Data Encryption at Rest',
    description: 'Encrypt all stored data using AES-256',
    enabled: true,
    category: 'Encryption',
    level: 'Standard',
    lastModified: '2023-09-05T11:20:00.000Z'
  },
  {
    id: 'sec-6',
    name: 'Role-Based Access Control',
    description: 'Enforce granular permissions based on user roles',
    enabled: true,
    category: 'Authorization',
    level: 'Advanced',
    lastModified: '2023-11-28T13:10:00.000Z'
  }
];

const mockIntegrations: IntegrationConfig[] = [
  {
    id: 'int-1',
    name: 'Slack Notifications',
    type: 'Communication',
    status: 'Connected',
    description: 'Send alerts and notifications to Slack channels',
    endpoint: 'https://hooks.slack.com/services/...',
    lastSync: '2023-12-15T16:30:00.000Z',
    settings: {
      channel: '#infrastructure-alerts',
      username: 'VM Manager Bot',
      iconEmoji: ':warning:'
    },
    enabled: true
  },
  {
    id: 'int-2',
    name: 'Microsoft Teams',
    type: 'Communication',
    status: 'Connected',
    description: 'Send notifications to Microsoft Teams channels',
    endpoint: 'https://outlook.office.com/webhook/...',
    lastSync: '2023-12-15T15:45:00.000Z',
    settings: {
      channel: 'Infrastructure Team',
      cardFormat: 'adaptive'
    },
    enabled: true
  },
  {
    id: 'int-3',
    name: 'Datadog Monitoring',
    type: 'Monitoring',
    status: 'Disconnected',
    description: 'Export metrics and logs to Datadog',
    settings: {
      apiKey: '***',
      region: 'us1'
    },
    enabled: false
  },
  {
    id: 'int-4',
    name: 'ServiceNow ITSM',
    type: 'ITSM',
    status: 'Error',
    description: 'Create incidents and change requests in ServiceNow',
    endpoint: 'https://company.service-now.com/api/...',
    settings: {
      instance: 'company',
      username: 'integration_user',
      assignmentGroup: 'Infrastructure Team'
    },
    enabled: true
  },
  {
    id: 'int-5',
    name: 'Jenkins CI/CD',
    type: 'CI/CD',
    status: 'Connected',
    description: 'Trigger deployments and automation workflows',
    endpoint: 'https://jenkins.company.com/api/...',
    lastSync: '2023-12-15T14:20:00.000Z',
    settings: {
      token: '***',
      defaultBranch: 'main'
    },
    enabled: true
  },
  {
    id: 'int-6',
    name: 'Splunk Analytics',
    type: 'Analytics',
    status: 'Configuring',
    description: 'Send logs and metrics to Splunk for analysis',
    endpoint: 'https://splunk.company.com:8088/...',
    settings: {
      token: '***',
      index: 'infrastructure'
    },
    enabled: false
  }
];

const mockBillingSettings: BillingSettings = {
  billingContact: {
    name: 'Jane Smith',
    email: 'billing@company.com',
    phone: '+1 (555) 987-6543'
  },
  paymentMethod: {
    type: 'Credit Card',
    lastFour: '4567',
    expiryDate: '12/2025'
  },
  billingAddress: {
    street: '123 Business Ave',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States'
  },
  invoiceSettings: {
    frequency: 'Monthly',
    format: 'PDF',
    autoSend: true,
    recipients: ['billing@company.com', 'finance@company.com']
  },
  budgetAlerts: {
    enabled: true,
    threshold: 5000,
    recipients: ['admin@company.com', 'billing@company.com']
  },
  costCenter: 'IT-INFRA-001',
  purchaseOrder: 'PO-2023-12345'
};

const mockAPIKeys: APIKey[] = [
  {
    id: 'api-1',
    name: 'Production Monitoring',
    key: 'vmm_prod_1234567890abcdef',
    permissions: ['read:metrics', 'read:alerts', 'write:alerts'],
    created: '2023-11-01T10:00:00.000Z',
    lastUsed: '2023-12-15T16:30:00.000Z',
    status: 'Active'
  },
  {
    id: 'api-2',
    name: 'Development Integration',
    key: 'vmm_dev_abcdef1234567890',
    permissions: ['read:all', 'write:vms', 'write:databases'],
    created: '2023-10-15T14:30:00.000Z',
    lastUsed: '2023-12-14T09:15:00.000Z',
    status: 'Active'
  },
  {
    id: 'api-3',
    name: 'Backup Service',
    key: 'vmm_backup_567890abcdef1234',
    permissions: ['read:all'],
    created: '2023-09-20T11:45:00.000Z',
    expiresAt: '2024-09-20T11:45:00.000Z',
    status: 'Active'
  },
  {
    id: 'api-4',
    name: 'Legacy Integration',
    key: 'vmm_legacy_fedcba0987654321',
    permissions: ['read:vms'],
    created: '2023-06-01T08:00:00.000Z',
    lastUsed: '2023-08-15T12:30:00.000Z',
    status: 'Inactive'
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2023-12-15T16:45:00.000Z',
    user: 'admin@company.com',
    action: 'VM Created',
    resource: 'web-server-prod-02',
    details: 'Created new virtual machine with Standard_D2s_v3 size',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'Success'
  },
  {
    id: 'audit-2',
    timestamp: '2023-12-15T16:30:00.000Z',
    user: 'admin@company.com',
    action: 'Security Setting Updated',
    resource: 'Multi-Factor Authentication',
    details: 'Enabled MFA requirement for all users',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'Success'
  },
  {
    id: 'audit-3',
    timestamp: '2023-12-15T15:20:00.000Z',
    user: 'dev@company.com',
    action: 'Database Access',
    resource: 'prod-mysql-db',
    details: 'Attempted to access production database',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: 'Failed'
  },
  {
    id: 'audit-4',
    timestamp: '2023-12-15T14:15:00.000Z',
    user: 'admin@company.com',
    action: 'API Key Created',
    resource: 'Production Monitoring',
    details: 'Created new API key for monitoring integration',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'Success'
  },
  {
    id: 'audit-5',
    timestamp: '2023-12-15T13:45:00.000Z',
    user: 'ops@company.com',
    action: 'VM Status Changed',
    resource: 'test-vm-staging',
    details: 'Stopped virtual machine for maintenance',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    status: 'Success'
  }
];

const mockBackupConfig: BackupConfig = {
  enabled: true,
  frequency: 'Daily',
  retention: 30,
  location: 'Azure Blob Storage - West US',
  encryption: true,
  lastBackup: '2023-12-15T02:00:00.000Z',
  nextBackup: '2023-12-16T02:00:00.000Z',
  autoRestore: false
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>(mockNotificationPreferences);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(mockSecuritySettings);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(mockIntegrations);
  const [billingSettings, setBillingSettings] = useState<BillingSettings>(mockBillingSettings);
  const [apiKeys, setAPIKeys] = useState<APIKey[]>(mockAPIKeys);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [backupConfig, setBackupConfig] = useState<BackupConfig>(mockBackupConfig);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const updateNotificationPreference = (id: string, updates: Partial<NotificationPreference>) => {
    setNotificationPreferences(prev => 
      prev.map(pref => pref.id === id ? { ...pref, ...updates } : pref)
    );
  };

  const updateSecuritySetting = (id: string, enabled: boolean) => {
    setSecuritySettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled, lastModified: new Date().toISOString() }
          : setting
      )
    );
  };

  const updateIntegration = (id: string, updates: Partial<IntegrationConfig>) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id ? { ...integration, ...updates } : integration
      )
    );
  };

  const updateBillingSettings = (updates: Partial<BillingSettings>) => {
    setBillingSettings(prev => ({ ...prev, ...updates }));
  };

  const createAPIKey = (name: string, permissions: string[]) => {
    const newKey: APIKey = {
      id: `api-${Date.now()}`,
      name,
      key: `vmm_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`,
      permissions,
      created: new Date().toISOString(),
      status: 'Active'
    };
    setAPIKeys(prev => [...prev, newKey]);
  };

  const deleteAPIKey = (id: string) => {
    setAPIKeys(prev => prev.filter(key => key.id !== id));
  };

  const updateBackupConfig = (updates: Partial<BackupConfig>) => {
    setBackupConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{
      userProfile,
      notificationPreferences,
      securitySettings,
      integrations,
      billingSettings,
      apiKeys,
      auditLogs,
      backupConfig,
      updateUserProfile,
      updateNotificationPreference,
      updateSecuritySetting,
      updateIntegration,
      updateBillingSettings,
      createAPIKey,
      deleteAPIKey,
      updateBackupConfig
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};