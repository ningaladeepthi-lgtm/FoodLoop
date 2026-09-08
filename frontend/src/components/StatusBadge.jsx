import React from 'react';
import { getStatusBadgeColor } from '../utils/dateUtils';

export default function StatusBadge({ status }) {
  const colorClass = getStatusBadgeColor(status);
  
  const labelMap = {
    AVAILABLE: 'AVAILABLE',
    CLAIMED: 'CLAIMED',
    PICKUP_ASSIGNED: 'PICKUP ASSIGNED',
    PICKED_UP: 'IN TRANSIT',
    DELIVERED: 'DELIVERED',
    EXPIRED: 'EXPIRED',
    SPOILED: 'SPOILED',
    CANCELLED: 'CANCELLED'
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-bold tracking-wider rounded-md uppercase shadow-sm ${colorClass}`}>
      {labelMap[status] || status}
    </span>
  );
}
