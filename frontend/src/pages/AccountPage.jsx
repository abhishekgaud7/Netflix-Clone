import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Shield, User, Tv, CheckCircle2, LogOut, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const { currentUser, selectedProfile, profiles, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-red-600 pb-16">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-5xl font-black text-white border-b border-gray-800 pb-4">
          Account Settings
        </h1>

        {/* MEMBERSHIP & BILLING */}
        <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">MEMBERSHIP & BILLING</span>
              <p className="text-lg font-bold text-white">{currentUser?.email || 'user@netflix.com'}</p>
              <p className="text-xs text-gray-400">Password: ••••••••••••</p>
            </div>
            <button 
              onClick={() => alert("Password reset link sent to your registered email.")}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded text-xs font-bold transition self-start cursor-pointer"
            >
              Change Password
            </button>
          </div>

          {/* PLAN DETAILS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">PLAN DETAILS</span>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white">Premium 4K Ultra HD + HDR</span>
                <span className="border border-red-600 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <p className="text-xs text-gray-400">Our best video quality in 4K (3840 × 2160) and spatial audio.</p>
            </div>
            <button 
              onClick={() => alert("Plan is currently active on Premium 4K Tier.")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold transition self-start cursor-pointer"
            >
              Manage Plan
            </button>
          </div>

          {/* PROFILES */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">PROFILES & PARENTAL CONTROLS</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {profiles.map(p => (
                <div 
                  key={p.id}
                  onClick={() => navigate('/profiles')}
                  className="bg-gray-800/60 p-3 rounded-lg flex items-center space-x-3 border border-gray-700/50 cursor-pointer hover:border-white transition"
                >
                  <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded" />
                  <div>
                    <p className="text-sm font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-green-400 font-medium">All Maturity Ratings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIGN OUT BUTTON */}
          <div className="pt-4 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-red-500 hover:text-red-400 text-sm font-bold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of All Devices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
