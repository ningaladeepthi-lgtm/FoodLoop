import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import StatusBadge from '../components/StatusBadge';
import SpoilageReportModal from '../components/SpoilageReportModal';
import { 
  Package, PlusCircle, Clock, AlertOctagon, CheckCircle2, 
  Utensils, Calendar, MapPin, Eye, AlertTriangle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpoilageDonation, setSelectedSpoilageDonation] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const res = await API.get('/donations/my-donations');
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalDonations = donations.length;
  const activeDonations = donations.filter(d => ['AVAILABLE', 'CLAIMED', 'PICKUP_ASSIGNED', 'PICKED_UP'].includes(d.status)).length;
  const totalServings = donations.reduce((sum, d) => sum + (d.servings || 0), 0);
  const totalKg = donations.reduce((sum, d) => sum + (d.quantity || 0), 0);
  const expiringSoonCount = donations.filter(d => d.urgencyLevel === 'EXPIRING_SOON' || d.urgencyLevel === 'URGENT').length;

  const filteredDonations = donations.filter(d => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['AVAILABLE', 'CLAIMED', 'PICKUP_ASSIGNED', 'PICKED_UP'].includes(d.status);
    if (filter === 'EXPIRED') return d.status === 'EXPIRED';
    if (filter === 'SPOILED') return d.status === 'SPOILED';
    if (filter === 'DELIVERED') return d.status === 'DELIVERED';
    return true;
  });

  const chartData = [
    { name: 'Mon', kg: 15 },
    { name: 'Tue', kg: 24 },
    { name: 'Wed', kg: 18 },
    { name: 'Thu', kg: 32 },
    { name: 'Fri', kg: 45 },
    { name: 'Sat', kg: 60 },
    { name: 'Sun', kg: totalKg > 0 ? Math.round(totalKg) : 28 },
  ];

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-4rem)]">
      <Sidebar role="DONOR" />

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {user?.name}!</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your surplus food donations & monitor remaining usable time.</p>
          </div>
          <Link
            to="/donor/create-donation"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Donation</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase text-slate-500">Total Donations</span>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">{totalDonations}</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Lifetime records</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase text-slate-500">Active Pipeline</span>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-blue-600 mt-2">{activeDonations}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">In pickup/delivery</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase text-slate-500">Meals Rescued</span>
              <Utensils className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl font-extrabold text-teal-700 mt-2">{totalServings}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Estimated servings</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase text-slate-500">Expiring Urgent</span>
              <AlertOctagon className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-extrabold text-orange-600 mt-2">{expiringSoonCount}</div>
            <span className="text-[11px] text-orange-600 font-semibold mt-1 block">&lt; 6h usable time</span>
          </div>
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Food Donated Over Time (kg)</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="kg" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quick Guidelines</h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 border border-emerald-200">
                🟢 <strong>Usable Countdown:</strong> Food remaining &gt; 6h is FRESH, 2–6h is EXPIRING SOON, &lt; 2h is URGENT.
              </div>
              <div className="p-3 bg-red-50 rounded-xl text-red-900 border border-red-200">
                🔴 <strong>Expiry & Spoilage:</strong> Passed expiry auto-locks to EXPIRED. Physical damage or aroma changes can be reported as SPOILED.
              </div>
            </div>
          </div>
        </div>

        {/* My Donations Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">My Donations Registry</h3>
              <p className="text-xs text-slate-500">Live status and usable time tracking for all your food posts.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              {['ALL', 'ACTIVE', 'DELIVERED', 'EXPIRED', 'SPOILED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${filter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading donations...</div>
          ) : filteredDonations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Package className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-sm font-semibold">No donations found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Donation ID & Food</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Usable Countdown</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Assigned Partner</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {d.imageUrl && (
                            <img src={d.imageUrl} alt={d.foodType} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                          )}
                          <div>
                            <div className="font-bold text-slate-900 text-base">#{d.id} {d.foodType}</div>
                            <span className="text-xs text-slate-400">{d.foodCategory} • {d.dietaryType}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-900">{d.quantity} {d.unit}</span>
                        <span className="text-xs text-slate-400 block">({d.servings} servings)</span>
                      </td>

                      <td className="p-4">
                        <CountdownTimer expiryAt={d.expiryAt} status={d.status} />
                      </td>

                      <td className="p-4">
                        <StatusBadge status={d.status} />
                      </td>

                      <td className="p-4 text-xs">
                        {d.volunteer ? (
                          <div>
                            <span className="font-bold text-slate-800">🚴 {d.volunteer.name}</span>
                            {d.organization && <span className="block text-slate-400">➡️ {d.organization.organizationName || d.organization.name}</span>}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        {d.status !== 'EXPIRED' && d.status !== 'SPOILED' && d.status !== 'DELIVERED' && (
                          <button
                            onClick={() => setSelectedSpoilageDonation(d)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200 transition-all"
                          >
                            Report Spoiled
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      <SpoilageReportModal
        donation={selectedSpoilageDonation}
        isOpen={!!selectedSpoilageDonation}
        onClose={() => setSelectedSpoilageDonation(null)}
        onSuccess={fetchMyDonations}
      />
    </div>
  );
}
