import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Star, Calendar, Film, Volume2, VolumeX } from 'lucide-react';
import { IMAGE_BASE_URL, POSTER_BASE_URL, fetchMovieDetailsAndVideos } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop';

const MovieModal = ({ movie, onClose, onSelectMovie }) => {
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // ESC key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    if (movie) {
      const getDetails = async () => {
        const data = await fetchMovieDetailsAndVideos(movie.id, movie.media_type || 'movie');
        if (data) {
          setDetails(data);
          if (data.videos?.results?.length > 0) {
            const trailer = data.videos.results.find(v => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube') || data.videos.results[0];
            if (trailer) setTrailerKey(trailer.key);
          }
        }
      };
      getDetails();
    }
  }, [movie]);

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const title = movie.title || movie.name || movie.original_name;
  const overview = movie.overview || details?.overview || 'No description available for this title.';

  const getMediaUrl = (path) => {
    if (path && path !== 'null' && path !== 'undefined') {
      return `${POSTER_BASE_URL}${path}`;
    }
    return FALLBACK_IMAGE;
  };

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/90 backdrop-blur-lg overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-[#181818] rounded-2xl overflow-y-auto no-scrollbar shadow-2xl border border-gray-800 my-auto flex flex-col">
        
        {/* Sticky Top Header Bar with Close Button */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#181818]/95 backdrop-blur-md border-b border-gray-800">
          <div className="flex items-center space-x-2 text-red-600 font-black tracking-wider text-base">
            <Film className="w-5 h-5" />
            <span>NETFLIX CINEMA PREVIEW</span>
          </div>
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-red-600 text-white p-2 rounded-full border border-gray-600 hover:border-white transition cursor-pointer flex items-center justify-center shadow-lg"
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* LARGE VIDEO TRAILER CONTAINER (Cinema Size) */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[65vh] bg-black overflow-hidden">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&controls=1&modestbranding=1`}
              title="Movie Trailer"
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={getMediaUrl(movie.backdrop_path || movie.poster_path)} 
                alt={title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            </div>
          )}
        </div>

        {/* Content Body Below Big Video */}
        <div className="p-6 md:p-10 space-y-6">
          {/* Title & Add to Watchlist Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">{title}</h2>

            <button 
              onClick={handleWatchlistToggle}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition cursor-pointer shadow-xl ${
                inList ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{inList ? 'In Watchlist' : 'Add to My List'}</span>
            </button>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-semibold text-gray-300">
            <span className="text-green-400 font-bold text-lg">
              {Math.round((movie.vote_average || details?.vote_average || 8.5) * 10)}% Match
            </span>
            <span className="flex items-center space-x-1 text-yellow-400">
              <Star className="w-5 h-5 fill-yellow-400" />
              <span>{(movie.vote_average || details?.vote_average || 8.5).toFixed(1)} / 10</span>
            </span>
            <span className="border border-gray-600 px-2.5 py-0.5 rounded text-xs">
              {movie.adult ? '18+' : '13+'}
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{movie.release_date || movie.first_air_date || details?.release_date || '2024'}</span>
            </span>
            {details?.runtime && (
              <span className="text-gray-400">{details.runtime} mins</span>
            )}
            <span className="border border-red-600 text-red-500 px-2 py-0.5 rounded text-xs font-bold uppercase">Ultra HD 4K</span>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <p className="text-gray-200 text-base md:text-lg leading-relaxed">{overview}</p>
            </div>

            {/* Cast & Info Sidebar */}
            <div className="space-y-4 text-sm text-gray-400 bg-gray-900/80 p-5 rounded-xl border border-gray-800 shadow-md">
              <div>
                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Cast</span>
                <p className="text-gray-200 mt-1 font-medium">
                  {details?.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'Various Actors'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Genres</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {details?.genres?.map(g => (
                    <span key={g.id} className="bg-gray-800 text-xs px-2.5 py-1 rounded text-gray-300 font-medium">
                      {g.name}
                    </span>
                  )) || <span className="text-gray-300">Drama, Action, Streaming</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Recommendations */}
          {details?.similar?.results?.length > 0 && (
            <div className="pt-6 border-t border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {details.similar.results.slice(0, 4).map(sim => (
                  <div 
                    key={sim.id}
                    onClick={() => {
                      onClose();
                      onSelectMovie(sim);
                    }}
                    className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition border border-gray-800 shadow-lg flex flex-col"
                  >
                    <img 
                      src={getMediaUrl(sim.backdrop_path || sim.poster_path)} 
                      alt={sim.title || sim.name} 
                      className="w-full h-32 md:h-36 object-cover bg-gray-800"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div className="p-3 bg-gray-900 flex-1">
                      <p className="text-sm font-bold text-white truncate">{sim.title || sim.name}</p>
                      <p className="text-xs text-green-400 font-semibold mt-1">{Math.round((sim.vote_average || 8) * 10)}% Match</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
