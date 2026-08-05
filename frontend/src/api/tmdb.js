import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

export const fetchMoviesByCategory = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.results || [];
  } catch (error) {
    console.warn('Direct TMDB call failed, attempting backend proxy fallback:', error.message);
    try {
      const categoryKey = url.includes('trending') ? 'trending' :
                          url.includes('top_rated') ? 'top-rated' :
                          url.includes('with_genres=28') ? 'action' :
                          url.includes('with_genres=35') ? 'comedy' :
                          url.includes('with_genres=27') ? 'horror' : 'documentaries';
      const proxyRes = await axios.get(`/api/movies/category/${categoryKey}`);
      return proxyRes.data.results || [];
    } catch (e) {
      console.error('Proxy fallback failed:', e);
      return [];
    }
  }
};

export const fetchMovieDetailsAndVideos = async (movieId, mediaType = 'movie') => {
  try {
    const detailsUrl = `${BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,similar`;
    const res = await axios.get(detailsUrl);
    return res.data;
  } catch (error) {
    try {
      const res = await axios.get(`/api/movies/${movieId}?type=${mediaType}`);
      return res.data;
    } catch (e) {
      console.error('Failed to fetch movie details:', e);
      return null;
    }
  }
};

export const searchMoviesApi = async (query) => {
  if (!query || query.trim() === '') return [];
  try {
    const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
    const res = await axios.get(url);
    return res.data.results || [];
  } catch (error) {
    try {
      const res = await axios.get(`/api/movies/search?query=${encodeURIComponent(query)}`);
      return res.data.results || [];
    } catch (e) {
      console.error('Failed to search movies:', e);
      return [];
    }
  }
};
