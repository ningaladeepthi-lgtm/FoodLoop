import React from 'react';
import { Leaf, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Food<span className="text-emerald-500">Loop</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              FoodLoop connects surplus food donors with volunteers and organizations so that good food reaches people instead of landfills.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home Landing</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/food-safety" className="hover:text-emerald-400 transition-colors">Food Safety Protocol</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400 transition-colors">Impact & Statistics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Community Roles</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Become a Food Donor</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Join as Volunteer</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Register NGO / Organization</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Platform Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Safety & Contact</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> Hyderabad, India</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> support@foodloop.org</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" /> +91 1800-FOODLOOP</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FoodLoop Redistribution Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Zero Food Waste & Hunger Relief</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
