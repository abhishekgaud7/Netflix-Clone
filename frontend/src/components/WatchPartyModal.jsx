import React, { useState } from 'react';
import { X, Users, Copy, Check, Tv, Sparkles } from 'lucide-react';
import Toast from './Toast';

const WatchPartyModal = ({ movie, onClose }) => {
  const [partyCode] = useState(() => 'NETFLIX-' + Math.floor(100000 + Math.random() * 900000));
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const title = movie?.title || movie?.name || 'Streaming Room';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(partyCode);
    setCopied(true);
    setToastMsg(`Watch Party Room Code "${partyCode}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-[#181818] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-red-600 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2 text-red-600 font-extrabold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>LIVE CINEMA PARTY</span>
          </div>
          <h2 className="text-2xl font-black text-white">Watch Together in Sync</h2>
          <p className="text-xs text-gray-400">Share this Room Code with your friends to stream <span className="text-white font-bold">"{title}"</span> live together!</p>
        </div>

        {/* Room Code Card */}
        <div className="bg-gray-900 border-2 border-red-600/50 rounded-xl p-4 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">YOUR SYNC ROOM CODE</span>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl font-black text-red-500 tracking-widest font-mono">{partyCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition cursor-pointer"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Active Viewers */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-300 bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Room Status: <strong className="text-white">Active & Syncing</strong> (1 Host Connected)</span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg cursor-pointer"
        >
          Enter Shared Room
        </button>
      </div>
    </div>
  );
};

export default WatchPartyModal;
