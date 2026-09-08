import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle } from 'lucide-react';

export default function FoodSafetyProtocolPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Food Safety & Quality Protocol</h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            FoodLoop enforces strict timestamp calculations and immediate physical spoilage blocking to ensure zero unsafe food distribution.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">The 4 Golden Safety Rules</h2>
          
          <div className="space-y-4 text-sm text-slate-700">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                1. Automated Timestamp Expiry
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Every food post includes exact preparation and expiry times. When <code className="bg-white px-1.5 py-0.5 rounded font-mono">current_time &gt;= expiry_at</code>, the backend scheduler automatically transitions the status to <strong>EXPIRED</strong> and blocks all pickup operations.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <h3 className="font-bold text-amber-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-600" />
                2. Explicit Physical Spoilage Reporting
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                If food suffers bad smell, altered appearance, or temperature issues, any donor, volunteer, or NGO can report physical spoilage. The food is instantly marked <strong>SPOILED</strong> and quarantined.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
              <h3 className="font-bold text-red-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                3. Zero-Tolerance Distribution Rejection
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                All pickup acceptances, match creation, and delivery completions validate <code className="bg-white px-1.5 py-0.5 rounded font-mono">status != EXPIRED && status != SPOILED</code> before execution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
