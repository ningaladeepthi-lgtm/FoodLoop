import React from 'react';
import { Leaf, ShieldCheck, Heart, Users, Truck } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">About FoodLoop</span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Turn Surplus Food Into Someone's Meal</h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            FoodLoop is a technology-driven food waste management platform that connects restaurants, supermarkets, function halls, and households with volunteers and NGOs to redistribute surplus edible food before it spoils.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Our Core Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="font-bold text-slate-800">Prevent Edible Food Waste</h3>
                <p className="text-xs text-slate-500 mt-1">Ensure surplus fresh meals reach community kitchens instead of ending up in landfills generating methane.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-800">Real-Time Usability Tracking</h3>
                <p className="text-xs text-slate-500 mt-1">Automated countdown timers continuously calculate remaining safe hours and trigger urgent alerts.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="font-bold text-slate-800">Strict Food Safety Protocol</h3>
                <p className="text-xs text-slate-500 mt-1">Expired or reported spoiled food is instantly locked to guarantee 100% safety for recipients.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <h3 className="font-bold text-slate-800">Community Volunteer Network</h3>
                <p className="text-xs text-slate-500 mt-1">Volunteer pickup coordinators receive optimized navigation routes based on urgency and location.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
