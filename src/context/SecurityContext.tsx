import React, { createContext, useState, useContext, ReactNode } from 'react';

export type SecurityCenterStatus = 'Healthy' | 'Warning' | 'Critical' | 'Unknown';
export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Not Assessed';
export type ThreatStatus = 'Active' | 'Resolved' | 'Investigating' | 'Dismissed';
export type VulnerabilityStatus = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
export type IdentityStatus = 'Secure' | 'At Risk' | 'Compromised' | 'Unknown';

export type SecurityRecommendation = {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Identity' | 'Network' | 'Data' | 'Compute' | 'Storage' | 'Application';
  resourceType: string;
  resourceName: string;
  impact: string;
  remediation: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Dismissed';
  created: string;
  lastUpdated: string;
  estimatedCost?: number;
};

export type ComplianceStandard = {
  id: string;
  name: string;
  description: string;
  status: ComplianceStatus;
  score: number;
  totalControls: number;
  passedControls: number;
  failedControls: number;
  lastAssessment: string;
  nextAssessment: string;
  category: 'Regulatory' | 'Industry' | 'Internal' | 'Security Framework';
};

export type SecurityAlert = {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  status: ThreatStatus;
  category: 'Malware' | 'Suspicious Activity' | 'Policy Violation' | 'Vulnerability' | 'Anomaly';
  resourceType: string;
  resourceName: string;
  detectedAt: string;
  lastUpdated: string;
  source: string;
  mitreTactics: string[];
  affectedResources: number;
};

export type Vulnerability = {
  id: string;
  title: string;
  description: string;
  severity: VulnerabilityStatus;
  cvssScore: number;
  cveId?: string;
  category: 'OS' | 'Application' | 'Container' | 'Network' | 'Configuration';
  resourceType: string;
  resourceName: string;
  discoveredAt: string;
  lastSeen: string;
  status: 'Open' | 'Patched' | 'Mitigated' | 'Accepted Risk';
  patchAvailable: boolean;
  exploitAvailable: boolean;
};

export type IdentityRisk = {
  id: string;
  userPrincipalName: string;
  displayName: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  riskState: 'At Risk' | 'Confirmed Safe' | 'Confirmed Compromised' | 'Dismissed';
  riskDetail: string;
  riskEventTypes: string[];
  lastRiskDetection: string;
  location?: string;
  ipAddress?: string;
  deviceInfo?: string;
};

export type SecurityPolicy = {
  id: string;
  name: string;
  description: string;
  type: 'Conditional Access' | 'Data Loss Prevention' | 'Information Protection' | 'Compliance' | 'Network Security';
  status: 'Enabled' | 'Disabled' | 'Report Only';
  scope: string;
  conditions: string[];
  actions: string[];
  created: string;
  lastModified: string;
  assignedUsers: number;
  assignedGroups: number;
};

export type SecurityMetrics = {
  securityScore: number;
  identityScore: number;
  deviceScore: number;
  appScore: number;
  dataScore: number;
  infrastructureScore: number;
  totalRecommendations: number;
  criticalRecommendations: number;
  highRecommendations: number;
  totalAlerts: number;
  activeThreats: number;
  resolvedThreats: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  complianceScore: number;
  identityRisks: number;
  securityPolicies: number;
  enabledPolicies: number;
};

