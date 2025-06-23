import React from 'react';
import { SecurityCenterStatus, ComplianceStatus, ThreatStatus, VulnerabilityStatus } from '../context/SecurityContext';
import { CheckCircle, XCircle, AlertTriangle, Clock, Shield, Eye, AlertCircle, Info } from 'lucide-react';

interface SecurityStatusBadgeProps {
  status: SecurityCenterStatus | ComplianceStatus | ThreatStatus | VulnerabilityStatus | string;
  type?: 'security' | 'compliance' | 'threat' | 'vulnerability' | 'recommendation' | 'policy';
}

const SecurityStatusBadge: React.FC<SecurityStatusBadgeProps> = ({ status, type = 'security' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      // Security Center Status
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

      // Compliance Status
      case 'Compliant':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle size={16} className="text-green-600 mr-1.5" />
        };
      case 'Non-Compliant':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <XCircle size={16} className="text-red-600 mr-1.5" />
        };
      case 'Partially Compliant':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: <AlertTriangle size={16} className="text-yellow-600 mr-1.5" />
        };
      case 'Not Assessed':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <Clock size={16} className="text-gray-600 mr-1.5" />
        };

      // Threat Status
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
      case 'Investigating':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Eye size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Dismissed':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <XCircle size={16} className="text-gray-600 mr-1.5" />
        };

      // Vulnerability Status
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

      // Recommendation/Policy Status
      case 'Open':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <AlertCircle size={16} className="text-red-600 mr-1.5" />
        };
      case 'In Progress':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Clock size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Enabled':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <Shield size={16} className="text-green-600 mr-1.5" />
        };
      case 'Disabled':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <XCircle size={16} className="text-gray-600 mr-1.5" />
        };
      case 'Report Only':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: <Eye size={16} className="text-yellow-600 mr-1.5" />
        };
      case 'Patched':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle size={16} className="text-green-600 mr-1.5" />
        };
      case 'Mitigated':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Shield size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Accepted Risk':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200',
          icon: <AlertTriangle size={16} className="text-purple-600 mr-1.5" />
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

export default SecurityStatusBadge;