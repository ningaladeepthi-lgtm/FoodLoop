import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import StatusBadge from '../components/StatusBadge';
import { 
  Users, Package, ShieldAlert, BarChart3, 
  CheckCircle2, AlertTriangle, UserCheck, UserX, Search 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, donRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/users'),
        API.get('/donations')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDonations(donRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/toggle-status`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const pieData = stats ? [
    { name: 'Delivered', value: stats.deliveredDonations, color: '#10b981' },
    { name: 'Active', value: stats.activeDonations, color: '#3b82f6' },
    { name: 'Expired', value: stats.expiredDonations, color: '#ef4444' },
    { name: 'Spoiled', value: stats.spoiledDonations, color: '#1e293b' },
  ] : [];

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-4rem)]">
      <Sidebar role="ADMIN" />

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-emerald-400" />
              <span>Admin System Oversight</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Platform metrics, user role management & full donation auditing.</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase text-emerald-400">Meals Rescued</span>
            <div className="text-3xl font-extrabold text-white">{stats?.mealsRescued || 0}</div>
          </div>
        </div>

        {/* Stats Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Total Users</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalUsers}</div>
              <span className="text-[10px] text-slate-400">{stats.totalDonors} Donors • {stats.totalVolunteers} Vols</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Total Donations</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.totalDonations}</div>
              <span className="text-[10px] text-slate-400">{stats.activeDonations} Active</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Food Delivered</span>
              <div className="text-2xl font-extrabold text-teal-600 mt-1">{stats.deliveredDonations}</div>
              <span className="text-[10px] text-teal-600 font-bold">{stats.foodSavedKg} kg Saved</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Expired Food</span>
              <div className="text-2xl font-extrabold text-red-600 mt-1">{stats.expiredDonations}</div>
              <span className="text-[10px] text-red-500 font-semibold">Auto-locked</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Spoiled Incidents</span>
              <div className="text-2xl font-extrabold text-slate-800 mt-1">{stats.spoiledDonations}</div>
              <span className="text-[10px] text-slate-500">Reported physically</span>
            </div>
          </div>
        )}

        {/* User Management Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">User Account Management</h2>
              <p className="text-xs text-slate-500">Search users, filter by role, and activate/deactivate accounts.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="DONOR">Donor</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="ORGANIZATION">Organization</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">User ID & Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">#{u.id} {u.name}</div>
                      <div className="text-xs text-slate-400">{u.phone}</div>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase ${
                        u.role === 'DONOR' ? 'bg-emerald-100 text-emerald-800' :
                        u.role === 'VOLUNTEER' ? 'bg-teal-100 text-teal-800' :
                        u.role === 'ORGANIZATION' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-900'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.active ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          u.active ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
