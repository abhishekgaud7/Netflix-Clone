import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Info } from 'lucide-react';
import { POSTER_BASE_URL, fetchMoviesByCategory } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const Row = ({ title, fetchUrl, isLarge = false, onSelectMovie }) => {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    const getMovies = async () => {
      const data = await fetchMoviesByCategory(fetchUrl);
      setMovies(data.filter(m => m.poster_path || m.backdrop_path));
    };
    getMovies();
  }, [fetchUrl]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies.length) return null;

  return (
    <div className="space-y-2 md:space-y-3 my-4 md:my-8 px-4 md:px-12 group/row relative">
      <h2 className="text-lg md:text-2xl font-bold text-white tracking-wide transition-colors duration-200 hover:text-red-500 cursor-pointer flex items-center">
        {title}
        <span className="text-xs text-red-500 font-semibold opacity-0 group-hover/row:opacity-100 transition-opacity ml-2">Explore all &rsaquo;</span>
      </h2>

      <div className="relative group">
        {/* Scroll Left Button */}
        <button 
          onClick={() => handleScroll('left')}
          className="absolute top-0 bottom-0 left-0 bg-black/60 hover:bg-black/80 text-white z-30 flex items-center justify-center w-10 md:w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-md cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Movies Track */}
        <div 
          ref={rowRef}
          className="flex items-center space-x-3 md:space-x-4 overflow-x-scroll no-scrollbar py-4 px-1 scroll-smooth"
        >
          {movies.map((movie) => {
            const path = isLarge ? movie.poster_path : (movie.backdrop_path || movie.poster_path);
            if (!path) return null;
            const inList = isInWatchlist(movie.id);

            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className={`relative flex-none cursor-pointer rounded-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl hover:shadow-red-950/40 group/card bg-gray-900 ${
                  isLarge ? 'w-36 md:w-52 h-52 md:h-76' : 'w-44 md:w-64 h-28 md:h-38'
                }`}
              >
                <img
                  src={`${POSTER_BASE_URL}${path}`}
                  alt={movie.title || movie.name}
                  className="w-full h-full object-cover rounded-md group-hover/card:brightness-90 transition"
                  loading="lazy"
                />

                {/* Hover Details Card Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                  <p className="text-xs md:text-sm font-bold text-white truncate drop-shadow">
                    {movie.title || movie.name}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] md:text-xs font-bold text-green-400">
                      {Math.round((movie.vote_average || 8) * 10)}% Match
                    </span>
                    <span className="text-[10px] border border-gray-400 px-1 rounded text-gray-300">
                      {movie.adult ? '18+' : '13+'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectMovie(movie); }}
                      className="p-1.5 bg-white text-black rounded-full hover:bg-white/80 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
                      }}
                      className="p-1.5 border border-gray-400 rounded-full hover:border-white text-white transition bg-black/50"
                    >
                      {inList ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectMovie(movie); }}
                      className="p-1.5 border border-gray-400 rounded-full hover:border-white text-white transition bg-black/50 ml-auto"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button 
          onClick={() => handleScroll('right')}
          className="absolute top-0 bottom-0 right-0 bg-black/60 hover:bg-black/80 text-white z-30 flex items-center justify-center w-10 md:w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-md cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Row;
