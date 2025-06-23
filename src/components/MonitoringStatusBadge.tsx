import React from 'react';
import { MetricStatus, AlertStatus, AlertSeverity } from '../context/MonitoringContext';
import { CheckCircle, XCircle, AlertTriangle, Clock, Eye, EyeOff, Zap, Info, AlertCircle } from 'lucide-react';

interface MonitoringStatusBadgeProps {
  status: MetricStatus | AlertStatus | AlertSeverity | string;
  type?: 'metric' | 'alert' | 'severity' | 'insight';
}

const MonitoringStatusBadge: React.FC<MonitoringStatusBadgeProps> = ({ status, type = 'metric' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      // Metric Status
      case 'Healthy':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle size={16} className="text-green-600 mr-1.5" />
        };
      case 'Warning':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: <AlertTriangle size={16} className="text-yellow-600 mr-1.5" />
        };
      case 'Critical':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <XCircle size={16} className="text-red-600 mr-1.5" />
        };
      case 'Unknown':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <AlertCircle size={16} className="text-gray-600 mr-1.5" />
        };

      // Alert Status
      case 'Active':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <AlertCircle size={16} className="text-red-600 mr-1.5" />
        };
      case 'Resolved':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle size={16} className="text-green-600 mr-1.5" />
        };
      case 'Acknowledged':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Eye size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Suppressed':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <EyeOff size={16} className="text-gray-600 mr-1.5" />
        };

      // Alert Severity
      case 'High':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-200',
          icon: <AlertTriangle size={16} className="text-orange-600 mr-1.5" />
        };
      case 'Medium':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: <AlertTriangle size={16} className="text-yellow-600 mr-1.5" />
        };
      case 'Low':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Info size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Informational':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <Info size={16} className="text-gray-600 mr-1.5" />
        };

      // Insight Status
      case 'New':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Zap size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Implemented':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle size={16} className="text-green-600 mr-1.5" />
        };
      case 'Dismissed':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <XCircle size={16} className="text-gray-600 mr-1.5" />
        };

      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: null
        };
    }
  };

  const { bgColor, textColor, borderColor, icon } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} border ${borderColor}`}>
      {icon}
      {status}
    </span>
  );
};

export default MonitoringStatusBadge;