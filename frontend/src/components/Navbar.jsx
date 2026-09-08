import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Bell, LogOut, User, LayoutDashboard, HeartHandshake, Truck, Building, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import NotificationDrawer from './NotificationDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      // quiet fail
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'DONOR': return '/donor/dashboard';
      case 'VOLUNTEER': return '/volunteer/dashboard';
      case 'ORGANIZATION': return '/org/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Food<span className="text-emerald-600">Loop</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold tracking-wider -mt-1 uppercase">
                  Waste-Free Community
                </span>
              </div>
            </Link>

            {/* Public Links */}
            <div className="hidden md:flex items-center gap-7 font-medium text-sm text-slate-600">
              <Link to="/" className={`hover:text-emerald-600 transition-colors ${location.pathname === '/' ? 'text-emerald-600 font-bold' : ''}`}>Home</Link>
              <Link to="/about" className={`hover:text-emerald-600 transition-colors ${location.pathname === '/about' ? 'text-emerald-600 font-bold' : ''}`}>How It Works</Link>
              <Link to="/impact" className={`hover:text-emerald-600 transition-colors ${location.pathname === '/impact' ? 'text-emerald-600 font-bold' : ''}`}>Impact</Link>
              <Link to="/food-safety" className={`hover:text-emerald-600 transition-colors ${location.pathname === '/food-safety' ? 'text-emerald-600 font-bold' : ''}`}>Food Safety</Link>
            </div>

            {/* User Controls */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* Dashboard Quick Access Button */}
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200 hover:bg-emerald-100 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Notifications Bell */}
                  <button
                    onClick={() => setIsNotifOpen(true)}
                    className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-all"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Profile & Logout */}
                  <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-xs font-bold text-slate-800">{user.name}</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">{user.role}</span>
                    </div>
                    <button
                      onClick={() => { logout(); navigate('/login'); }}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />
    </>
  );
}