interface SecurityContextType {
  securityMetrics: SecurityMetrics;
  recommendations: SecurityRecommendation[];
  complianceStandards: ComplianceStandard[];
  securityAlerts: SecurityAlert[];
  vulnerabilities: Vulnerability[];
  identityRisks: IdentityRisk[];
  securityPolicies: SecurityPolicy[];
  updateRecommendationStatus: (id: string, status: 'Open' | 'In Progress' | 'Resolved' | 'Dismissed') => void;
  updateAlertStatus: (id: string, status: ThreatStatus) => void;
  updateVulnerabilityStatus: (id: string, status: 'Open' | 'Patched' | 'Mitigated' | 'Accepted Risk') => void;
  updateIdentityRiskState: (id: string, state: 'At Risk' | 'Confirmed Safe' | 'Confirmed Compromised' | 'Dismissed') => void;
  updatePolicyStatus: (id: string, status: 'Enabled' | 'Disabled' | 'Report Only') => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const mockSecurityMetrics: SecurityMetrics = {
  securityScore: 78,
  identityScore: 85,
  deviceScore: 72,
  appScore: 81,
  dataScore: 76,
  infrastructureScore: 74,
  totalRecommendations: 47,
  criticalRecommendations: 3,
  highRecommendations: 8,
  totalAlerts: 23,
  activeThreats: 5,
  resolvedThreats: 18,
  totalVulnerabilities: 156,
  criticalVulnerabilities: 4,
  highVulnerabilities: 12,
  complianceScore: 82,
  identityRisks: 7,
  securityPolicies: 15,
  enabledPolicies: 12
};

const mockRecommendations: SecurityRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Enable Azure Security Center Standard',
    description: 'Upgrade to Azure Security Center Standard tier for advanced threat protection and security monitoring.',
    severity: 'High',
    category: 'Compute',
    resourceType: 'Subscription',
    resourceName: 'Enterprise Dev/Test',
    impact: 'Enhanced threat detection and security monitoring across all resources',
    remediation: 'Navigate to Security Center and upgrade to Standard tier',
    status: 'Open',
    created: '2023-12-10T08:30:00.000Z',
    lastUpdated: '2023-12-10T08:30:00.000Z',
    estimatedCost: 15
  },
  {
    id: 'rec-2',
    title: 'Configure disk encryption for VMs',
    description: 'Enable Azure Disk Encryption for virtual machines to protect data at rest.',
    severity: 'Critical',
    category: 'Compute',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    impact: 'Protects sensitive data from unauthorized access',
    remediation: 'Enable Azure Disk Encryption in VM settings',
    status: 'Open',
    created: '2023-12-08T14:20:00.000Z',
    lastUpdated: '2023-12-08T14:20:00.000Z'
  },
  {
    id: 'rec-3',
    title: 'Enable MFA for privileged accounts',
    description: 'Require multi-factor authentication for all privileged user accounts.',
    severity: 'Critical',
    category: 'Identity',
    resourceType: 'User Account',
    resourceName: 'admin@company.com',
    impact: 'Prevents unauthorized access to privileged accounts',
    remediation: 'Configure MFA in Azure Active Directory',
    status: 'In Progress',
    created: '2023-12-05T11:15:00.000Z',
    lastUpdated: '2023-12-12T09:45:00.000Z'
  },
  {
    id: 'rec-4',
    title: 'Configure network security groups',
    description: 'Restrict network access using network security groups with least privilege principle.',
    severity: 'High',
    category: 'Network',
    resourceType: 'Network Security Group',
    resourceName: 'production-nsg',
    impact: 'Reduces attack surface and prevents lateral movement',
    remediation: 'Review and update NSG rules to follow least privilege',
    status: 'Open',
    created: '2023-12-07T16:30:00.000Z',
    lastUpdated: '2023-12-07T16:30:00.000Z'
  },
  {
    id: 'rec-5',
    title: 'Enable SQL Database auditing',
    description: 'Enable auditing for SQL databases to track database activities and compliance.',
    severity: 'Medium',
    category: 'Data',
    resourceType: 'SQL Database',
    resourceName: 'prod-mysql-db',
    impact: 'Provides audit trail for compliance and security monitoring',
    remediation: 'Enable auditing in database security settings',
    status: 'Resolved',
    created: '2023-12-01T10:00:00.000Z',
    lastUpdated: '2023-12-11T15:20:00.000Z'
  }
];

