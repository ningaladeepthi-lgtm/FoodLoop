import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      switch (user.role) {
        case 'DONOR': navigate('/donor/dashboard'); break;
        case 'VOLUNTEER': navigate('/volunteer/dashboard'); break;
        case 'ORGANIZATION': navigate('/org/dashboard'); break;
        case 'ADMIN': navigate('/admin/dashboard'); break;
        default: navigate('/'); break;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to manage food donations, pickups, or requests.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">Quick Demo Login Shortcuts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('donor1@foodloop.org', 'password123')}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold border border-emerald-200 text-left"
            >
              🥦 Donor
            </button>
            <button
              onClick={() => handleDemoLogin('volunteer1@foodloop.org', 'password123')}
              className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-bold border border-teal-200 text-left"
            >
              🚴 Volunteer
            </button>
            <button
              onClick={() => handleDemoLogin('ngo1@foodloop.org', 'password123')}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-bold border border-blue-200 text-left"
            >
              🏢 NGO / Org
            </button>
            <button
              onClick={() => handleDemoLogin('admin@foodloop.org', 'admin123')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold border border-slate-300 text-left"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
