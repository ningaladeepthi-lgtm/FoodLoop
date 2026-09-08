import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import StatusBadge from '../components/StatusBadge';
import { 
  Building, PlusCircle, HeartHandshake, Package, Clock, 
  CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('REQUESTS');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, donRes] = await Promise.all([
        API.get('/requests/my-requests'),
        API.get('/donations/available')
      ]);
      setRequests(reqRes.data);
      setAvailableDonations(donRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDonation = async (donationId, requestId) => {
    try {
      await API.post(`/pickups/accept?donationId=${donationId}&requestId=${requestId}`);
      alert('Match confirmed! A volunteer will collect and deliver the food to your shelter.');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim donation match.');
    }
  };

  const activeRequests = requests.filter(r => r.status === 'PENDING');
  const totalMealsReceived = requests.filter(r => r.status === 'DELIVERED' || r.status === 'COMPLETED').reduce((sum, r) => sum + (r.peopleCount || 0), 0);

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-4rem)]">
      <Sidebar role="ORGANIZATION" />

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        
        {/* Banner */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.organizationName || user?.name} Portal</h1>
            <p className="text-xs text-slate-500 mt-1">Request surplus food for your shelter residents or match with nearby available posts.</p>
          </div>

          <Link
            to="/org/create-request"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Food Request</span>
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Active Requests</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{activeRequests.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Recommended Matches</span>
            <div className="text-2xl font-extrabold text-teal-600 mt-1">{availableDonations.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">People Fed</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalMealsReceived}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Food Safety Policy</span>
            <div className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Inspected
            </div>
          </div>
        </div>

        {/* Smart Recommended Matches */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              <span>Smart Recommended Food Matches</span>
            </h2>
            <span className="text-xs text-slate-500">Matching nearby available food with your requirements</span>
          </div>

          {availableDonations.length === 0 ? (
            <p className="text-xs text-slate-400">No matching surplus food posts available currently.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDonations.map((donation) => (
                <div key={donation.id} className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700">{donation.foodCategory}</span>
                      <h4 className="font-extrabold text-slate-900 text-base">{donation.foodType}</h4>
                      <p className="text-xs text-slate-500">{donation.donor?.name} • {donation.pickupAddress}</p>
                    </div>
                    <CountdownTimer expiryAt={donation.expiryAt} status={donation.status} />
                  </div>

                  <div className="text-xs text-slate-700 font-semibold bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between">
                    <span>Quantity: {donation.quantity} {donation.unit}</span>
                    <span className="text-emerald-700">{donation.servings} People Fed</span>
                  </div>

                  {activeRequests.length > 0 ? (
                    <button
                      onClick={() => handleClaimDonation(donation.id, activeRequests[0].id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      <span>Claim & Match with Request #{activeRequests[0].id}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <p className="text-[11px] text-slate-500 text-center italic">Create a food request first to match this donation.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">My Organization Requests</h2>

          {requests.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No food requests posted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Req ID & Food Type</th>
                    <th className="p-4">Quantity Required</th>
                    <th className="p-4">People Count</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">#{r.id} {r.foodType}</div>
                        <div className="text-xs text-slate-400">{r.location}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">{r.quantityRequired} servings</td>
                      <td className="p-4 font-bold text-emerald-700">{r.peopleCount} people</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase ${
                          r.priority === 'EMERGENCY' ? 'bg-red-100 text-red-800' :
                          r.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-800 uppercase">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