const mockComplianceStandards: ComplianceStandard[] = [
  {
    id: 'comp-1',
    name: 'ISO 27001',
    description: 'International standard for information security management systems',
    status: 'Compliant',
    score: 89,
    totalControls: 114,
    passedControls: 101,
    failedControls: 13,
    lastAssessment: '2023-11-15T00:00:00.000Z',
    nextAssessment: '2024-02-15T00:00:00.000Z',
    category: 'Security Framework'
  },
  {
    id: 'comp-2',
    name: 'SOC 2 Type II',
    description: 'Service Organization Control 2 audit for security, availability, and confidentiality',
    status: 'Partially Compliant',
    score: 76,
    totalControls: 67,
    passedControls: 51,
    failedControls: 16,
    lastAssessment: '2023-10-30T00:00:00.000Z',
    nextAssessment: '2024-01-30T00:00:00.000Z',
    category: 'Industry'
  },
  {
    id: 'comp-3',
    name: 'GDPR',
    description: 'General Data Protection Regulation compliance for data privacy',
    status: 'Compliant',
    score: 92,
    totalControls: 45,
    passedControls: 41,
    failedControls: 4,
    lastAssessment: '2023-12-01T00:00:00.000Z',
    nextAssessment: '2024-03-01T00:00:00.000Z',
    category: 'Regulatory'
  },
  {
    id: 'comp-4',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    status: 'Non-Compliant',
    score: 58,
    totalControls: 78,
    passedControls: 45,
    failedControls: 33,
    lastAssessment: '2023-11-20T00:00:00.000Z',
    nextAssessment: '2024-02-20T00:00:00.000Z',
    category: 'Industry'
  }
];

const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: 'alert-1',
    title: 'Suspicious login activity detected',
    description: 'Multiple failed login attempts from unusual location detected for admin account',
    severity: 'High',
    status: 'Active',
    category: 'Suspicious Activity',
    resourceType: 'User Account',
    resourceName: 'admin@company.com',
    detectedAt: '2023-12-15T14:30:00.000Z',
    lastUpdated: '2023-12-15T14:30:00.000Z',
    source: 'Azure AD Identity Protection',
    mitreTactics: ['Initial Access', 'Credential Access'],
    affectedResources: 1
  },
  {
    id: 'alert-2',
    title: 'Malware detected on virtual machine',
    description: 'Potential malware activity detected on production web server',
    severity: 'Critical',
    status: 'Investigating',
    category: 'Malware',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    detectedAt: '2023-12-15T12:15:00.000Z',
    lastUpdated: '2023-12-15T13:45:00.000Z',
    source: 'Microsoft Defender for Cloud',
    mitreTactics: ['Execution', 'Persistence'],
    affectedResources: 1
  },
  {
    id: 'alert-3',
    title: 'Unusual data access pattern',
    description: 'Abnormal data access pattern detected in production database',
    severity: 'Medium',
    status: 'Resolved',
    category: 'Anomaly',
    resourceType: 'SQL Database',
    resourceName: 'prod-mysql-db',
    detectedAt: '2023-12-14T09:20:00.000Z',
    lastUpdated: '2023-12-15T10:30:00.000Z',
    source: 'Azure SQL Database Threat Detection',
    mitreTactics: ['Collection', 'Exfiltration'],
    affectedResources: 1
  },
  {
    id: 'alert-4',
    title: 'Network security group rule violation',
    description: 'Overly permissive network security group rule detected',
    severity: 'Medium',
    status: 'Active',
    category: 'Policy Violation',
    resourceType: 'Network Security Group',
    resourceName: 'production-nsg',
    detectedAt: '2023-12-13T16:45:00.000Z',
    lastUpdated: '2023-12-13T16:45:00.000Z',
    source: 'Azure Policy',
    mitreTactics: ['Lateral Movement'],
    affectedResources: 3
  }
];

