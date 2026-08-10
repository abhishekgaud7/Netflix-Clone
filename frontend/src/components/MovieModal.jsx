import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Star, Calendar, Film, Image as ImageIcon, Video, ThumbsUp, ThumbsDown, MessageSquare, Volume2, Play } from 'lucide-react';
import { IMAGE_BASE_URL, POSTER_BASE_URL, fetchMovieDetailsAndVideos } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop';

const DUMMY_EPISODES = [
  { id: 1, title: 'Episode 1: Chapter One - The Vanishing', duration: '50m', overview: 'On his way home from a friend’s house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.' },
  { id: 2, title: 'Episode 2: Chapter Two - The Weirdo on Maple Street', duration: '55m', overview: 'Lucas, Dustin and Mike try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about a disturbing phone call.' },
  { id: 3, title: 'Episode 3: Chapter Three - Holly, Jolly', duration: '51m', overview: 'An increasingly frantic Joyce believes Will is trying to communicate with her. Eleven has flashbacks of her past experiments.' },
  { id: 4, title: 'Episode 4: Chapter Four - The Body', duration: '53m', overview: 'Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover to blend in at school.' }
];

const MovieModal = ({ movie, onClose, onSelectMovie }) => {
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(true);
  const [userRating, setUserRating] = useState(null); // 'like', 'dislike', 'superlike'
  const [activeSeason, setActiveSeason] = useState(1);
  const [audioLang, setAudioLang] = useState('English [Original] 5.1');
  const [subtitleLang, setSubtitleLang] = useState('English [CC]');
  const [showAudioMenu, setShowAudioMenu] = useState(false);

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
            const trailers = data.videos.results.filter(v => v.site === 'YouTube');
            const officialTrailer = trailers.find(v => v.type === 'Trailer' && v.name?.toLowerCase().includes('official')) ||
                                  trailers.find(v => v.type === 'Trailer') ||
                                  trailers[0];
            if (officialTrailer) setTrailerKey(officialTrailer.key);
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
  const isTvShow = movie.media_type === 'tv' || movie.first_air_date || details?.number_of_seasons;

  const getMediaUrl = (path) => {
    if (path && path !== 'null' && path !== 'undefined') {
      return `${IMAGE_BASE_URL}${path}`;
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
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#181818] rounded-2xl overflow-y-auto no-scrollbar shadow-2xl border border-gray-800 my-auto flex flex-col">
        
        {/* Top Header Bar with Close & Media Toggle */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#181818]/95 backdrop-blur-md border-b border-gray-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-red-600 font-extrabold tracking-wider text-xs sm:text-sm">
              <Film className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>NETFLIX PREVIEW</span>
            </div>

            {/* Media Mode Toggle */}
            {trailerKey && (
              <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setShowTrailer(true)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md font-semibold transition ${
                    showTrailer ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Trailer</span>
                </button>
                <button
                  onClick={() => setShowTrailer(false)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md font-semibold transition ${
                    !showTrailer ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Poster</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-red-600 text-white p-2 rounded-full border border-gray-600 hover:border-white transition cursor-pointer flex items-center justify-center shadow-lg"
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MEDIA DISPLAY CONTAINER */}
        <div className="relative w-full h-[250px] sm:h-[360px] md:h-[440px] bg-black overflow-hidden shrink-0">
          {showTrailer && trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="Movie Trailer"
              className="w-full h-full border-0 block"
              style={{ width: '100%', height: '100%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={getMediaUrl(movie.backdrop_path || movie.poster_path)} 
                alt={title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30" />
            </div>
          )}
        </div>

        {/* Content Body Below Video */}
        <div className="p-6 md:p-8 space-y-6 flex-1">
          {/* Title & Action Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">{title}</h2>

            <div className="flex items-center space-x-3">
              {/* Like / Dislike Rating Controls */}
              <button 
                onClick={() => setUserRating(userRating === 'like' ? null : 'like')}
                className={`p-2.5 rounded-full border border-gray-600 transition cursor-pointer ${
                  userRating === 'like' ? 'bg-white text-black border-white' : 'bg-gray-900 text-gray-300 hover:text-white hover:border-white'
                }`}
                title="I like this"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setUserRating(userRating === 'dislike' ? null : 'dislike')}
                className={`p-2.5 rounded-full border border-gray-600 transition cursor-pointer ${
                  userRating === 'dislike' ? 'bg-red-600 text-white border-red-600' : 'bg-gray-900 text-gray-300 hover:text-white hover:border-white'
                }`}
                title="Not for me"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>

              {/* Add to Watchlist */}
              <button 
                onClick={handleWatchlistToggle}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-bold text-sm transition cursor-pointer shadow-xl ${
                  inList ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{inList ? 'In Watchlist' : 'Add to My List'}</span>
              </button>
            </div>
          </div>

          {/* Metadata Badges & Audio/Subtitles Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-gray-300">
              <span className="text-green-400 font-bold text-base">
                {userRating === 'like' ? '98%' : Math.round((movie.vote_average || details?.vote_average || 8.5) * 10)}% Match
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
              <span className="border border-red-600 text-red-500 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase">Ultra HD 4K</span>
            </div>

            {/* Audio & Subtitles Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowAudioMenu(!showAudioMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-white rounded-lg text-xs font-semibold text-gray-300 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                <span>Audio & Subtitles</span>
              </button>

              {showAudioMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-black/95 border border-gray-800 rounded-xl p-4 shadow-2xl z-50 space-y-3 text-xs">
                  <div>
                    <span className="text-gray-500 block uppercase font-bold text-[10px] mb-1">Audio</span>
                    {['English [Original] 5.1', 'Hindi Dolby Atmos', 'Spanish 5.1'].map(lang => (
                      <div 
                        key={lang}
                        onClick={() => setAudioLang(lang)}
                        className={`px-2 py-1 rounded cursor-pointer transition ${audioLang === lang ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-800 pt-2">
                    <span className="text-gray-500 block uppercase font-bold text-[10px] mb-1">Subtitles</span>
                    {['English [CC]', 'Hindi', 'Off'].map(sub => (
                      <div 
                        key={sub}
                        onClick={() => setSubtitleLang(sub)}
                        className={`px-2 py-1 rounded cursor-pointer transition ${subtitleLang === sub ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">{overview}</p>
            </div>

            {/* Cast & Info Sidebar */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-400 bg-gray-900/80 p-4 rounded-lg border border-gray-800">
              <div>
                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Cast</span>
                <p className="text-gray-200 mt-1 font-medium">
                  {details?.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'Various Actors'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Genres</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {details?.genres?.map(g => (
                    <span key={g.id} className="bg-gray-800 text-xs px-2.5 py-1 rounded text-gray-300 font-medium">
                      {g.name}
                    </span>
                  )) || <span className="text-gray-300">Drama, Action, Streaming</span>}
                </div>
              </div>
            </div>
          </div>

          {/* SEASONS & EPISODES SECTION (For TV Shows & Series) */}
          {isTvShow && (
            <div className="pt-4 border-t border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Episodes</h3>
                <select 
                  value={activeSeason}
                  onChange={(e) => setActiveSeason(Number(e.target.value))}
                  className="bg-gray-900 border border-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded focus:outline-none cursor-pointer"
                >
                  <option value={1}>Season 1</option>
                  <option value={2}>Season 2</option>
                  <option value={3}>Season 3</option>
                </select>
              </div>

              <div className="space-y-3">
                {DUMMY_EPISODES.map(ep => (
                  <div key={ep.id} className="flex items-start space-x-4 p-3 bg-gray-900/60 rounded-xl border border-gray-800 hover:bg-gray-800/80 transition group">
                    <div className="relative w-28 sm:w-36 h-18 sm:h-20 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                      <img src={getMediaUrl(movie.backdrop_path || movie.poster_path)} alt={ep.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{ep.title}</span>
                        <span className="text-gray-400">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{ep.overview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Recommendations */}
          {details?.similar?.results?.length > 0 && (
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {details.similar.results.slice(0, 4).map(sim => (
                  <div 
                    key={sim.id}
                    onClick={() => {
                      onClose();
                      onSelectMovie(sim);
                    }}
                    className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition border border-gray-800 flex flex-col"
                  >
                    <img 
                      src={getMediaUrl(sim.backdrop_path || sim.poster_path)} 
                      alt={sim.title || sim.name} 
                      className="w-full h-28 object-cover bg-gray-800"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div className="p-2.5 bg-gray-900 flex-1">
                      <p className="text-xs font-bold text-white truncate">{sim.title || sim.name}</p>
                      <p className="text-[10px] text-green-400 font-semibold mt-1">{Math.round((sim.vote_average || 8) * 10)}% Match</p>
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
