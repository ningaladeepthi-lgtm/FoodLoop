import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import StatusBadge from '../components/StatusBadge';
import SpoilageReportModal from '../components/SpoilageReportModal';
import { 
  Truck, Package, MapPin, Clock, CheckCircle2, Navigation, 
  AlertTriangle, Phone, Building, ArrowRight, ShieldAlert 
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpoilageDonation, setSelectedSpoilageDonation] = useState(null);
  const [activeTab, setActiveTab] = useState('AVAILABLE'); // AVAILABLE or ACTIVE_WORKFLOW or HISTORY

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [availableRes, myPickupsRes] = await Promise.all([
        API.get('/donations/available'),
        API.get('/pickups/my-pickups')
      ]);
      setAvailableDonations(availableRes.data);
      setMyPickups(myPickupsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPickup = async (donationId) => {
    try {
      await API.post(`/pickups/accept?donationId=${donationId}`);
      fetchData();
      setActiveTab('ACTIVE_WORKFLOW');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept pickup.');
    }
  };

  const handleUpdatePickupStatus = async (pickupId, nextStatus) => {
    try {
      await API.put(`/pickups/${pickupId}/status?status=${nextStatus}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update pickup status.');
    }
  };

  const activePickup = myPickups.find(p => p.status !== 'DELIVERED' && p.status !== 'CANCELLED');
  const completedPickups = myPickups.filter(p => p.status === 'DELIVERED');
  const totalMealsDelivered = completedPickups.reduce((sum, p) => sum + (p.donation?.servings || 0), 0);

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-4rem)]">
      <Sidebar role="VOLUNTEER" />

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Volunteer Mission Hub</h1>
            <p className="text-xs text-slate-500 mt-1">Accept urgent food rescues and navigate pickups across the city.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('AVAILABLE')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'AVAILABLE' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
            >
              Available Pickups ({availableDonations.length})
            </button>
            <button
              onClick={() => setActiveTab('ACTIVE_WORKFLOW')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all relative ${activeTab === 'ACTIVE_WORKFLOW' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
            >
              Active Delivery {activePickup && <span className="w-2 h-2 rounded-full bg-amber-400 inline-block ml-1 animate-ping"></span>}
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'HISTORY' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
            >
              Completed ({completedPickups.length})
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Available Nearby</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{availableDonations.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Completed Pickups</span>
            <div className="text-2xl font-extrabold text-teal-600 mt-1">{completedPickups.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Meals Delivered</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalMealsDelivered}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500">Distance Travelled</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{(completedPickups.length * 2.4).toFixed(1)} km</div>
          </div>
        </div>

        {/* TAB 1: AVAILABLE PICKUPS (PRIORITIZED BY URGENCY / EARLIEST EXPIRY) */}
        {activeTab === 'AVAILABLE' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Urgent & Nearby Available Food Posts</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">Sorted by earliest expiry & proximity</span>
            </div>

            {loading ? (
              <div className="bg-white p-12 text-center text-slate-400 text-sm rounded-2xl">Loading available pickups...</div>
            ) : availableDonations.length === 0 ? (
              <div className="bg-white p-12 text-center text-slate-400 rounded-2xl space-y-2">
                <Package className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-sm font-semibold">No available food posts right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableDonations.map((donation) => {
                  const isUrgent = donation.urgencyLevel === 'URGENT';
                  return (
                    <div
                      key={donation.id}
                      className={`bg-white rounded-2xl border p-5 space-y-4 shadow-sm transition-all hover:shadow-md ${
                        isUrgent ? 'border-orange-400 bg-orange-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {donation.foodCategory}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-lg mt-1">{donation.foodType}</h3>
                          <p className="text-xs text-slate-500">{donation.donor?.name}</p>
                        </div>
                        <CountdownTimer expiryAt={donation.expiryAt} status={donation.status} />
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-500">Quantity:</span>
                          <span className="font-extrabold text-slate-900">{donation.quantity} {donation.unit} ({donation.servings} servings)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-500">Condition:</span>
                          <span className="font-bold text-emerald-700">{donation.foodCondition}</span>
                        </div>
                        <div className="flex items-start gap-1.5 pt-1 text-slate-700">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{donation.pickupAddress}</span>
                        </div>
                      </div>

                      {donation.specialInstructions && (
                        <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                          "{donation.specialInstructions}"
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleAcceptPickup(donation.id)}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Accept Pickup Mission</span>
                        </button>
                        <button
                          onClick={() => setSelectedSpoilageDonation(donation)}
                          className="p-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold border border-red-200"
                          title="Report Spoiled"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE WORKFLOW & STEP-BY-STEP LIVE TIMELINE */}
        {activeTab === 'ACTIVE_WORKFLOW' && (
          <div>
            {!activePickup ? (
              <div className="bg-white p-12 text-center text-slate-400 rounded-2xl space-y-3">
                <Truck className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-base font-bold text-slate-700">No active pickup mission currently.</p>
                <p className="text-xs text-slate-500">Go to "Available Pickups" and click Accept Pickup to start a rescue mission.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Workflow Action Panel */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Active Mission #{activePickup.id}</span>
                      <h2 className="text-xl font-extrabold text-slate-900">{activePickup.donation?.foodType}</h2>
                    </div>
                    <CountdownTimer expiryAt={activePickup.donation?.expiryAt} status={activePickup.donation?.status} />
                  </div>

                  {/* Step-by-Step Interactive Workflow Controls */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Mission Progress Action</h3>

                    <div className="grid grid-cols-1 gap-3">
                      
                      {/* Step 1: Start Pickup */}
                      <button
                        disabled={activePickup.status !== 'ASSIGNED'}
                        onClick={() => handleUpdatePickupStatus(activePickup.id, 'PICKUP_STARTED')}
                        className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          activePickup.status === 'ASSIGNED'
                            ? 'bg-emerald-600 text-white shadow-lg cursor-pointer'
                            : activePickup.pickupStartedAt ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 opacity-40'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">1. Start Pickup Journey</div>
                          <div className="text-xs opacity-80">Notify donor you are on the way</div>
                        </div>
                        {activePickup.pickupStartedAt ? (
                          <span className="text-xs font-bold">Started at {new Date(activePickup.pickupStartedAt).toLocaleTimeString()}</span>
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                      </button>

                      {/* Step 2: Arrived at Donor */}
                      <button
                        disabled={activePickup.status !== 'PICKUP_STARTED'}
                        onClick={() => handleUpdatePickupStatus(activePickup.id, 'ARRIVED_AT_DONOR')}
                        className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          activePickup.status === 'PICKUP_STARTED'
                            ? 'bg-emerald-600 text-white shadow-lg cursor-pointer'
                            : activePickup.arrivedAt ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 opacity-40'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">2. Arrived at Donor Location</div>
                          <div className="text-xs opacity-80">At {activePickup.donation?.pickupAddress}</div>
                        </div>
                        {activePickup.arrivedAt ? (
                          <span className="text-xs font-bold">Arrived at {new Date(activePickup.arrivedAt).toLocaleTimeString()}</span>
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                      </button>

                      {/* Step 3: Food Collected */}
                      <button
                        disabled={activePickup.status !== 'ARRIVED_AT_DONOR'}
                        onClick={() => handleUpdatePickupStatus(activePickup.id, 'FOOD_COLLECTED')}
                        className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          activePickup.status === 'ARRIVED_AT_DONOR'
                            ? 'bg-emerald-600 text-white shadow-lg cursor-pointer'
                            : activePickup.foodCollectedAt ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 opacity-40'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">3. Food Collected & Loaded</div>
                          <div className="text-xs opacity-80">Verify quantity: {activePickup.donation?.quantity} {activePickup.donation?.unit}</div>
                        </div>
                        {activePickup.foodCollectedAt ? (
                          <span className="text-xs font-bold">Collected at {new Date(activePickup.foodCollectedAt).toLocaleTimeString()}</span>
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                      </button>

                      {/* Step 4: Start Delivery */}
                      <button
                        disabled={activePickup.status !== 'FOOD_COLLECTED'}
                        onClick={() => handleUpdatePickupStatus(activePickup.id, 'DELIVERY_STARTED')}
                        className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          activePickup.status === 'FOOD_COLLECTED'
                            ? 'bg-emerald-600 text-white shadow-lg cursor-pointer'
                            : activePickup.deliveryStartedAt ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 opacity-40'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">4. Start Transit to Recipient NGO</div>
                          <div className="text-xs opacity-80">Navigating to destination</div>
                        </div>
                        {activePickup.deliveryStartedAt ? (
                          <span className="text-xs font-bold">In transit since {new Date(activePickup.deliveryStartedAt).toLocaleTimeString()}</span>
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                      </button>

                      {/* Step 5: Delivered */}
                      <button
                        disabled={activePickup.status !== 'DELIVERY_STARTED'}
                        onClick={() => handleUpdatePickupStatus(activePickup.id, 'DELIVERED')}
                        className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          activePickup.status === 'DELIVERY_STARTED'
                            ? 'bg-green-700 text-white shadow-xl cursor-pointer'
                            : activePickup.deliveredAt ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 opacity-40'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm">5. Confirm Delivery Complete</div>
                          <div className="text-xs opacity-80">Handed over to recipient shelter</div>
                        </div>
                        {activePickup.deliveredAt ? (
                          <span className="text-xs font-bold">Delivered!</span>
                        ) : (
                          <CheckCircle2 className="w-6 h-6" />
                        )}
                      </button>

                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      onClick={() => setSelectedSpoilageDonation(activePickup.donation)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold border border-red-200 flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Report Spoilage / Reject Food</span>
                    </button>
                  </div>

                </div>

                {/* Map Interface & Contact Panel */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Realistic Mock Map Interface */}
                  <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <Navigation className="w-4 h-4 animate-spin" /> Live Navigation GPS Map
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-md font-bold">
                        Est. Distance: {activePickup.distanceKm} km
                      </span>
                    </div>

                    <div className="h-56 bg-slate-800 rounded-xl border border-slate-700/80 relative overflow-hidden flex flex-col justify-between p-4">
                      {/* Visual Map Nodes */}
                      <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-emerald-500/40">
                        <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">Donor: {activePickup.donation?.donor?.name}</div>
                          <div className="text-[10px] text-slate-400">{activePickup.donation?.pickupAddress}</div>
                        </div>
                      </div>

                      <div className="my-2 border-l-2 border-dashed border-emerald-400 pl-4 ml-4 text-[10px] text-emerald-300 font-semibold">
                        🚴 Volunteer Live Route in Progress...
                      </div>

                      <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-blue-500/40">
                        <Building className="w-5 h-5 text-blue-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">
                            NGO: {activePickup.donation?.organization?.organizationName || 'Helping Hands Shelter'}
                          </div>
                          <div className="text-[10px] text-slate-400">Madhapur Metro Lane, Hyderabad</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Donor Contact Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500">Contact Details</h4>
                    <div className="text-xs space-y-1.5">
                      <div><strong className="text-slate-800">Donor Contact:</strong> {activePickup.donation?.donor?.phone}</div>
                      <div><strong className="text-slate-800">Recipient Contact:</strong> +91 9988776655</div>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'HISTORY' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">Completed Pickup Missions</h2>
            {completedPickups.length === 0 ? (
              <p className="text-xs text-slate-400">No completed pickups yet.</p>
            ) : (
              <div className="space-y-3">
                {completedPickups.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">#{p.donation?.id} {p.donation?.foodType}</div>
                      <div className="text-slate-500">Delivered at {new Date(p.deliveredAt).toLocaleString()} • {p.donation?.servings} servings</div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">DELIVERED</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <SpoilageReportModal
        donation={selectedSpoilageDonation}
        isOpen={!!selectedSpoilageDonation}
        onClose={() => setSelectedSpoilageDonation(null)}
        onSuccess={fetchData}
      />
    </div>
  );
}
