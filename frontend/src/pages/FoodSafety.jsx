import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import StatusBadge from '../components/StatusBadge';
import { 
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, 
  XCircle, AlertOctagon, Filter, RefreshCw 
} from 'lucide-react';

export default function FoodSafety() {
  const [donations, setDonations] = useState([]);
  const [safetyRecords, setSafetyRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [donRes, safetyRes] = await Promise.all([
        API.get('/donations'),
        API.get('/admin/food-safety')
      ]);
      setDonations(donRes.data);
      setSafetyRecords(safetyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Grouping by Urgency & Status
  const freshDonations = donations.filter(d => d.urgencyLevel === 'FRESH' && d.status !== 'SPOILED' && d.status !== 'EXPIRED');
  const expiringSoonDonations = donations.filter(d => d.urgencyLevel === 'EXPIRING_SOON' && d.status !== 'SPOILED' && d.status !== 'EXPIRED');
  const urgentDonations = donations.filter(d => d.urgencyLevel === 'URGENT' && d.status !== 'SPOILED' && d.status !== 'EXPIRED');
  const expiredDonations = donations.filter(d => d.status === 'EXPIRED' || d.urgencyLevel === 'EXPIRED');
  const spoiledDonations = donations.filter(d => d.status === 'SPOILED');

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-4rem)]">
      <Sidebar role="ADMIN" />

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-emerald-600" />
              <span>Food Safety Monitor</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Real-time freshness monitoring, automated expiry locking, and spoilage audit logs.</p>
          </div>

          <button
            onClick={fetchData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Audit</span>
          </button>
        </div>

        {/* 4 Major Urgency Level Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* FRESH Card */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">🟢 Fresh (&gt; 6h)</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2">{freshDonations.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Optimal safety window</span>
          </div>

          {/* EXPIRING SOON Card */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs border-l-4 border-l-amber-400">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase text-amber-800 tracking-wider">🟡 Expiring Soon (2–6h)</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600 mt-2">{expiringSoonDonations.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Priority pickup suggested</span>
          </div>

          {/* URGENT Card */}
          <div className="bg-white p-5 rounded-2xl border border-orange-300 shadow-xs border-l-4 border-l-orange-500 animate-pulse-fast">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase text-orange-900 tracking-wider">🟠 Urgent (&lt; 2h)</span>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-extrabold text-orange-600 mt-2">{urgentDonations.length}</div>
            <span className="text-[11px] text-orange-700 font-bold mt-1 block">Immediate dispatch required</span>
          </div>

          {/* EXPIRED Card */}
          <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs border-l-4 border-l-red-600">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase text-red-800 tracking-wider">🔴 Expired (&lt; 0h)</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-extrabold text-red-700 mt-2">{expiredDonations.length}</div>
            <span className="text-[11px] text-red-600 font-bold mt-1 block">Distribution Locked</span>
          </div>

        </div>

        {/* SPOILED REPORTS SECTION */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold flex items-center gap-2 text-red-400">
              <AlertOctagon className="w-5 h-5" />
              <span>Physical Spoilage Incident Logs ({safetyRecords.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Reported by Donors, Volunteers, or NGOs</span>
          </div>

          {safetyRecords.length === 0 ? (
            <p className="text-xs text-slate-400">No spoilage incidents reported.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safetyRecords.map((r) => (
                <div key={r.id} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-red-400">Donation #{r.donation?.id} - {r.donation?.foodType}</span>
                      <p className="text-slate-400">Reported by: {r.reportedBy?.name}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-red-950 text-red-300 font-bold rounded-md uppercase border border-red-800">
                      {r.reason}
                    </span>
                  </div>

                  <p className="text-slate-300 bg-slate-950/60 p-2 rounded-lg italic">"{r.description || 'No description provided.'}"</p>

                  <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                    Action Taken: {r.actionTaken}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Food Safety Registry Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-lg">Complete Food Safety Registry</h3>
            <p className="text-xs text-slate-500">Live countdown timers and safety status checks across all registered food posts.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Donation ID & Food</th>
                  <th className="p-4">Donor</th>
                  <th className="p-4">Prepared At</th>
                  <th className="p-4">Expiry At</th>
                  <th className="p-4">Usable Countdown</th>
                  <th className="p-4">Donation Status</th>
                  <th className="p-4">Urgency Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">
                      #{d.id} {d.foodType}
                      <span className="block text-xs text-slate-400 font-normal">{d.quantity} {d.unit}</span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-slate-800">{d.donor?.name}</td>
                    <td className="p-4 text-xs text-slate-500">{new Date(d.preparedAt).toLocaleString()}</td>
                    <td className="p-4 text-xs text-slate-500">{new Date(d.expiryAt).toLocaleString()}</td>
                    <td className="p-4">
                      <CountdownTimer expiryAt={d.expiryAt} status={d.status} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="p-4 text-xs font-bold">
                      <span className={`px-2 py-1 rounded-md uppercase ${
                        d.urgencyLevel === 'FRESH' ? 'bg-emerald-100 text-emerald-800' :
                        d.urgencyLevel === 'EXPIRING_SOON' ? 'bg-amber-100 text-amber-800' :
                        d.urgencyLevel === 'URGENT' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {d.urgencyLevel}
                      </span>
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
