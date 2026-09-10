```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, Heart, ShieldCheck, ArrowRight, Truck, Users, Building, 
  Clock, AlertTriangle, CheckCircle2, Award, ChevronRight 
} from 'lucide-react';
import API from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import StatusBadge from '../components/StatusBadge';

export default function Home() {
  const [publicDonations, setPublicDonations] = useState([]);

  useEffect(() => {
    fetchPublicDonations();
  }, []);

  const fetchPublicDonations = async () => {
    try {
      const res = await API.get('/donations/public/landing');
      setPublicDonations(res.data);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Zero Food Waste Redistribution Platform</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-white">
                Save Food. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  Feed People.
                </span> <br />
                Build a Better Tomorrow.
              </h1>

              <p className="text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                FoodLoop connects surplus food from restaurants, hotels, and households with nearby volunteers and NGOs so good food reaches people in need instead of landfills.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/register?role=DONOR"
                  className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Donate Food</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register?role=ORGANIZATION"
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <span>Request Food</span>
                </Link>
                <Link
                  to="/register?role=VOLUNTEER"
                  className="px-6 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-lg transition-all"
                >
                  <span>Become a Volunteer</span>
                </Link>
              </div>

              {/* Live Status Pill */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-emerald-200 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Real-time Usable Usability Timers
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Automated Spoilage Lock
                </span>
              </div>
            </div>

            {/* Visual Workflow Card */}
            <div className="lg:col-span-5">
              <div className="glass-card bg-slate-900/80 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Live Food Redistribution Stream
                </h3>

                {publicDonations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Loading live food stream...
                  </div>
                ) : (
                  publicDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">{donation.foodCategory}</span>
                          <h4 className="font-bold text-white text-base">{donation.foodType}</h4>
                          <p className="text-xs text-slate-400">{donation.donor?.name} • {donation.pickupAddress}</p>
                        </div>
                        <CountdownTimer expiryAt={donation.expiryAt} status={donation.status} />
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-700/50 text-xs">
                        <span className="text-slate-300 font-medium">Quantity: <strong className="text-white">{donation.quantity} {donation.unit}</strong> ({donation.servings} servings)</span>
                        <StatusBadge status={donation.status} />
                      </div>
                    </div>
                  ))
                )}

                <div className="text-center pt-2">
                  <Link to="/register" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center justify-center gap-1">
                    Join FoodLoop to claim or collect available meals <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* IMPACT METRICS */}
      <section className="-mt-12 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">12,450+</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Meals Rescued</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">4,820 kg</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Surplus Saved</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">380+</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Active Volunteers</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">45+</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Partner NGOs</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Simple 5-Step Ecosystem
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How FoodLoop Works
            </p>
            <p className="text-base text-slate-600">
              Seamless real-time tracking from food surplus creation to final serving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-lg">1</div>
              <h3 className="font-bold text-slate-800">Donate</h3>
              <p className="text-xs text-slate-500">Donors post food details, servings, and expiry timestamps.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto font-bold text-lg">2</div>
              <h3 className="font-bold text-slate-800">Match</h3>
              <p className="text-xs text-slate-500">FoodLoop matches food with NGO requests based on proximity & urgency.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-lg">3</div>
              <h3 className="font-bold text-slate-800">Accept Pickup</h3>
              <p className="text-xs text-slate-500">Nearby volunteers accept pickup & navigate to donor location.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold text-lg">4</div>
              <h3 className="font-bold text-slate-800">Deliver</h3>
              <p className="text-xs text-slate-500">Live progress tracking during transit ensures safe delivery.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center mx-auto font-bold text-lg">5</div>
              <h3 className="font-bold text-slate-800">Feed</h3>
              <p className="text-xs text-slate-500">Fresh meals served to shelter residents & needy communities.</p>
            </div>

          </div>
        </div>
      </section>

      {/* MEMBER 4 CONTRIBUTION - WHY FOODLOOP */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Why FoodLoop?
            </h2>

            <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl mt-2">
              Making Every Meal Matter
            </p>

            <p className="text-base text-slate-600 mt-4">
              Together, we can reduce food waste and make surplus food reach the people who need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-5">
                <Leaf className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                Reduce Food Waste
              </h3>

              <p className="text-sm text-slate-500 mt-3">
                Give surplus food a second chance instead of sending it to landfills.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5">
                <Heart className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                Support Communities
              </h3>

              <p className="text-sm text-slate-500 mt-3">
                Connect generous donors with organizations serving local communities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-5">
                <Truck className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                Fast Redistribution
              </h3>

              <p className="text-sm text-slate-500 mt-3">
                Coordinate donors, volunteers, and organizations for timely food delivery.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
```
