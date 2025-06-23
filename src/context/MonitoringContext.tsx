import React, { createContext, useState, useContext, ReactNode } from 'react';

export type MetricStatus = 'Healthy' | 'Warning' | 'Critical' | 'Unknown';
export type AlertStatus = 'Active' | 'Resolved' | 'Suppressed' | 'Acknowledged';
export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
export type DashboardType = 'Infrastructure' | 'Application' | 'Security' | 'Business' | 'Custom';

export type MetricData = {
  timestamp: string;
  value: number;
};

export type Metric = {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  resourceName: string;
  unit: string;
  currentValue: number;
  status: MetricStatus;
  threshold: {
    warning: number;
    critical: number;
  };
  data: MetricData[];
  lastUpdated: string;
  category: 'Performance' | 'Availability' | 'Security' | 'Cost' | 'Usage';
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  resourceType: string;
  resourceName: string;
  metricName: string;
  currentValue: number;
  threshold: number;
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  acknowledgedBy?: string;
  tags: string[];
  runbookUrl?: string;
};

export type Dashboard = {
  id: string;
  name: string;
  description: string;
  type: DashboardType;
  isDefault: boolean;
  widgets: Widget[];
  created: string;
  lastModified: string;
  createdBy: string;
  shared: boolean;
  tags: string[];
};

export type Widget = {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'heatmap' | 'gauge' | 'text';
  position: { x: number; y: number; width: number; height: number };
  config: {
    metrics: string[];
    timeRange: string;
    chartType?: 'line' | 'bar' | 'area' | 'pie';
    aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
    refreshInterval?: number;
  };
};

export type LogEntry = {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
  source: string;
  message: string;
  resourceType: string;
  resourceName: string;
  tags: Record<string, string>;
  correlationId?: string;
};

export type PerformanceInsight = {
  id: string;
  title: string;
  description: string;
  type: 'Optimization' | 'Cost Saving' | 'Performance' | 'Reliability' | 'Security';
  severity: 'High' | 'Medium' | 'Low';
  resourceType: string;
  resourceName: string;
  recommendation: string;
  estimatedImpact: string;
  estimatedSavings?: number;
  created: string;
  status: 'New' | 'Acknowledged' | 'Implemented' | 'Dismissed';
};

export type MonitoringMetrics = {
  totalResources: number;
  healthyResources: number;
  warningResources: number;
  criticalResources: number;
  totalAlerts: number;
  activeAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  averageResponseTime: number;
  uptime: number;
  totalCost: number;
  costTrend: number;
};

interface MonitoringContextType {
  monitoringMetrics: MonitoringMetrics;
  metrics: Metric[];
  alerts: Alert[];
  dashboards: Dashboard[];
  logEntries: LogEntry[];
  performanceInsights: PerformanceInsight[];
  updateAlertStatus: (id: string, status: AlertStatus, acknowledgedBy?: string) => void;
  updateInsightStatus: (id: string, status: 'New' | 'Acknowledged' | 'Implemented' | 'Dismissed') => void;
  createDashboard: (dashboard: Omit<Dashboard, 'id' | 'created' | 'lastModified'>) => void;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  deleteDashboard: (id: string) => void;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

const mockMonitoringMetrics: MonitoringMetrics = {
  totalResources: 47,
  healthyResources: 39,
  warningResources: 6,
  criticalResources: 2,
  totalAlerts: 23,
  activeAlerts: 8,
  criticalAlerts: 2,
  highAlerts: 3,
  averageResponseTime: 245,
  uptime: 99.87,
  totalCost: 3247.89,
  costTrend: -5.2
};

const generateMetricData = (baseValue: number, points: number = 24): MetricData[] => {
  const data: MetricData[] = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    const variation = (Math.random() - 0.5) * 0.3;
    const value = Math.max(0, baseValue * (1 + variation));
    data.push({ timestamp, value });
  }
  
  return data;
};

