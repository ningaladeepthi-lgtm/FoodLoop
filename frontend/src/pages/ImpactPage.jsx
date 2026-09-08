import React from 'react';
import { Award, Leaf, Heart, Users } from 'lucide-react';

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">Environmental & Social Impact</span>
          <h1 className="text-4xl font-extrabold text-slate-900">Quantifiable Waste Reduction</h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            See how FoodLoop rescues surplus food and converts potential landfill waste into nutritious meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">4,820 kg</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Food Waste Prevented</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3 font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-teal-600">12,450</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Servings Rescued</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-blue-600">380+</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Active Volunteers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
