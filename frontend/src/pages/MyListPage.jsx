import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MovieModal from '../components/MovieModal';
import { useWatchlist } from '../context/WatchlistContext';
import { POSTER_BASE_URL } from '../api/tmdb';
import { Trash2, Play } from 'lucide-react';

const MyListPage = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-red-600 pb-16">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-wide border-b border-gray-800 pb-4">
          My List ({watchlist.length})
        </h1>

        {watchlist.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-gray-400 text-lg">Your watchlist is currently empty.</p>
            <p className="text-gray-500 text-sm">Explore movies and TV shows on the home page and click <span className="text-red-500 font-bold">+</span> to save them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {watchlist.map(item => (
              <div
                key={item.movieId}
                className="bg-gray-900 rounded-md overflow-hidden shadow-lg border border-gray-800 relative group cursor-pointer hover:scale-105 transition transform"
              >
                <img
                  src={`${POSTER_BASE_URL}${item.posterPath || item.backdropPath}`}
                  alt={item.title}
                  className="w-full h-64 md:h-72 object-cover"
                  onClick={() => setSelectedMovie({ id: item.movieId, title: item.title, poster_path: item.posterPath, overview: item.overview })}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(item.movieId);
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-red-600 text-white rounded-full transition shadow z-10"
                  title="Remove from My List"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div 
                  className="p-3"
                  onClick={() => setSelectedMovie({ id: item.movieId, title: item.title, poster_path: item.posterPath, overview: item.overview })}
                >
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">Added {new Date(item.addedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={setSelectedMovie}
        />
      )}
    </div>
  );
};

export default MyListPage;