const mockMetrics: Metric[] = [
  {
    id: 'metric-1',
    name: 'CPU Utilization',
    description: 'Average CPU utilization across all virtual machines',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    unit: '%',
    currentValue: 67.5,
    status: 'Warning',
    threshold: { warning: 70, critical: 90 },
    data: generateMetricData(67.5),
    lastUpdated: new Date().toISOString(),
    category: 'Performance'
  },
  {
    id: 'metric-2',
    name: 'Memory Usage',
    description: 'Memory utilization percentage',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    unit: '%',
    currentValue: 45.2,
    status: 'Healthy',
    threshold: { warning: 80, critical: 95 },
    data: generateMetricData(45.2),
    lastUpdated: new Date().toISOString(),
    category: 'Performance'
  },
  {
    id: 'metric-3',
    name: 'Disk I/O',
    description: 'Disk input/output operations per second',
    resourceType: 'Virtual Machine',
    resourceName: 'db-server-dev',
    unit: 'IOPS',
    currentValue: 1250,
    status: 'Healthy',
    threshold: { warning: 2000, critical: 3000 },
    data: generateMetricData(1250),
    lastUpdated: new Date().toISOString(),
    category: 'Performance'
  },
  {
    id: 'metric-4',
    name: 'Network Throughput',
    description: 'Network data transfer rate',
    resourceType: 'Load Balancer',
    resourceName: 'production-lb',
    unit: 'Mbps',
    currentValue: 89.7,
    status: 'Healthy',
    threshold: { warning: 800, critical: 950 },
    data: generateMetricData(89.7),
    lastUpdated: new Date().toISOString(),
    category: 'Performance'
  },
  {
    id: 'metric-5',
    name: 'Database Connections',
    description: 'Active database connections',
    resourceType: 'SQL Database',
    resourceName: 'prod-mysql-db',
    unit: 'connections',
    currentValue: 45,
    status: 'Healthy',
    threshold: { warning: 80, critical: 100 },
    data: generateMetricData(45),
    lastUpdated: new Date().toISOString(),
    category: 'Usage'
  },
  {
    id: 'metric-6',
    name: 'Response Time',
    description: 'Average application response time',
    resourceType: 'Web Application',
    resourceName: 'production-webapp',
    unit: 'ms',
    currentValue: 245,
    status: 'Warning',
    threshold: { warning: 200, critical: 500 },
    data: generateMetricData(245),
    lastUpdated: new Date().toISOString(),
    category: 'Performance'
  },
  {
    id: 'metric-7',
    name: 'Storage Usage',
    description: 'Storage utilization percentage',
    resourceType: 'Storage Account',
    resourceName: 'prodstorageaccount',
    unit: '%',
    currentValue: 78.3,
    status: 'Warning',
    threshold: { warning: 75, critical: 90 },
    data: generateMetricData(78.3),
    lastUpdated: new Date().toISOString(),
    category: 'Usage'
  },
  {
    id: 'metric-8',
    name: 'Error Rate',
    description: 'Application error rate percentage',
    resourceType: 'Web Application',
    resourceName: 'production-webapp',
    unit: '%',
    currentValue: 2.1,
    status: 'Critical',
    threshold: { warning: 1, critical: 2 },
    data: generateMetricData(2.1),
    lastUpdated: new Date().toISOString(),
    category: 'Availability'
  }
];

const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'High CPU Utilization',
    description: 'CPU utilization has exceeded 70% threshold for the past 15 minutes',
    severity: 'High',
    status: 'Active',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    metricName: 'CPU Utilization',
    currentValue: 78.5,
    threshold: 70,
    triggeredAt: '2023-12-15T14:30:00.000Z',
    tags: ['performance', 'cpu', 'production'],
    runbookUrl: 'https://docs.company.com/runbooks/high-cpu'
  },
  {
    id: 'alert-2',
    title: 'Application Error Rate Critical',
    description: 'Error rate has exceeded critical threshold of 2%',
    severity: 'Critical',
    status: 'Active',
    resourceType: 'Web Application',
    resourceName: 'production-webapp',
    metricName: 'Error Rate',
    currentValue: 2.8,
    threshold: 2,
    triggeredAt: '2023-12-15T15:45:00.000Z',
    tags: ['application', 'errors', 'critical'],
    runbookUrl: 'https://docs.company.com/runbooks/high-error-rate'
  },
  {
    id: 'alert-3',
    title: 'Storage Usage Warning',
    description: 'Storage utilization has exceeded 75% threshold',
    severity: 'Medium',
    status: 'Acknowledged',
    resourceType: 'Storage Account',
    resourceName: 'prodstorageaccount',
    metricName: 'Storage Usage',
    currentValue: 78.3,
    threshold: 75,
    triggeredAt: '2023-12-15T12:20:00.000Z',
    acknowledgedAt: '2023-12-15T13:15:00.000Z',
    acknowledgedBy: 'admin@company.com',
    tags: ['storage', 'capacity', 'warning']
  },
  {
    id: 'alert-4',
    title: 'Database Connection Pool Full',
    description: 'Database connection pool is approaching maximum capacity',
    severity: 'High',
    status: 'Resolved',
    resourceType: 'SQL Database',
    resourceName: 'prod-mysql-db',
    metricName: 'Database Connections',
    currentValue: 95,
    threshold: 80,
    triggeredAt: '2023-12-15T10:30:00.000Z',
    resolvedAt: '2023-12-15T11:45:00.000Z',
    tags: ['database', 'connections', 'performance']
  },
  {
    id: 'alert-5',
    title: 'Network Latency Spike',
    description: 'Network latency has increased significantly',
    severity: 'Medium',
    status: 'Active',
    resourceType: 'Load Balancer',
    resourceName: 'production-lb',
    metricName: 'Network Latency',
    currentValue: 150,
    threshold: 100,
    triggeredAt: '2023-12-15T16:10:00.000Z',
    tags: ['network', 'latency', 'performance']
  }
];

