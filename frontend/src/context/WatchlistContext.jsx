import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { currentUser, authToken } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [currentUser, authToken]);

  const fetchWatchlist = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/watchlist/${currentUser.uid}`);
      if (res.data && res.data.movies) {
        setWatchlist(res.data.movies);
      }
    } catch (error) {
      console.warn("Failed to fetch watchlist from backend API, using local storage fallback", error.message);
      const local = localStorage.getItem(`watchlist_${currentUser.uid}`);
      if (local) {
        try { setWatchlist(JSON.parse(local)); } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    if (!currentUser) return false;

    const movieIdStr = String(movie.id || movie.movieId);
    const item = {
      movieId: movieIdStr,
      title: movie.title || movie.name || movie.original_name || 'Untitled',
      posterPath: movie.poster_path || movie.posterPath || movie.backdrop_path || '',
      backdropPath: movie.backdrop_path || movie.backdropPath || '',
      mediaType: movie.media_type || movie.mediaType || 'movie',
      overview: movie.overview || '',
      voteAverage: movie.vote_average || movie.voteAverage || 0,
      addedAt: new Date().toISOString()
    };

    // Optimistic update
    setWatchlist(prev => {
      const filtered = prev.filter(m => String(m.movieId) !== movieIdStr);
      const updated = [item, ...filtered];
      localStorage.setItem(`watchlist_${currentUser.uid}`, JSON.stringify(updated));
      return updated;
    });

    try {
      await axios.post('/api/watchlist/add', item);
    } catch (err) {
      console.warn("Watchlist API add fallback saved locally:", err.message);
    }
    return true;
  };

  const removeFromWatchlist = async (movieId) => {
    if (!currentUser) return false;
    const movieIdStr = String(movieId);

    // Optimistic update
    setWatchlist(prev => {
      const updated = prev.filter(m => String(m.movieId) !== movieIdStr);
      localStorage.setItem(`watchlist_${currentUser.uid}`, JSON.stringify(updated));
      return updated;
    });

    try {
      await axios.post('/api/watchlist/remove', { movieId: movieIdStr });
    } catch (err) {
      console.warn("Watchlist API remove fallback saved locally:", err.message);
    }
    return true;
  };

  const isInWatchlist = (movieId) => {
    if (!movieId) return false;
    const movieIdStr = String(movieId);
    return watchlist.some(m => String(m.movieId) === movieIdStr || String(m.id) === movieIdStr);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, fetchWatchlist, loading }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
