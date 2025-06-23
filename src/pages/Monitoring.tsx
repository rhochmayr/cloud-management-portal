import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMonitoringContext } from '../context/MonitoringContext';
import { 
  Plus, RefreshCw, Filter, Download, Search, MoreHorizontal, Activity, 
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, 
  BarChart3, PieChart, LineChart, Gauge, Eye, Bell, Zap, Target,
  Server, Database, Globe, HardDrive, Network, Smartphone, Settings,
  Calendar, Users, DollarSign, Shield, FileText, Play, Pause
} from 'lucide-react';
import MonitoringStatusBadge from '../components/MonitoringStatusBadge';

const Monitoring: React.FC = () => {
  const { 
    monitoringMetrics,
    metrics,
    alerts,
    dashboards,
    logEntries,
    performanceInsights,
    updateAlertStatus,
    updateInsightStatus
  } = useMonitoringContext();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  const filteredMetrics = metrics.filter(metric => 
    metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = logEntries.filter(log => 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInsights = performanceInsights.filter(insight => 
    insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceIcon = (resourceType: string) => {
    const iconClass = "w-5 h-5";
    switch (resourceType) {
      case 'Virtual Machine':
        return <div className={`${iconClass} bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold`}>VM</div>;
      case 'SQL Database':
        return <div className={`${iconClass} bg-green-500 rounded text-white flex items-center justify-center text-xs font-bold`}>DB</div>;
      case 'Web Application':
        return <div className={`${iconClass} bg-purple-500 rounded text-white flex items-center justify-center text-xs font-bold`}>WA</div>;
      case 'Load Balancer':
        return <div className={`${iconClass} bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold`}>LB</div>;
      case 'Storage Account':
        return <div className={`${iconClass} bg-indigo-500 rounded text-white flex items-center justify-center text-xs font-bold`}>ST</div>;
      case 'Network':
        return <div className={`${iconClass} bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold`}>NT</div>;
      default:
        return <Activity size={20} className="text-blue-700" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'WARN':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'INFO':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'DEBUG':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'TRACE':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else if (unit === 'ms') {
      return `${value.toFixed(0)}ms`;
    } else if (unit === 'Mbps') {
      return `${value.toFixed(1)} Mbps`;
    } else if (unit === 'IOPS') {
      return `${value.toLocaleString()} IOPS`;
    } else {
      return `${value.toFixed(1)} ${unit}`;
    }
  };

  const getHealthPercentage = () => {
    return Math.round((monitoringMetrics.healthyResources / monitoringMetrics.totalResources) * 100);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-3xl font-bold text-green-600">{getHealthPercentage()}%</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${getHealthPercentage()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {monitoringMetrics.healthyResources} of {monitoringMetrics.totalResources} resources healthy
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600">{monitoringMetrics.activeAlerts}</p>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <Bell className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                {monitoringMetrics.criticalAlerts} critical, {monitoringMetrics.highAlerts} high priority
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-blue-600">{monitoringMetrics.averageResponseTime}ms</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">12% improvement</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-3xl font-bold text-green-600">{monitoringMetrics.uptime}%</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                99.9% SLA target
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Resource Health Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-3xl font-semibold text-green-600">
                  {monitoringMetrics.healthyResources}
                </div>
                <div className="text-sm text-gray-600">Healthy</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="text-3xl font-semibold text-yellow-600">
                  {monitoringMetrics.warningResources}
                </div>
                <div className="text-sm text-gray-600">Warning</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="text-3xl font-semibold text-red-600">
                  {monitoringMetrics.criticalResources}
                </div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-3xl font-semibold text-blue-600">
                  {monitoringMetrics.totalResources}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View all
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.filter(alert => alert.status === 'Active').slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    alert.severity === 'Critical' ? 'bg-red-100' : 
                    alert.severity === 'High' ? 'bg-orange-100' : 'bg-yellow-100'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.severity === 'Critical' ? 'text-red-600' : 
                      alert.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.resourceName}</p>
                    <p className="text-xs text-gray-400">{new Date(alert.triggeredAt).toLocaleString()}</p>
                  </div>
                  <MonitoringStatusBadge status={alert.severity} type="severity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Chart */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Key Performance Metrics</h3>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.slice(0, 4).map((metric) => (
              <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">{metric.name}</h4>
                  <MonitoringStatusBadge status={metric.status} type="metric" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatValue(metric.currentValue, metric.unit)}
                </div>
                <div className="text-xs text-gray-500 mb-3">{metric.resourceName}</div>
                <div className="h-20 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <LineChart className="mx-auto h-8 w-8 mb-1" />
                    <div className="text-xs">Chart visualization</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cost Overview</h3>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900">
                ${monitoringMetrics.totalCost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Monthly spend</div>
            </div>
            <div className="flex items-center mb-4">
              {monitoringMetrics.costTrend < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${monitoringMetrics.costTrend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(monitoringMetrics.costTrend)}% vs last month
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Compute</span>
                <span className="text-sm font-medium">$1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-medium">$567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Networking</span>
                <span className="text-sm font-medium">$234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Other</span>
                <span className="text-sm font-medium">$1,202</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Performance Insights</h3>
            <button 
              onClick={() => setActiveTab('insights')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View all
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {performanceInsights.filter(insight => insight.status === 'New').slice(0, 3).map((insight) => (
                <div key={insight.id} className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    insight.type === 'Cost Saving' ? 'bg-green-100' : 
                    insight.type === 'Performance' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <Target className={`h-4 w-4 ${
                      insight.type === 'Cost Saving' ? 'text-green-600' : 
                      insight.type === 'Performance' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                    <p className="text-xs text-gray-500">{insight.resourceName}</p>
                    {insight.estimatedSavings && (
                      <p className="text-xs text-green-600">Save ${insight.estimatedSavings}/month</p>
                    )}
                  </div>
                  <MonitoringStatusBadge status={insight.severity} type="severity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Metric
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thresholds
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredMetrics.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No metrics found.
              </td>
            </tr>
          ) : (
            filteredMetrics.map((metric) => (
              <tr key={metric.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded p-1 mr-3">
                      <BarChart3 size={18} className="text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                      <div className="text-xs text-gray-500">{metric.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatValue(metric.currentValue, metric.unit)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <MonitoringStatusBadge status={metric.status} type="metric" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{metric.resourceName}</div>
                    <div className="text-xs text-gray-400">{metric.resourceType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metric.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="text-xs">Warning: {formatValue(metric.threshold.warning, metric.unit)}</div>
                    <div className="text-xs">Critical: {formatValue(metric.threshold.critical, metric.unit)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(metric.lastUpdated).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="View details">
                      <Eye size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800" title="More actions">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAlerts = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alert
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Triggered
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAlerts.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No alerts found.
              </td>
            </tr>
          ) : (
            filteredAlerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-red-100 rounded p-1 mr-3">
                      <Bell size={18} className="text-red-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                      <div className="text-xs text-gray-500">{alert.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <MonitoringStatusBadge status={alert.severity} type="severity" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <MonitoringStatusBadge status={alert.status} type="alert" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{alert.resourceName}</div>
                    <div className="text-xs text-gray-400">{alert.resourceType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{alert.currentValue}</div>
                    <div className="text-xs text-gray-400">Threshold: {alert.threshold}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(alert.triggeredAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select
                      value={alert.status}
                      onChange={(e) => updateAlertStatus(alert.id, e.target.value as any, 'admin@company.com')}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Active">Active</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Suppressed">Suppressed</option>
                    </select>
                    <button className="text-gray-600 hover:text-gray-800" title="More actions">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDashboards = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => (
          <div key={dashboard.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{dashboard.name}</h3>
                {dashboard.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{dashboard.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{dashboard.widgets.length} widgets</span>
                <span>{dashboard.shared ? 'Shared' : 'Private'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Modified {new Date(dashboard.lastModified).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800" title="View dashboard">
                    <Eye size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800" title="Edit dashboard">
                    <Settings size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800" title="More actions">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No log entries found.
              </td>
            </tr>
          ) : (
            filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLogLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.source}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md truncate">
                    {log.message}
                  </div>
                  {log.correlationId && (
                    <div className="text-xs text-gray-400">ID: {log.correlationId}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{log.resourceName}</div>
                    <div className="text-xs text-gray-400">{log.resourceType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="View details">
                      <Eye size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800" title="More actions">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderInsights = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Insight
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estimated Impact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredInsights.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No performance insights found.
              </td>
            </tr>
          ) : (
            filteredInsights.map((insight) => (
              <tr key={insight.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded p-1 mr-3">
                      <Zap size={18} className="text-purple-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                      <div className="text-xs text-gray-500">{insight.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    insight.type === 'Cost Saving' ? 'bg-green-100 text-green-800' :
                    insight.type === 'Performance' ? 'bg-blue-100 text-blue-800' :
                    insight.type === 'Optimization' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <MonitoringStatusBadge status={insight.severity} type="severity" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{insight.resourceName}</div>
                    <div className="text-xs text-gray-400">{insight.resourceType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{insight.estimatedImpact}</div>
                    {insight.estimatedSavings && (
                      <div className="text-xs text-green-600">Save ${insight.estimatedSavings}/month</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <MonitoringStatusBadge status={insight.status} type="insight" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select
                      value={insight.status}
                      onChange={(e) => updateInsightStatus(insight.id, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="New">New</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Implemented">Implemented</option>
                      <option value="Dismissed">Dismissed</option>
                    </select>
                    <button className="text-gray-600 hover:text-gray-800" title="More actions">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'metrics':
        return renderMetrics();
      case 'alerts':
        return renderAlerts();
      case 'dashboards':
        return renderDashboards();
      case 'logs':
        return renderLogs();
      case 'insights':
        return renderInsights();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Monitoring</h1>
          <p className="text-gray-600">Monitor performance, health, and insights across your infrastructure</p>
        </div>
        <button 
          onClick={() => navigate('/create-dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Dashboard
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'overview' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity size={16} className="mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'metrics' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 size={16} className="mr-2" />
              Metrics ({metrics.length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'alerts' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell size={16} className="mr-2" />
              Alerts ({monitoringMetrics.totalAlerts})
            </button>
            <button
              onClick={() => setActiveTab('dashboards')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'dashboards' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PieChart size={16} className="mr-2" />
              Dashboards ({dashboards.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'logs' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={16} className="mr-2" />
              Logs
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'insights' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Zap size={16} className="mr-2" />
              Insights ({performanceInsights.length})
            </button>
          </div>
        </div>

        {activeTab !== 'overview' && activeTab !== 'dashboards' && (
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                placeholder="Filter monitoring data..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="border border-gray-300 rounded-md px-3 py-2 flex items-center text-gray-700 hover:bg-gray-50">
                <Filter size={18} className="mr-2" />
                <span>Filter</span>
              </button>
              <button className="border border-gray-300 rounded-md px-3 py-2 flex items-center text-gray-700 hover:bg-gray-50">
                <RefreshCw size={18} className="mr-2" />
                <span>Refresh</span>
              </button>
              <button className="border border-gray-300 rounded-md px-3 py-2 flex items-center text-gray-700 hover:bg-gray-50">
                <Download size={18} className="mr-2" />
                <span>Export</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="p-6">
          {renderTabContent()}
        </div>
        
        {activeTab !== 'overview' && activeTab !== 'dashboards' && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
            {activeTab === 'metrics' && `Showing ${filteredMetrics.length} of ${metrics.length} metrics`}
            {activeTab === 'alerts' && `Showing ${filteredAlerts.length} of ${alerts.length} alerts`}
            {activeTab === 'logs' && `Showing ${filteredLogs.length} of ${logEntries.length} log entries`}
            {activeTab === 'insights' && `Showing ${filteredInsights.length} of ${performanceInsights.length} insights`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitoring;