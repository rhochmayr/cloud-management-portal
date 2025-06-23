import React from 'react';
import { VMStatus } from '../context/VMContext';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: VMStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: VMStatus) => {
    switch (status) {
      case 'Running':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle size={16} className="text-green-600 mr-1.5" />
        };
      case 'Stopped':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <XCircle size={16} className="text-red-600 mr-1.5" />
        };
      case 'Failed':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: <AlertCircle size={16} className="text-yellow-600 mr-1.5" />
        };
      case 'Creating':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Clock size={16} className="text-blue-600 mr-1.5" />
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

export default StatusBadge;