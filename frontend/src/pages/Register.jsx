import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Mail, Phone, Lock, Building, MapPin, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') || 'DONOR';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('Shelter Home');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({
        role,
        name,
        email,
        phone,
        password,
        organizationName: role === 'ORGANIZATION' ? organizationName : null,
        organizationType: role === 'ORGANIZATION' ? organizationType : null,
        address
      });
      navigate('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Join FoodLoop</h2>
          <p className="text-xs text-slate-500">Create an account to donate, pick up, or receive surplus food.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('DONOR')}
            className={`py-2 rounded-lg transition-all ${role === 'DONOR' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Donor
          </button>
          <button
            type="button"
            onClick={() => setRole('VOLUNTEER')}
            className={`py-2 rounded-lg transition-all ${role === 'VOLUNTEER' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => setRole('ORGANIZATION')}
            className={`py-2 rounded-lg transition-all ${role === 'ORGANIZATION' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            NGO / Org
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          
          <div>
            <label className="block text-slate-700 uppercase tracking-wider mb-1">Full Name / Contact Person</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Green Leaf Restaurant / Rahul Sharma"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          {role === 'ORGANIZATION' && (
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Helping Hands NGO"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1">Org Type</label>
                <select
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
                >
                  <option value="Shelter Home">Shelter Home</option>
                  <option value="Community Kitchen">Community Kitchen</option>
                  <option value="Orphanage">Orphanage</option>
                  <option value="Old Age Home">Old Age Home</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 uppercase tracking-wider mb-1">Address / Pickup Area</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address, Hyderabad"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : `Register as ${role}`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
