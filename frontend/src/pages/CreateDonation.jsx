import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, Clock, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { calculateRemainingTime } from '../utils/dateUtils';

export default function CreateDonation() {
  const navigate = useNavigate();

  const [foodType, setFoodType] = useState('');
  const [foodCategory, setFoodCategory] = useState('COOKED_MEALS');
  const [quantity, setQuantity] = useState(25);
  const [unit, setUnit] = useState('servings');
  const [servings, setServings] = useState(50);
  const [foodCondition, setFoodCondition] = useState('Fresh');
  const [dietaryType, setDietaryType] = useState('Veg');

  // Dates
  const now = new Date();
  const defaultPrepared = new Date(now.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultExpiry = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [preparedAt, setPreparedAt] = useState(defaultPrepared);
  const [expiryAt, setExpiryAt] = useState(defaultExpiry);

  const [pickupAddress, setPickupAddress] = useState('Banjara Hills Road No 12, Hyderabad');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Remaining time live preview calculation
  const [remainingPreview, setRemainingPreview] = useState(() => calculateRemainingTime(expiryAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingPreview(calculateRemainingTime(expiryAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryAt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/donations', {
        foodType,
        foodCategory,
        quantity: parseFloat(quantity),
        unit,
        servings: parseInt(servings),
        foodCondition,
        dietaryType,
        preparedAt: new Date(preparedAt).toISOString(),
        expiryAt: new Date(expiryAt).toISOString(),
        pickupAddress,
        specialInstructions,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop'
      });
      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-[calc(100vh-4rem)]">
      <Sidebar role="DONOR" />

      <main className="flex-1 p-6 max-w-4xl space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Post Surplus Food Donation</h1>
              <p className="text-xs text-slate-500">Provide accurate preparation & expiry timestamps for real-time safety tracking.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Live Remaining Time Urgency Banner */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Automated Time Calculator</span>
              <div className="text-sm font-semibold text-slate-200">Calculated Usable Window:</div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-400/30">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-extrabold text-emerald-300">
                {remainingPreview.display}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            
            <div className="md:col-span-2">
              <label className="block mb-1">Food Item Name / Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                placeholder="e.g. Vegetable Biryani & Mirchi Ka Salan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block mb-1">Category <span className="text-red-500">*</span></label>
              <select
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              >
                <option value="COOKED_MEALS">Cooked Meals</option>
                <option value="RICE">Rice</option>
                <option value="CURRIES">Curries</option>
                <option value="BAKERY">Bakery</option>
                <option value="FRUITS">Fruits</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="PACKAGED_FOOD">Packaged Food</option>
                <option value="DAIRY">Dairy</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Dietary Classification</label>
              <select
                value={dietaryType}
                onChange={(e) => setDietaryType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              >
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Quantity <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-2/3 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-1/3 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
                >
                  <option value="servings">servings</option>
                  <option value="kg">kg</option>
                  <option value="boxes">boxes</option>
                  <option value="meals">meals</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Estimated Servings (People Fed)</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block mb-1">Preparation Date & Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                required
                value={preparedAt}
                onChange={(e) => setPreparedAt(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block mb-1">Expiry Date & Time <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                required
                value={expiryAt}
                onChange={(e) => setExpiryAt(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1">Pickup Address & Instructions <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Full address where volunteer will collect food"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800 mb-2"
              />
              <textarea
                rows="2"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Special pickup notes (e.g. Bring thermal bags, call entrance security)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              ></textarea>
            </div>

          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 text-sm hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Publishing Post...' : 'Publish Donation & Notify Volunteers'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
