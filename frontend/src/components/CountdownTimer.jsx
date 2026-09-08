import React, { useState, useEffect } from 'react';
import { calculateRemainingTime, getUrgencyBadgeColor } from '../utils/dateUtils';
import { Clock, AlertTriangle } from 'lucide-react';

export default function CountdownTimer({ expiryAt, status }) {
  const [timer, setTimer] = useState(() => calculateRemainingTime(expiryAt));

  useEffect(() => {
    if (status === 'EXPIRED' || status === 'SPOILED' || status === 'DELIVERED') {
      return;
    }

    const interval = setInterval(() => {
      const updated = calculateRemainingTime(expiryAt);
      setTimer(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryAt, status]);

  if (status === 'EXPIRED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300">
        <Clock className="w-3.5 h-3.5" /> EXPIRED
      </span>
    );
  }

  if (status === 'SPOILED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-900 text-white">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> SPOILED
      </span>
    );
  }

  const badgeColor = getUrgencyBadgeColor(timer.level);

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
      <Clock className="w-3.5 h-3.5" />
      {timer.display}
    </span>
  );
}
