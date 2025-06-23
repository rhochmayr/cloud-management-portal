import React from 'react';
import { VirtualNetworkStatus, NSGStatus, LoadBalancerStatus, PublicIPStatus } from '../context/NetworkingContext';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw, Trash2, Link, Unlink } from 'lucide-react';

interface NetworkingStatusBadgeProps {
  status: VirtualNetworkStatus | NSGStatus | LoadBalancerStatus | PublicIPStatus;
  type?: 'vnet' | 'nsg' | 'loadbalancer' | 'publicip';
}

const NetworkingStatusBadge: React.FC<NetworkingStatusBadgeProps> = ({ status, type = 'vnet' }) => {
  const getStatusConfig = (status: VirtualNetworkStatus | NSGStatus | LoadBalancerStatus | PublicIPStatus) => {
    switch (status) {
      case 'Available':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <CheckCircle size={16} className="text-green-600 mr-1.5" />
        };
      case 'Associated':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Link size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Unassociated':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: <Unlink size={16} className="text-gray-600 mr-1.5" />
        };
      case 'Failed':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <XCircle size={16} className="text-red-600 mr-1.5" />
        };
      case 'Creating':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: <Clock size={16} className="text-blue-600 mr-1.5" />
        };
      case 'Updating':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200',
          icon: <RefreshCw size={16} className="text-purple-600 mr-1.5" />
        };
      case 'Deleting':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <Trash2 size={16} className="text-red-600 mr-1.5" />
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

export default NetworkingStatusBadge;