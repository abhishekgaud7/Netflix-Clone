import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import MovieModal from '../components/MovieModal';
import { requests, fetchMoviesByCategory, POSTER_BASE_URL, searchMoviesApi } from '../api/tmdb';

const TVShowsPage = () => {
  const [featuredShow, setFeaturedShow] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadFeatured = async () => {
      const tvList = await fetchMoviesByCategory(requests.fetchNetflixOriginals);
      if (tvList.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(6, tvList.length));
        setFeaturedShow(tvList[randomIndex]);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchMoviesApi(searchQuery);
      setSearchResults(results.filter(m => m.poster_path || m.backdrop_path));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-red-600 pb-16">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {searchQuery ? (
        <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-200">
            Search Results for <span className="text-red-500 font-extrabold">"{searchQuery}"</span>
          </h2>
          {isSearching && searchResults.length === 0 ? (
            <p className="text-gray-400">Searching streaming catalog...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {searchResults.map(show => (
                <div
                  key={show.id}
                  onClick={() => setSelectedMovie(show)}
                  className="bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:scale-105 transition transform shadow-lg group border border-gray-800"
                >
                  <img
                    src={`${POSTER_BASE_URL}${show.poster_path || show.backdrop_path}`}
                    alt={show.title || show.name}
                    className="w-full h-64 md:h-72 object-cover group-hover:brightness-90 transition"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white truncate">{show.title || show.name}</h3>
                    <p className="text-xs text-green-400 font-medium mt-1">
                      {Math.round((show.vote_average || 8) * 10)}% Match
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <Banner movie={featuredShow} onSelectMovie={setSelectedMovie} />

          <div className="-mt-12 md:-mt-24 relative z-20 space-y-4">
            <Row title="Netflix Original Series" fetchUrl={requests.fetchNetflixOriginals} isLarge={true} onSelectMovie={setSelectedMovie} />
            <Row title="Trending TV Shows" fetchUrl={requests.fetchTrendingTV} onSelectMovie={setSelectedMovie} />
            <Row title="Crime & Thriller Series" fetchUrl={requests.fetchCrimeSeries} onSelectMovie={setSelectedMovie} />
            <Row title="Anime & Animated Series" fetchUrl={requests.fetchAnimeSeries} onSelectMovie={setSelectedMovie} />
            <Row title="Comedy Series" fetchUrl={requests.fetchComedyMovies} onSelectMovie={setSelectedMovie} />
          </div>
        </>
      )}

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

export default TVShowsPage;
