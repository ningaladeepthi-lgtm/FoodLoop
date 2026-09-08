/**
 * Calculate live countdown remaining string: "01h 24m 32s"
 */
export function calculateRemainingTime(expiryAt) {
  if (!expiryAt) return { display: 'No Expiry', seconds: 0, level: 'FRESH' };

  const now = new Date().getTime();
  const target = new Date(expiryAt).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { display: 'EXPIRED', seconds: 0, level: 'EXPIRED' };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor(diff / (1000 * 60 * 60));

  let display = '';
  if (hours > 0) {
    display += `${hours}h `;
  }
  display += `${minutes}m ${seconds}s`;

  // Determine urgency level
  let level = 'FRESH';
  const totalMinutes = Math.floor(diff / (1000 * 60));
  if (totalMinutes <= 120) {
    level = 'URGENT';
  } else if (totalMinutes <= 360) {
    level = 'EXPIRING_SOON';
  }

  return { display, seconds: Math.floor(diff / 1000), level };
}

/**
 * Returns Tailwind CSS color classes for Urgency Levels
 */
export function getUrgencyBadgeColor(level) {
  switch (level) {
    case 'FRESH':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'EXPIRING_SOON':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'URGENT':
      return 'bg-orange-100 text-orange-800 border-orange-400 animate-pulse-fast';
    case 'EXPIRED':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}

/**
 * Returns Tailwind CSS badge color for Donation Statuses
 */
export function getStatusBadgeColor(status) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-emerald-500 text-white';
    case 'CLAIMED':
    case 'PICKUP_ASSIGNED':
      return 'bg-blue-600 text-white';
    case 'PICKED_UP':
      return 'bg-indigo-600 text-white';
    case 'DELIVERED':
      return 'bg-green-700 text-white';
    case 'EXPIRED':
      return 'bg-red-600 text-white';
    case 'SPOILED':
      return 'bg-gray-900 text-white';
    case 'CANCELLED':
      return 'bg-gray-400 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
