import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, Package, Truck, Clock, ShieldAlert, 
  Users, BarChart3, Settings, LogOut, CheckCircle2, ListFilter, MapPin, HeartHandshake
} from 'lucide-react';

export default function Sidebar({ role }) {
  const location = useLocation();

  const getLinks = () => {
    switch (role) {
      case 'DONOR':
        return [
          { name: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
          { name: 'Create Donation', path: '/donor/create-donation', icon: PlusCircle },
          { name: 'My Donations', path: '/donor/my-donations', icon: Package },
          { name: 'Active Pickups', path: '/donor/tracking', icon: Truck },
        ];
      case 'VOLUNTEER':
        return [
          { name: 'Dashboard', path: '/volunteer/dashboard', icon: LayoutDashboard },
          { name: 'Available Pickups', path: '/volunteer/available', icon: Package },
          { name: 'My Pickups', path: '/volunteer/my-pickups', icon: Truck },
          { name: 'Active Delivery Map', path: '/volunteer/live-tracking', icon: MapPin },
        ];
      case 'ORGANIZATION':
        return [
          { name: 'Dashboard', path: '/org/dashboard', icon: LayoutDashboard },
          { name: 'Request Food', path: '/org/create-request', icon: PlusCircle },
          { name: 'My Requests', path: '/org/my-requests', icon: ListFilter },
          { name: 'Smart Food Match', path: '/org/matching', icon: HeartHandshake },
        ];
      case 'ADMIN':
        return [
          { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Food Safety Monitor', path: '/admin/food-safety', icon: ShieldAlert },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Donation Overseer', path: '/admin/donations', icon: Package },
          { name: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 shadow-xl">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {role} PORTAL
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 text-xs text-emerald-300 leading-relaxed">
          🌿 <strong>FoodLoop Guard:</strong> Real-time automated expiry & safety enforcement active.
        </div>
      </div>
    </aside>
  );
}
