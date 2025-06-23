import React, { useState } from 'react';
import { useBillingContext } from '../context/BillingContext';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, Download, 
  CreditCard, AlertTriangle, Target, Lightbulb, BarChart3, 
  PieChart, FileText, Settings, Plus, Filter, RefreshCw,
  Search, MoreHorizontal, CheckCircle, XCircle, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Server, Database,
  HardDrive, Network, Shield, Globe, Eye, Edit, Trash2
} from 'lucide-react';

const Billing: React.FC = () => {
  const { 
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
    updateOptimizationStatus,
    downloadInvoice
  } = useBillingContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Successful':
      case 'Under Budget':
      case 'Active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending':
      case 'Near Limit':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Overdue':
      case 'Failed':
      case 'Over Budget':
      case 'Expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Draft':
      case 'Inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getServiceIcon = (category: string) => {
    const iconClass = "w-5 h-5";
    switch (category) {
      case 'Compute':
        return <Server className={iconClass} />;
      case 'Database':
        return <Database className={iconClass} />;
      case 'Storage':
        return <HardDrive className={iconClass} />;
      case 'Networking':
        return <Network className={iconClass} />;
      case 'Security':
        return <Shield className={iconClass} />;
      default:
        return <Globe className={iconClass} />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(billingMetrics.currentMonthCost)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {billingMetrics.monthlyTrend < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${billingMetrics.monthlyTrend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(billingMetrics.monthlyTrend)} vs last month
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Forecasted Cost</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(billingMetrics.forecastedCost)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Based on current usage trends
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                <p className="text-3xl font-bold text-gray-900">
                  {billingMetrics.budgetUtilization.toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    billingMetrics.budgetUtilization > 90 ? 'bg-red-500' :
                    billingMetrics.budgetUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(billingMetrics.budgetUtilization, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {formatCurrency(billingMetrics.currentMonthCost)} of {formatCurrency(billingMetrics.totalBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Year to Date</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(billingMetrics.yearToDateCost)}
                </p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Average: {formatCurrency(billingMetrics.averageDailyCost)}/day
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Trend Chart */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Cost Trends</h3>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="Current">Current Month</option>
              <option value="Previous">Previous Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last Year">Last Year</option>
            </select>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 mb-4" />
              <div className="text-lg font-medium">Daily Cost Trend</div>
              <div className="text-sm">Interactive chart showing daily spending patterns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Breakdown and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Top Services by Cost</h3>
            <button 
              onClick={() => setActiveTab('services')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View all
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {serviceCosts.slice(0, 5).map((service) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded p-2 mr-3">
                      {getServiceIcon(service.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.service}</p>
                      <p className="text-xs text-gray-500">{service.usage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(service.currentCost)}
                    </p>
                    <div className="flex items-center">
                      {service.trend < 0 ? (
                        <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${service.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(service.trend)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Cost Alerts</h3>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View all
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {costAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start">
                  <div className={`rounded-full p-2 mr-3 ${
                    alert.severity === 'Critical' ? 'bg-red-100' : 
                    alert.severity === 'High' ? 'bg-orange-100' : 
                    alert.severity === 'Medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.severity === 'Critical' ? 'text-red-600' : 
                      alert.severity === 'High' ? 'text-orange-600' : 
                      alert.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(alert.created).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    alert.triggered ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200'
                  }`}>
                    {alert.triggered ? 'Active' : 'Normal'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Cost
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Previous Cost
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trend
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {serviceCosts.map((service) => (
            <tr key={service.service} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded p-1 mr-3">
                    {getServiceIcon(service.category)}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{service.service}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(service.currentCost)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(service.previousCost)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {service.trend < 0 ? (
                    <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${service.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(service.trend)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.usage}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBudgets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Budget Management</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
          <Plus size={16} className="mr-2" />
          Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">{budget.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(budget.status)}`}>
                  {budget.status}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(budget.spent)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (budget.spent / budget.amount) > 0.9 ? 'bg-red-500' :
                      (budget.spent / budget.amount) > 0.75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatCurrency(budget.spent)}</span>
                  <span>{formatCurrency(budget.amount)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Period</span>
                  <span className="font-medium">{budget.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scope</span>
                  <span className="font-medium">{budget.scope.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alert Threshold</span>
                  <span className="font-medium">{budget.alerts.threshold}%</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <Edit size={14} className="mr-1" />
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm flex items-center">
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded p-1 mr-3">
                    <FileText size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-xs text-gray-500">Invoice</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(invoice.period.start).toLocaleDateString()} - {new Date(invoice.period.end).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(invoice.amount)} + {formatCurrency(invoice.tax)} tax
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => downloadInvoice(invoice.id)}
                    className="text-blue-600 hover:text-blue-800" 
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800" title="View details">
                    <Eye size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800" title="More actions">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOptimizations = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <div className="flex">
          <div className="mr-3 text-blue-500">
            <Lightbulb size={20} />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Cost Optimization Opportunities</p>
            <p className="mt-1">
              We've identified potential savings of {formatCurrency(costOptimizations.reduce((total, opt) => total + opt.potentialSavings, 0))} per month.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {costOptimizations.map((optimization) => (
          <div key={optimization.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-900 mr-3">{optimization.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      optimization.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      optimization.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      optimization.status === 'Implemented' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {optimization.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{optimization.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Potential Savings</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(optimization.potentialSavings)}/month
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Implementation Effort</div>
                      <div className={`text-sm font-medium ${
                        optimization.effort === 'Low' ? 'text-green-600' :
                        optimization.effort === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {optimization.effort}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Impact</div>
                      <div className={`text-sm font-medium ${
                        optimization.impact === 'High' ? 'text-green-600' :
                        optimization.impact === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        {optimization.impact}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Affected Resources</div>
                    <div className="flex flex-wrap gap-2">
                      {optimization.resources.map((resource, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-sm text-gray-500 mb-1">Recommendation</div>
                    <div className="text-sm text-gray-900">{optimization.recommendation}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Created {new Date(optimization.created).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <select
                    value={optimization.status}
                    onChange={(e) => updateOptimizationStatus(optimization.id, e.target.value as any)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Implemented">Implemented</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
            <Plus size={16} className="mr-2" />
            Add Payment Method
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded p-2 mr-3">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.type}</div>
                  </div>
                </div>
                {method.isDefault && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
              </div>
              
              {method.lastFour && (
                <div className="text-sm text-gray-600 mb-2">
                  •••• •••• •••• {method.lastFour}
                </div>
              )}
              
              {method.expiryDate && (
                <div className="text-sm text-gray-600 mb-3">
                  Expires {method.expiryDate}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(method.status)}`}>
                  {method.status}
                </span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                    {payment.invoiceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {payment.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'services':
        return renderServices();
      case 'budgets':
        return renderBudgets();
      case 'invoices':
        return renderInvoices();
      case 'optimizations':
        return renderOptimizations();
      case 'payments':
        return renderPayments();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Billing & Cost Management</h1>
          <p className="text-gray-600">Monitor spending, manage budgets, and optimize costs</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Download size={18} className="mr-2" />
            Export Report
          </button>
          <button className="border border-gray-300 rounded-md px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50">
            <Settings size={18} className="mr-2" />
            Settings
          </button>
        </div>
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
              <BarChart3 size={16} className="mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'services' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PieChart size={16} className="mr-2" />
              Services ({serviceCosts.length})
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'budgets' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target size={16} className="mr-2" />
              Budgets ({budgets.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'invoices' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={16} className="mr-2" />
              Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('optimizations')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'optimizations' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Lightbulb size={16} className="mr-2" />
              Optimizations ({costOptimizations.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'payments' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard size={16} className="mr-2" />
              Payments
            </button>
          </div>
        </div>

        {activeTab !== 'overview' && (
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                placeholder="Search billing data..."
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
      </div>
    </div>
  );
};

export default Billing;