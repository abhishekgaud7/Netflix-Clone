import React, { useState } from 'react';
import { X, Dices, Sparkles, Play, Info } from 'lucide-react';
import { POSTER_BASE_URL } from '../api/tmdb';

const CinemaRouletteModal = ({ movies, onClose, onSelectMovie }) => {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const handleSpin = () => {
    if (!movies || movies.length === 0) return;
    setSpinning(true);
    setWinner(null);

    let count = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * movies.length);
      setWinner(movies[randomIdx]);
      count++;
      if (count >= maxSpins) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#181818] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-red-600 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2 text-red-600 font-extrabold text-sm uppercase tracking-wider">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>AI CINEMA ROULETTE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Can't decide what to watch?</h2>
          <p className="text-xs text-gray-400">Spin the wheel and let AI pick your next masterpiece!</p>
        </div>

        {/* Roulette Display Area */}
        <div className="relative h-64 bg-gray-900 rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-4 overflow-hidden">
          {winner ? (
            <div className={`space-y-3 flex flex-col items-center transition-all ${spinning ? 'scale-90 opacity-60' : 'scale-100 opacity-100'}`}>
              <img 
                src={`${POSTER_BASE_URL}${winner.poster_path || winner.backdrop_path}`} 
                alt={winner.title || winner.name} 
                className="w-28 h-36 object-cover rounded-lg shadow-xl border border-gray-700"
              />
              <h3 className="text-base font-bold text-white truncate max-w-xs">{winner.title || winner.name}</h3>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Dices className="w-16 h-16 text-red-600 mx-auto animate-bounce" />
              <p className="text-sm font-semibold text-gray-300">Ready to roll the dice?</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-black text-base px-6 py-3 rounded-xl transition shadow-xl cursor-pointer disabled:opacity-50"
          >
            <Dices className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
            <span>{spinning ? 'Spinning...' : 'Spin the Wheel'}</span>
          </button>

          {winner && !spinning && (
            <button
              onClick={() => {
                onClose();
                onSelectMovie(winner);
              }}
              className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black font-bold text-base px-6 py-3 rounded-xl transition shadow-xl cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Watch Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CinemaRouletteModal;