const mockDashboards: Dashboard[] = [
  {
    id: 'dash-1',
    name: 'Infrastructure Overview',
    description: 'High-level view of infrastructure health and performance',
    type: 'Infrastructure',
    isDefault: true,
    widgets: [
      {
        id: 'widget-1',
        title: 'CPU Utilization',
        type: 'chart',
        position: { x: 0, y: 0, width: 6, height: 4 },
        config: {
          metrics: ['metric-1'],
          timeRange: '24h',
          chartType: 'line',
          aggregation: 'avg',
          refreshInterval: 60
        }
      },
      {
        id: 'widget-2',
        title: 'Memory Usage',
        type: 'gauge',
        position: { x: 6, y: 0, width: 3, height: 4 },
        config: {
          metrics: ['metric-2'],
          timeRange: '1h',
          refreshInterval: 30
        }
      },
      {
        id: 'widget-3',
        title: 'Active Alerts',
        type: 'metric',
        position: { x: 9, y: 0, width: 3, height: 4 },
        config: {
          metrics: ['alerts-active'],
          timeRange: 'current',
          refreshInterval: 15
        }
      }
    ],
    created: '2023-11-01T10:00:00.000Z',
    lastModified: '2023-12-10T14:30:00.000Z',
    createdBy: 'admin@company.com',
    shared: true,
    tags: ['infrastructure', 'overview', 'default']
  },
  {
    id: 'dash-2',
    name: 'Application Performance',
    description: 'Application-specific performance metrics and health indicators',
    type: 'Application',
    isDefault: false,
    widgets: [
      {
        id: 'widget-4',
        title: 'Response Time',
        type: 'chart',
        position: { x: 0, y: 0, width: 8, height: 4 },
        config: {
          metrics: ['metric-6'],
          timeRange: '12h',
          chartType: 'area',
          aggregation: 'avg',
          refreshInterval: 60
        }
      },
      {
        id: 'widget-5',
        title: 'Error Rate',
        type: 'chart',
        position: { x: 8, y: 0, width: 4, height: 4 },
        config: {
          metrics: ['metric-8'],
          timeRange: '12h',
          chartType: 'line',
          aggregation: 'avg',
          refreshInterval: 30
        }
      }
    ],
    created: '2023-11-15T09:30:00.000Z',
    lastModified: '2023-12-05T16:20:00.000Z',
    createdBy: 'dev@company.com',
    shared: false,
    tags: ['application', 'performance', 'webapp']
  }
];

const mockLogEntries: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2023-12-15T16:45:23.456Z',
    level: 'ERROR',
    source: 'web-server-prod',
    message: 'Database connection timeout after 30 seconds',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    tags: { component: 'database', operation: 'connect', timeout: '30s' },
    correlationId: 'req-12345-abcde'
  },
  {
    id: 'log-2',
    timestamp: '2023-12-15T16:44:15.789Z',
    level: 'WARN',
    source: 'production-webapp',
    message: 'High memory usage detected: 85% of available memory in use',
    resourceType: 'Web Application',
    resourceName: 'production-webapp',
    tags: { component: 'memory', usage: '85%', threshold: '80%' }
  },
  {
    id: 'log-3',
    timestamp: '2023-12-15T16:43:02.123Z',
    level: 'INFO',
    source: 'production-lb',
    message: 'Health check passed for backend server web-server-prod',
    resourceType: 'Load Balancer',
    resourceName: 'production-lb',
    tags: { component: 'healthcheck', backend: 'web-server-prod', status: 'healthy' }
  },
  {
    id: 'log-4',
    timestamp: '2023-12-15T16:42:45.678Z',
    level: 'ERROR',
    source: 'prod-mysql-db',
    message: 'Slow query detected: SELECT * FROM users WHERE created_at > NOW() - INTERVAL 1 DAY (execution time: 5.2s)',
    resourceType: 'SQL Database',
    resourceName: 'prod-mysql-db',
    tags: { component: 'query', execution_time: '5.2s', threshold: '1s', table: 'users' },
    correlationId: 'query-67890-fghij'
  },
  {
    id: 'log-5',
    timestamp: '2023-12-15T16:41:30.234Z',
    level: 'WARN',
    source: 'prodstorageaccount',
    message: 'Storage account approaching capacity limit: 78% used',
    resourceType: 'Storage Account',
    resourceName: 'prodstorageaccount',
    tags: { component: 'storage', usage: '78%', limit: '80%' }
  }
];

