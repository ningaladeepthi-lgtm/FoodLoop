import React, { useState } from 'react';
import { AlertOctagon, X } from 'lucide-react';
import API from '../services/api';

export default function SpoilageReportModal({ donation, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState('Bad smell');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !donation) return null;

  const reasons = [
    'Bad smell',
    'Changed appearance',
    'Improper storage',
    'Temperature issue',
    'Damaged packaging',
    'Contamination concern',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post(`/donations/${donation.id}/report-spoiled`, {
        reason,
        description
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit spoilage report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-red-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-7 h-7 text-amber-300" />
            <div>
              <h3 className="font-bold text-lg">Report Food Spoilage</h3>
              <p className="text-xs text-red-100">Donation #{donation.id}: {donation.foodType}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Reason for Spoilage <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-slate-800 text-sm font-medium"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Detailed Observation / Notes
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe smell, texture, storage temperature, or visual changes observed..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-slate-800 text-sm"
            ></textarea>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 leading-relaxed">
            ⚠️ <strong>Safety Action:</strong> Submitting this report will immediately set status to <strong>SPOILED</strong>, remove the food from active redistribution, and notify all assigned parties & admins.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-600/30 text-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm Spoilage & Lock Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
