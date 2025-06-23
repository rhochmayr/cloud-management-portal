import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSecurityContext } from '../context/SecurityContext';
import { 
  Plus, RefreshCw, Filter, Download, Search, MoreHorizontal, Shield, 
  AlertTriangle, CheckCircle, Eye, Settings, TrendingUp, Users, 
  Lock, FileText, Activity, Bell, Zap, Target, Globe, Database,
  Server, Network, HardDrive, Smartphone, Key, UserCheck, AlertCircle
} from 'lucide-react';
import SecurityStatusBadge from '../components/SecurityStatusBadge';

const Security: React.FC = () => {
  const { 
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
  } = useSecurityContext();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const filteredRecommendations = recommendations.filter(rec => 
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = securityAlerts.filter(alert => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVulnerabilities = vulnerabilities.filter(vuln => 
    vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vuln.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vuln.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIdentityRisks = identityRisks.filter(risk => 
    risk.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.userPrincipalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPolicies = securityPolicies.filter(policy => 
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSecurityIcon = (category: string) => {
    const iconClass = "w-5 h-5";
    switch (category) {
      case 'Identity':
        return <div className={`${iconClass} bg-blue-500 rounded text-white flex items-center justify-center text-xs font-bold`}>ID</div>;
      case 'Network':
        return <div className={`${iconClass} bg-green-500 rounded text-white flex items-center justify-center text-xs font-bold`}>NT</div>;
      case 'Data':
        return <div className={`${iconClass} bg-purple-500 rounded text-white flex items-center justify-center text-xs font-bold`}>DA</div>;
      case 'Compute':
        return <div className={`${iconClass} bg-orange-500 rounded text-white flex items-center justify-center text-xs font-bold`}>CP</div>;
      case 'Storage':
        return <div className={`${iconClass} bg-indigo-500 rounded text-white flex items-center justify-center text-xs font-bold`}>ST</div>;
      case 'Application':
        return <div className={`${iconClass} bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold`}>AP</div>;
      default:
        return <Shield size={20} className="text-blue-700" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Security Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Security Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(securityMetrics.securityScore)}`}>
                  {securityMetrics.securityScore}%
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${securityMetrics.securityScore >= 80 ? 'bg-green-500' : securityMetrics.securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${securityMetrics.securityScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Based on security recommendations and compliance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Threats</p>
                <p className="text-3xl font-bold text-red-600">{securityMetrics.activeThreats}</p>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                {securityMetrics.resolvedThreats} resolved this month
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Vulnerabilities</p>
                <p className="text-3xl font-bold text-orange-600">{securityMetrics.criticalVulnerabilities}</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                {securityMetrics.totalVulnerabilities} total vulnerabilities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Categories */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Security Categories</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-blue-100 rounded p-2 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Identity Score</p>
                <p className={`text-xl font-bold ${getScoreColor(securityMetrics.identityScore)}`}>
                  {securityMetrics.identityScore}%
                </p>
                <p className="text-xs text-gray-500">{securityMetrics.identityRisks} at-risk users</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-green-100 rounded p-2 mr-4">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Device Score</p>
                <p className={`text-xl font-bold ${getScoreColor(securityMetrics.deviceScore)}`}>
                  {securityMetrics.deviceScore}%
                </p>
                <p className="text-xs text-gray-500">Device compliance</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-purple-100 rounded p-2 mr-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">App Score</p>
                <p className={`text-xl font-bold ${getScoreColor(securityMetrics.appScore)}`}>
                  {securityMetrics.appScore}%
                </p>
                <p className="text-xs text-gray-500">Application security</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-indigo-100 rounded p-2 mr-4">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Data Score</p>
                <p className={`text-xl font-bold ${getScoreColor(securityMetrics.dataScore)}`}>
                  {securityMetrics.dataScore}%
                </p>
                <p className="text-xs text-gray-500">Data protection</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-orange-100 rounded p-2 mr-4">
                <Server className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Infrastructure Score</p>
                <p className={`text-xl font-bold ${getScoreColor(securityMetrics.infrastructureScore)}`}>
                  {securityMetrics.infrastructureScore}%
                </p>
                <p className="text-xs text-gray-500">Infrastructure security</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="bg-red-100 rounded p-2 mr-4">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Compliance Score</p>
                <p className={`text-xl font-bold ${getScoreColor(securityMetrics.complianceScore)}`}>
                  {securityMetrics.complianceScore}%
                </p>
                <p className="text-xs text-gray-500">Regulatory compliance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Security Alerts</h3>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View all
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {securityAlerts.slice(0, 3).map((alert) => (
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
                    <p className="text-xs text-gray-400">{new Date(alert.detectedAt).toLocaleString()}</p>
                  </div>
                  <SecurityStatusBadge status={alert.status} type="threat" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Top Recommendations</h3>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View all
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recommendations.filter(rec => rec.status === 'Open').slice(0, 3).map((rec) => (
                <div key={rec.id} className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    rec.severity === 'Critical' ? 'bg-red-100' : 
                    rec.severity === 'High' ? 'bg-orange-100' : 'bg-yellow-100'
                  }`}>
                    <Target className={`h-4 w-4 ${
                      rec.severity === 'Critical' ? 'text-red-600' : 
                      rec.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                    <p className="text-xs text-gray-500">{rec.resourceName}</p>
                    <p className="text-xs text-gray-400">{rec.category}</p>
                  </div>
                  <SecurityStatusBadge status={rec.severity} type="recommendation" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recommendation
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
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
          {filteredRecommendations.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No security recommendations found.
              </td>
            </tr>
          ) : (
            filteredRecommendations.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded p-1 mr-3">
                      {getSecurityIcon(rec.category)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rec.title}</div>
                      <div className="text-xs text-gray-500">{rec.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SecurityStatusBadge status={rec.severity} type="recommendation" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rec.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{rec.resourceName}</div>
                    <div className="text-xs text-gray-400">{rec.resourceType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SecurityStatusBadge status={rec.status} type="recommendation" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(rec.lastUpdated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select
                      value={rec.status}
                      onChange={(e) => updateRecommendationStatus(rec.id, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
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
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detected
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
                No security alerts found.
              </td>
            </tr>
          ) : (
            filteredAlerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-red-100 rounded p-1 mr-3">
                      <AlertTriangle size={18} className="text-red-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                      <div className="text-xs text-gray-500">{alert.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SecurityStatusBadge status={alert.severity} type="threat" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{alert.resourceName}</div>
                    <div className="text-xs text-gray-400">{alert.resourceType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SecurityStatusBadge status={alert.status} type="threat" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(alert.detectedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select
                      value={alert.status}
                      onChange={(e) => updateAlertStatus(alert.id, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Active">Active</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Resolved">Resolved</option>
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

  const renderVulnerabilities = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vulnerability
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CVSS Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
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
          {filteredVulnerabilities.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No vulnerabilities found.
              </td>
            </tr>
          ) : (
            filteredVulnerabilities.map((vuln) => (
              <tr key={vuln.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-orange-100 rounded p-1 mr-3">
                      <Zap size={18} className="text-orange-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vuln.title}</div>
                      <div className="text-xs text-gray-500">{vuln.cveId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SecurityStatusBadge status={vuln.severity} type="vulnerability" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`font-medium ${
                    vuln.cvssScore >= 9 ? 'text-red-600' :
                    vuln.cvssScore >= 7 ? 'text-orange-600' :
                    vuln.cvssScore >= 4 ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {vuln.cvssScore}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vuln.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{vuln.resourceName}</div>
                    <div className="text-xs text-gray-400">{vuln.resourceType}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SecurityStatusBadge status={vuln.status} type="vulnerability" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select
                      value={vuln.status}
                      onChange={(e) => updateVulnerabilityStatus(vuln.id, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Open">Open</option>
                      <option value="Patched">Patched</option>
                      <option value="Mitigated">Mitigated</option>
                      <option value="Accepted Risk">Accepted Risk</option>
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

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceStandards.map((standard) => (
          <div key={standard.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{standard.name}</h3>
                <SecurityStatusBadge status={standard.status} type="compliance" />
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Compliance Score</span>
                  <span className={`text-lg font-bold ${getScoreColor(standard.score)}`}>
                    {standard.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${standard.score >= 80 ? 'bg-green-500' : standard.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${standard.score}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Passed Controls</span>
                  <span className="font-medium text-green-600">{standard.passedControls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Failed Controls</span>
                  <span className="font-medium text-red-600">{standard.failedControls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Controls</span>
                  <span className="font-medium">{standard.totalControls}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  <div>Last Assessment: {new Date(standard.lastAssessment).toLocaleDateString()}</div>
                  <div>Next Assessment: {new Date(standard.nextAssessment).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIdentity = () => (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk State
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Detail
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Detection
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIdentityRisks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No identity risks found.
                </td>
              </tr>
            ) : (
              filteredIdentityRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded p-1 mr-3">
                        <UserCheck size={18} className="text-blue-700" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{risk.displayName}</div>
                        <div className="text-xs text-gray-500">{risk.userPrincipalName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SecurityStatusBadge status={risk.riskLevel} type="vulnerability" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SecurityStatusBadge status={risk.riskState} type="threat" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {risk.riskDetail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {risk.location || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(risk.lastRiskDetection).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <select
                        value={risk.riskState}
                        onChange={(e) => updateIdentityRiskState(risk.id, e.target.value as any)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="At Risk">At Risk</option>
                        <option value="Confirmed Safe">Confirmed Safe</option>
                        <option value="Confirmed Compromised">Confirmed Compromised</option>
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
    </div>
  );

  const renderPolicies = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Policy
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scope
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned Users
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Modified
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPolicies.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No security policies found.
              </td>
            </tr>
          ) : (
            filteredPolicies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded p-1 mr-3">
                      <Shield size={18} className="text-green-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                      <div className="text-xs text-gray-500">{policy.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {policy.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SecurityStatusBadge status={policy.status} type="policy" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {policy.scope}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{policy.assignedUsers} users</div>
                    <div className="text-xs text-gray-400">{policy.assignedGroups} groups</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(policy.lastModified).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <select
                      value={policy.status}
                      onChange={(e) => updatePolicyStatus(policy.id, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Enabled">Enabled</option>
                      <option value="Disabled">Disabled</option>
                      <option value="Report Only">Report Only</option>
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
      case 'recommendations':
        return renderRecommendations();
      case 'alerts':
        return renderAlerts();
      case 'vulnerabilities':
        return renderVulnerabilities();
      case 'compliance':
        return renderCompliance();
      case 'identity':
        return renderIdentity();
      case 'policies':
        return renderPolicies();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Security Center</h1>
          <p className="text-gray-600">Monitor and manage your security posture</p>
        </div>
        <button 
          onClick={() => navigate('/security-policies')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Policy
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
              <Shield size={16} className="mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'recommendations' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target size={16} className="mr-2" />
              Recommendations ({securityMetrics.totalRecommendations})
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
              Security Alerts ({securityMetrics.totalAlerts})
            </button>
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'vulnerabilities' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Zap size={16} className="mr-2" />
              Vulnerabilities ({securityMetrics.totalVulnerabilities})
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'compliance' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={16} className="mr-2" />
              Compliance
            </button>
            <button
              onClick={() => setActiveTab('identity')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'identity' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={16} className="mr-2" />
              Identity Risks ({securityMetrics.identityRisks})
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'policies' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Lock size={16} className="mr-2" />
              Security Policies ({securityMetrics.securityPolicies})
            </button>
          </div>
        </div>

        {activeTab !== 'overview' && activeTab !== 'compliance' && (
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                placeholder="Filter security items..."
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
        
        {activeTab !== 'overview' && activeTab !== 'compliance' && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
            {activeTab === 'recommendations' && `Showing ${filteredRecommendations.length} of ${recommendations.length} recommendations`}
            {activeTab === 'alerts' && `Showing ${filteredAlerts.length} of ${securityAlerts.length} security alerts`}
            {activeTab === 'vulnerabilities' && `Showing ${filteredVulnerabilities.length} of ${vulnerabilities.length} vulnerabilities`}
            {activeTab === 'identity' && `Showing ${filteredIdentityRisks.length} of ${identityRisks.length} identity risks`}
            {activeTab === 'policies' && `Showing ${filteredPolicies.length} of ${securityPolicies.length} security policies`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;