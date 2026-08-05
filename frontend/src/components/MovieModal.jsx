import React, { useState, useEffect } from 'react';
import { X, Play, Plus, Check, Star, ThumbsUp, Calendar, Film } from 'lucide-react';
import { IMAGE_BASE_URL, POSTER_BASE_URL, fetchMovieDetailsAndVideos } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const MovieModal = ({ movie, onClose, onSelectMovie }) => {
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (movie) {
      const getDetails = async () => {
        setLoading(true);
        const data = await fetchMovieDetailsAndVideos(movie.id, movie.media_type || 'movie');
        if (data) {
          setDetails(data);
          if (data.videos?.results?.length > 0) {
            const trailer = data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') || data.videos.results[0];
            if (trailer) setTrailerKey(trailer.key);
          }
        }
        setLoading(false);
      };
      getDetails();
    }
  }, [movie]);

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);
  const title = movie.title || movie.name || movie.original_name;
  const overview = movie.overview || details?.overview || 'No description available for this title.';

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-gray-800 my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-[#181818]/80 hover:bg-[#181818] text-white p-2 rounded-full border border-gray-600 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Media / Video Trailer Section */}
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&controls=1`}
              title="Movie Trailer"
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img 
                src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} 
                alt={title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />
            </>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg">{title}</h2>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={handleWatchlistToggle}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-semibold text-sm transition cursor-pointer ${
                  inList ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inList ? 'In Watchlist' : 'Add to My List'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-300">
            <span className="text-green-400 font-bold text-base">
              {Math.round((movie.vote_average || details?.vote_average || 8.5) * 10)}% Match
            </span>
            <span className="flex items-center space-x-1 text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span>{(movie.vote_average || details?.vote_average || 8.5).toFixed(1)} / 10</span>
            </span>
            <span className="border border-gray-600 px-2 py-0.5 rounded text-xs">
              {movie.adult ? '18+' : '13+'}
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{movie.release_date || movie.first_air_date || details?.release_date || '2024'}</span>
            </span>
            {details?.runtime && (
              <span className="text-gray-400">{details.runtime} mins</span>
            )}
            <span className="border border-red-600 text-red-500 px-1.5 py-0.5 rounded text-xs font-bold uppercase">Ultra HD 4K</span>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-gray-200 text-base leading-relaxed">{overview}</p>
            </div>

            {/* Cast & Info Sidebar */}
            <div className="space-y-3 text-sm text-gray-400 bg-gray-900/60 p-4 rounded-lg border border-gray-800">
              <div>
                <span className="text-gray-500 block text-xs uppercase font-bold">Cast</span>
                <p className="text-gray-200 mt-0.5">
                  {details?.credits?.cast?.slice(0, 4).map(c => c.name).join(', ') || 'Various Actors'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500 block text-xs uppercase font-bold">Genres</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {details?.genres?.map(g => (
                    <span key={g.id} className="bg-gray-800 text-xs px-2 py-0.5 rounded text-gray-300">
                      {g.name}
                    </span>
                  )) || <span className="text-gray-300">Drama, Action, Streaming</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Recommendations */}
          {details?.similar?.results?.length > 0 && (
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {details.similar.results.slice(0, 4).map(sim => (
                  <div 
                    key={sim.id}
                    onClick={() => {
                      onClose();
                      onSelectMovie(sim);
                    }}
                    className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition border border-gray-800"
                  >
                    <img 
                      src={`${POSTER_BASE_URL}${sim.backdrop_path || sim.poster_path}`} 
                      alt={sim.title || sim.name} 
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-white truncate">{sim.title || sim.name}</p>
                      <p className="text-[10px] text-green-400 mt-1">{Math.round((sim.vote_average || 8) * 10)}% Match</p>
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
