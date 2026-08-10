import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import MovieModal from '../components/MovieModal';
import { requests, fetchMoviesByCategory, POSTER_BASE_URL, searchMoviesApi } from '../api/tmdb';
import { Bell, Check, Flame } from 'lucide-react';

const NewPopularPage = () => {
  const [top10, setTop10] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reminders, setReminders] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const trending = await fetchMoviesByCategory(requests.fetchTrending);
      setTop10(trending.slice(0, 10));
      if (trending.length > 0) setFeatured(trending[0]);

      const upcomingData = await fetchMoviesByCategory(requests.fetchUpcomingMovies);
      setUpcoming(upcomingData.filter(m => m.poster_path || m.backdrop_path));
    };
    loadData();
  }, []);

  const toggleReminder = (id) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-red-600 pb-16">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <Banner movie={featured} onSelectMovie={setSelectedMovie} />

      <div className="-mt-12 md:-mt-24 relative z-20 space-y-8 px-4 md:px-12">
        {/* TOP 10 TODAY ROW WITH NUMBER BADGES */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-3xl font-black text-white flex items-center space-x-2">
            <Flame className="w-7 h-7 text-red-600 fill-red-600" />
            <span>Top 10 Movies & TV Shows Today</span>
          </h2>

          <div className="flex items-center space-x-4 md:space-x-6 overflow-x-scroll no-scrollbar py-4 px-1">
            {top10.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedMovie(item)}
                className="relative flex-none cursor-pointer flex items-center group/top10"
              >
                {/* Giant Number Badge */}
                <span className="text-7xl md:text-9xl font-black text-outline text-transparent select-none drop-shadow-2xl z-10 -mr-4 md:-mr-8 group-hover/top10:scale-110 transition-transform">
                  {idx + 1}
                </span>

                {/* Poster Card */}
                <div className="w-32 md:w-48 h-48 md:h-72 rounded-lg overflow-hidden bg-gray-900 shadow-2xl border border-gray-800 transform transition duration-300 group-hover/top10:scale-105">
                  <img
                    src={`${POSTER_BASE_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING RELEASES / COMING SOON */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-3xl font-black text-white">Worth the Wait: Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {upcoming.slice(0, 6).map(item => (
              <div 
                key={item.id}
                onClick={() => setSelectedMovie(item)}
                className="bg-gray-900/80 rounded-xl overflow-hidden border border-gray-800 cursor-pointer hover:border-gray-600 transition flex flex-col md:flex-row group"
              >
                <img
                  src={`${POSTER_BASE_URL}${item.backdrop_path || item.poster_path}`}
                  alt={item.title}
                  className="w-full md:w-48 h-44 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-red-500 transition">{item.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.overview || 'Coming soon to Netflix.'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-red-500">Coming {item.release_date || 'Soon'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReminder(item.id);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        reminders[item.id] ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      {reminders[item.id] ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                      <span>{reminders[item.id] ? 'Reminded' : 'Remind Me'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TRENDING ROWS */}
        <Row title="Trending Movies This Week" fetchUrl={requests.fetchTrendingMovies} onSelectMovie={setSelectedMovie} />
        <Row title="Top Series This Week" fetchUrl={requests.fetchTrendingTV} onSelectMovie={setSelectedMovie} />
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

export default NewPopularPage;
