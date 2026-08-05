import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { IMAGE_BASE_URL, fetchMovieDetailsAndVideos } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const Banner = ({ movie, onSelectMovie }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (movie) {
      const loadVideo = async () => {
        const details = await fetchMovieDetailsAndVideos(movie.id, movie.media_type || 'movie');
        if (details?.videos?.results?.length > 0) {
          const trailer = details.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') || details.videos.results[0];
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
      };
      loadVideo();
    }
  }, [movie]);

  if (!movie) return null;

  const title = movie.title || movie.name || movie.original_name;
  const overview = movie.overview || 'Experience the thrilling story and spectacular visuals in this critically acclaimed streaming masterpiece.';
  const inList = isInWatchlist(movie.id);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full text-white overflow-hidden bg-black">
      {/* Background Media / Video */}
      {isPlayingTrailer && trailerKey ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none scale-125">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=0&mute=${isMuted ? 1 : 0}&loop=1&playlist=${trailerKey}&rel=0&showinfo=0`}
            title="Banner Trailer"
            className="w-full h-full object-cover"
            allow="autoplay; encrypted-media"
          />
        </div>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 scale-105"
          style={{
            backgroundImage: `url("${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}")`
          }}
        />
      )}

      {/* Dynamic Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />

      {/* Content Container */}
      <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl md:max-w-2xl z-20 space-y-4">
        {/* Title */}
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-shadow-lg leading-none">
          {title}
        </h1>

        {/* Badges & Rating */}
        <div className="flex items-center space-x-3 text-xs md:text-sm font-semibold">
          <span className="text-green-400 font-bold">
            {Math.round((movie.vote_average || 8.5) * 10)}% Match
          </span>
          <span className="border border-gray-500 px-1.5 py-0.5 rounded text-gray-300">
            {movie.adult ? '18+' : '13+'}
          </span>
          <span className="text-gray-300">
            {movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || '2024'}
          </span>
          <span className="border border-gray-400 px-1 text-[10px] text-gray-300 font-medium">HD</span>
        </div>

        {/* Overview */}
        <p className="text-gray-200 text-sm md:text-base line-clamp-3 md:line-clamp-4 font-normal text-shadow-md max-w-lg">
          {overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button 
            onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
            className="flex items-center space-x-2 bg-white text-black font-bold px-5 md:px-8 py-2.5 rounded hover:bg-white/80 transition duration-200 shadow-lg text-sm md:text-base cursor-pointer"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>{isPlayingTrailer ? 'Pause' : 'Play'}</span>
          </button>

          <button 
            onClick={() => onSelectMovie(movie)}
            className="flex items-center space-x-2 bg-gray-600/70 hover:bg-gray-600/90 text-white font-semibold px-4 md:px-6 py-2.5 rounded backdrop-blur-md transition duration-200 text-sm md:text-base cursor-pointer"
          >
            <Info className="w-5 h-5" />
            <span>More Info</span>
          </button>

          <button
            onClick={handleWatchlistToggle}
            className="p-2.5 rounded-full border-2 border-gray-400 hover:border-white bg-black/40 hover:bg-black/70 backdrop-blur transition text-white"
            title={inList ? "Remove from My List" : "Add to My List"}
          >
            {inList ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
          </button>

          {isPlayingTrailer && trailerKey && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full border border-gray-400 hover:border-white bg-black/40 text-white transition ml-auto"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