const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-1',
    title: 'Critical Windows Security Update Missing',
    description: 'Critical security update for Windows Server 2022 is missing on virtual machine',
    severity: 'Critical',
    cvssScore: 9.8,
    cveId: 'CVE-2023-36884',
    category: 'OS',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    discoveredAt: '2023-12-10T08:00:00.000Z',
    lastSeen: '2023-12-15T08:00:00.000Z',
    status: 'Open',
    patchAvailable: true,
    exploitAvailable: true
  },
  {
    id: 'vuln-2',
    title: 'SQL Server Vulnerability',
    description: 'SQL Server instance has known vulnerability that could allow privilege escalation',
    severity: 'High',
    cvssScore: 8.1,
    cveId: 'CVE-2023-32049',
    category: 'Application',
    resourceType: 'SQL Database',
    resourceName: 'prod-mysql-db',
    discoveredAt: '2023-12-08T14:30:00.000Z',
    lastSeen: '2023-12-15T14:30:00.000Z',
    status: 'Patched',
    patchAvailable: true,
    exploitAvailable: false
  },
  {
    id: 'vuln-3',
    title: 'Container Image Vulnerability',
    description: 'Container image contains vulnerable packages with known security issues',
    severity: 'Medium',
    cvssScore: 6.5,
    category: 'Container',
    resourceType: 'Container Registry',
    resourceName: 'myapp:latest',
    discoveredAt: '2023-12-12T11:20:00.000Z',
    lastSeen: '2023-12-15T11:20:00.000Z',
    status: 'Open',
    patchAvailable: true,
    exploitAvailable: false
  },
  {
    id: 'vuln-4',
    title: 'Weak SSL/TLS Configuration',
    description: 'Web application is using weak SSL/TLS configuration that could be exploited',
    severity: 'Medium',
    cvssScore: 5.9,
    category: 'Configuration',
    resourceType: 'Web Application',
    resourceName: 'production-webapp',
    discoveredAt: '2023-12-05T16:15:00.000Z',
    lastSeen: '2023-12-15T16:15:00.000Z',
    status: 'Mitigated',
    patchAvailable: false,
    exploitAvailable: false
  }
];

const mockIdentityRisks: IdentityRisk[] = [
  {
    id: 'risk-1',
    userPrincipalName: 'john.doe@company.com',
    displayName: 'John Doe',
    riskLevel: 'High',
    riskState: 'At Risk',
    riskDetail: 'Unfamiliar sign-in properties',
    riskEventTypes: ['unfamiliarFeatures', 'anonymizedIPAddress'],
    lastRiskDetection: '2023-12-15T10:30:00.000Z',
    location: 'Unknown',
    ipAddress: '192.168.1.100',
    deviceInfo: 'Windows 11 - Chrome'
  },
  {
    id: 'risk-2',
    userPrincipalName: 'jane.smith@company.com',
    displayName: 'Jane Smith',
    riskLevel: 'Medium',
    riskState: 'At Risk',
    riskDetail: 'Atypical travel',
    riskEventTypes: ['atypicalTravel'],
    lastRiskDetection: '2023-12-14T15:45:00.000Z',
    location: 'Tokyo, Japan',
    ipAddress: '203.0.113.45',
    deviceInfo: 'iPhone - Safari'
  },
  {
    id: 'risk-3',
    userPrincipalName: 'mike.wilson@company.com',
    displayName: 'Mike Wilson',
    riskLevel: 'Low',
    riskState: 'Confirmed Safe',
    riskDetail: 'Password spray',
    riskEventTypes: ['passwordSpray'],
    lastRiskDetection: '2023-12-13T09:20:00.000Z',
    location: 'New York, US',
    ipAddress: '198.51.100.23'
  }
];