const mockPerformanceInsights: PerformanceInsight[] = [
  {
    id: 'insight-1',
    title: 'Optimize VM Size for Cost Savings',
    description: 'Virtual machine web-server-prod is consistently using less than 40% CPU and memory',
    type: 'Cost Saving',
    severity: 'Medium',
    resourceType: 'Virtual Machine',
    resourceName: 'web-server-prod',
    recommendation: 'Consider downsizing from Standard_D4s_v3 to Standard_D2s_v3 to reduce costs by approximately 50%',
    estimatedImpact: 'Reduce monthly costs by $84 while maintaining performance',
    estimatedSavings: 84,
    created: '2023-12-10T09:00:00.000Z',
    status: 'New'
  },
  {
    id: 'insight-2',
    title: 'Enable Auto-scaling for Load Balancer',
    description: 'Traffic patterns show significant variation throughout the day',
    type: 'Performance',
    severity: 'High',
    resourceType: 'Load Balancer',
    resourceName: 'production-lb',
    recommendation: 'Configure auto-scaling rules to handle traffic spikes more efficiently',
    estimatedImpact: 'Improve response times during peak hours and reduce costs during low traffic',
    created: '2023-12-08T14:30:00.000Z',
    status: 'Acknowledged'
  },
  {
    id: 'insight-3',
    title: 'Database Index Optimization',
    description: 'Multiple slow queries detected on prod-mysql-db',
    type: 'Performance',
    severity: 'High',
    resourceType: 'SQL Database',
    resourceName: 'prod-mysql-db',
    recommendation: 'Add indexes on frequently queried columns: users.created_at, orders.status',
    estimatedImpact: 'Reduce query execution time by up to 80%',
    created: '2023-12-12T11:20:00.000Z',
    status: 'New'
  },
  {
    id: 'insight-4',
    title: 'Storage Tier Optimization',
    description: 'Infrequently accessed data consuming expensive hot storage',
    type: 'Cost Saving',
    severity: 'Medium',
    resourceType: 'Storage Account',
    resourceName: 'prodstorageaccount',
    recommendation: 'Move data older than 30 days to cool storage tier',
    estimatedImpact: 'Reduce storage costs by approximately 40%',
    estimatedSavings: 156,
    created: '2023-12-05T16:45:00.000Z',
    status: 'Implemented'
  }
];

export const MonitoringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [monitoringMetrics] = useState<MonitoringMetrics>(mockMonitoringMetrics);
  const [metrics] = useState<Metric[]>(mockMetrics);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [dashboards, setDashboards] = useState<Dashboard[]>(mockDashboards);
  const [logEntries] = useState<LogEntry[]>(mockLogEntries);
  const [performanceInsights, setPerformanceInsights] = useState<PerformanceInsight[]>(mockPerformanceInsights);

  const updateAlertStatus = (id: string, status: AlertStatus, acknowledgedBy?: string) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        const updates: Partial<Alert> = { status };
        if (status === 'Acknowledged' && acknowledgedBy) {
          updates.acknowledgedAt = new Date().toISOString();
          updates.acknowledgedBy = acknowledgedBy;
        } else if (status === 'Resolved') {
          updates.resolvedAt = new Date().toISOString();
        }
        return { ...alert, ...updates };
      }
      return alert;
    }));
  };

  const updateInsightStatus = (id: string, status: 'New' | 'Acknowledged' | 'Implemented' | 'Dismissed') => {
    setPerformanceInsights(performanceInsights.map(insight => 
      insight.id === id ? { ...insight, status } : insight
    ));
  };

  const createDashboard = (newDashboard: Omit<Dashboard, 'id' | 'created' | 'lastModified'>) => {
    const dashboard: Dashboard = {
      ...newDashboard,
      id: `dash-${Date.now()}`,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setDashboards([...dashboards, dashboard]);
  };

  const updateDashboard = (id: string, updates: Partial<Dashboard>) => {
    setDashboards(dashboards.map(dashboard => 
      dashboard.id === id 
        ? { ...dashboard, ...updates, lastModified: new Date().toISOString() }
        : dashboard
    ));
  };

  const deleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(dashboard => dashboard.id !== id));
  };

  return (
    <MonitoringContext.Provider value={{
      monitoringMetrics,
      metrics,
      alerts,
      dashboards,
      logEntries,
      performanceInsights,
      updateAlertStatus,
      updateInsightStatus,
      createDashboard,
      updateDashboard,
      deleteDashboard
    }}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoringContext = () => {
  const context = useContext(MonitoringContext);
  if (context === undefined) {
    throw new Error('useMonitoringContext must be used within a MonitoringProvider');
  }
  return context;
};