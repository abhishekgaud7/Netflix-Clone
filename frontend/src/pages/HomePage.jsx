import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import MovieModal from '../components/MovieModal';
import { requests, fetchMoviesByCategory, searchMoviesApi, POSTER_BASE_URL } from '../api/tmdb';

const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load featured banner movie based on activeCategory
  useEffect(() => {
    const loadFeatured = async () => {
      let targetUrl = requests.fetchTrending;
      if (activeCategory === 'tv') {
        targetUrl = requests.fetchNetflixOriginals;
      } else if (activeCategory === 'movies') {
        targetUrl = requests.fetchTopRated;
      } else if (activeCategory === 'popular') {
        targetUrl = requests.fetchActionMovies;
      }

      const list = await fetchMoviesByCategory(targetUrl);
      if (list.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(6, list.length));
        setFeaturedMovie(list[randomIndex]);
      }
    };
    loadFeatured();
  }, [activeCategory]);

  // Debounced search trigger
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
      {/* Top Navbar */}
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main Content: Search Overlay vs Browse Dashboard */}
      {searchQuery ? (
        <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-200">
            Search Results for <span className="text-red-500 font-extrabold">"{searchQuery}"</span>
          </h2>

          {isSearching && searchResults.length === 0 ? (
            <p className="text-gray-400">Searching streaming catalog...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-gray-400 py-12 text-center">No movies or TV shows found matching your search.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {searchResults.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="bg-gray-900 rounded-md overflow-hidden cursor-pointer hover:scale-105 transition transform shadow-lg group border border-gray-800"
                >
                  <img
                    src={`${POSTER_BASE_URL}${movie.poster_path || movie.backdrop_path}`}
                    alt={movie.title || movie.name}
                    className="w-full h-64 md:h-72 object-cover group-hover:brightness-90 transition"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white truncate">{movie.title || movie.name}</h3>
                    <p className="text-xs text-green-400 font-medium mt-1">
                      {Math.round((movie.vote_average || 8) * 10)}% Match
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Top Hero Banner */}
          <Banner movie={featuredMovie} onSelectMovie={setSelectedMovie} />

          {/* DYNAMIC CATEGORY FILTER ROWS */}
          <div className="-mt-12 md:-mt-24 relative z-20 space-y-4">
            {activeCategory === 'home' && (
              <>
                <Row title="Trending Now" fetchUrl={requests.fetchTrending} isLarge={true} onSelectMovie={setSelectedMovie} />
                <Row title="Netflix Originals" fetchUrl={requests.fetchNetflixOriginals} onSelectMovie={setSelectedMovie} />
                <Row title="Top Rated Masterpieces" fetchUrl={requests.fetchTopRated} onSelectMovie={setSelectedMovie} />
                <Row title="Action Blockbusters" fetchUrl={requests.fetchActionMovies} onSelectMovie={setSelectedMovie} />
                <Row title="Comedy Hits" fetchUrl={requests.fetchComedyMovies} onSelectMovie={setSelectedMovie} />
                <Row title="Spooky & Horror" fetchUrl={requests.fetchHorrorMovies} onSelectMovie={setSelectedMovie} />
                <Row title="Documentaries & Real Stories" fetchUrl={requests.fetchDocumentaries} onSelectMovie={setSelectedMovie} />
              </>
            )}

            {activeCategory === 'tv' && (
              <>
                <Row title="Popular TV Series" fetchUrl={requests.fetchNetflixOriginals} isLarge={true} onSelectMovie={setSelectedMovie} />
                <Row title="Trending TV Shows" fetchUrl={requests.fetchTrending} onSelectMovie={setSelectedMovie} />
                <Row title="Comedy Series" fetchUrl={requests.fetchComedyMovies} onSelectMovie={setSelectedMovie} />
                <Row title="Romance & Drama" fetchUrl={requests.fetchRomanceMovies} onSelectMovie={setSelectedMovie} />
              </>
            )}

            {activeCategory === 'movies' && (
              <>
                <Row title="Top Rated Movies" fetchUrl={requests.fetchTopRated} isLarge={true} onSelectMovie={setSelectedMovie} />
                <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} onSelectMovie={setSelectedMovie} />
                <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onSelectMovie={setSelectedMovie} />
                <Row title="Romantic Movies" fetchUrl={requests.fetchRomanceMovies} onSelectMovie={setSelectedMovie} />
                <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} onSelectMovie={setSelectedMovie} />
              </>
            )}

            {activeCategory === 'popular' && (
              <>
                <Row title="Trending Today" fetchUrl={requests.fetchTrending} isLarge={true} onSelectMovie={setSelectedMovie} />
                <Row title="Critically Acclaimed" fetchUrl={requests.fetchTopRated} onSelectMovie={setSelectedMovie} />
                <Row title="Popular Action Hits" fetchUrl={requests.fetchActionMovies} onSelectMovie={setSelectedMovie} />
              </>
            )}
          </div>
        </>
      )}

      {/* Detail View Modal */}
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

export default HomePage;