const mockSecurityPolicies: SecurityPolicy[] = [
  {
    id: 'policy-1',
    name: 'Require MFA for Admin Roles',
    description: 'Conditional access policy requiring multi-factor authentication for administrative roles',
    type: 'Conditional Access',
    status: 'Enabled',
    scope: 'Administrative Roles',
    conditions: ['User role: Global Administrator', 'User role: Security Administrator'],
    actions: ['Require MFA', 'Block legacy authentication'],
    created: '2023-10-15T10:00:00.000Z',
    lastModified: '2023-11-20T14:30:00.000Z',
    assignedUsers: 5,
    assignedGroups: 2
  },
  {
    id: 'policy-2',
    name: 'Block High-Risk Sign-ins',
    description: 'Block sign-ins detected as high risk by Azure AD Identity Protection',
    type: 'Conditional Access',
    status: 'Enabled',
    scope: 'All Users',
    conditions: ['Sign-in risk: High'],
    actions: ['Block access'],
    created: '2023-09-01T08:00:00.000Z',
    lastModified: '2023-12-01T16:15:00.000Z',
    assignedUsers: 150,
    assignedGroups: 8
  },
  {
    id: 'policy-3',
    name: 'Data Loss Prevention - Financial Data',
    description: 'Prevent sharing of financial data outside the organization',
    type: 'Data Loss Prevention',
    status: 'Enabled',
    scope: 'All Users',
    conditions: ['Content contains: Credit card numbers', 'Content contains: Bank account numbers'],
    actions: ['Block sharing', 'Send notification'],
    created: '2023-08-15T12:00:00.000Z',
    lastModified: '2023-11-10T10:45:00.000Z',
    assignedUsers: 150,
    assignedGroups: 12
  },
  {
    id: 'policy-4',
    name: 'Device Compliance Policy',
    description: 'Require device compliance for accessing corporate resources',
    type: 'Conditional Access',
    status: 'Report Only',
    scope: 'All Users',
    conditions: ['Device state: Not compliant'],
    actions: ['Require compliant device'],
    created: '2023-11-01T14:00:00.000Z',
    lastModified: '2023-12-05T11:20:00.000Z',
    assignedUsers: 150,
    assignedGroups: 8
  }
];

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [securityMetrics] = useState<SecurityMetrics>(mockSecurityMetrics);
  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>(mockRecommendations);
  const [complianceStandards] = useState<ComplianceStandard[]>(mockComplianceStandards);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(mockSecurityAlerts);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(mockVulnerabilities);
  const [identityRisks, setIdentityRisks] = useState<IdentityRisk[]>(mockIdentityRisks);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>(mockSecurityPolicies);

  const updateRecommendationStatus = (id: string, status: 'Open' | 'In Progress' | 'Resolved' | 'Dismissed') => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, status, lastUpdated: new Date().toISOString() } : rec
    ));
  };

  const updateAlertStatus = (id: string, status: ThreatStatus) => {
    setSecurityAlerts(securityAlerts.map(alert => 
      alert.id === id ? { ...alert, status, lastUpdated: new Date().toISOString() } : alert
    ));
  };

  const updateVulnerabilityStatus = (id: string, status: 'Open' | 'Patched' | 'Mitigated' | 'Accepted Risk') => {
    setVulnerabilities(vulnerabilities.map(vuln => 
      vuln.id === id ? { ...vuln, status, lastSeen: new Date().toISOString() } : vuln
    ));
  };

  const updateIdentityRiskState = (id: string, state: 'At Risk' | 'Confirmed Safe' | 'Confirmed Compromised' | 'Dismissed') => {
    setIdentityRisks(identityRisks.map(risk => 
      risk.id === id ? { ...risk, riskState: state } : risk
    ));
  };

  const updatePolicyStatus = (id: string, status: 'Enabled' | 'Disabled' | 'Report Only') => {
    setSecurityPolicies(securityPolicies.map(policy => 
      policy.id === id ? { ...policy, status, lastModified: new Date().toISOString() } : policy
    ));
  };

  return (
    <SecurityContext.Provider value={{
      securityMetrics,
      recommendations,
      complianceStandards,
      securityAlerts,
      vulnerabilities,
      identityRisks,
      securityPolicies,
      updateRecommendationStatus,
      updateAlertStatus,
      updateVulnerabilityStatus,
      updateIdentityRiskState,
      updatePolicyStatus
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};