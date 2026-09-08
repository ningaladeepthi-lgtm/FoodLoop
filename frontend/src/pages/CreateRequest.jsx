import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, Building, AlertCircle } from 'lucide-react';

export default function CreateRequest() {
  const navigate = useNavigate();

  const [foodType, setFoodType] = useState('Vegetable Biryani / Cooked Rice');
  const [quantityRequired, setQuantityRequired] = useState(40);
  const [peopleCount, setPeopleCount] = useState(80);
  const [priority, setPriority] = useState('NORMAL');
  const [location, setLocation] = useState('Madhapur Shelter Home, Hyderabad');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/requests', {
        foodType,
        quantityRequired: parseFloat(quantityRequired),
        peopleCount: parseInt(peopleCount),
        priority,
        location,
        additionalRequirements
      });
      navigate('/org/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit food request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-4rem)]">
      <Sidebar role="ORGANIZATION" />

      <main className="flex-1 p-6 max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Post NGO Food Request</h1>
            <p className="text-xs text-slate-500">Specify requirements to match with nearby surplus food donors & volunteers.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs font-semibold text-slate-700">
          
          <div>
            <label className="block mb-1">Required Food Category / Type <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              placeholder="e.g. Cooked Rice, Curries, Chapati, Bakery"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Quantity Required (Servings) <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min="1"
                value={quantityRequired}
                onChange={(e) => setQuantityRequired(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block mb-1">People / Residents to Feed</label>
              <input
                type="number"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              >
                <option value="NORMAL">Normal Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="EMERGENCY">Emergency Need</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Delivery Location Address</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Additional Requirements / Dietary Needs</label>
            <textarea
              rows="3"
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="e.g. Vegetarian preferred, needs delivery before 9 PM"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/org/dashboard')}
              className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 text-sm hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Post Food Request'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
