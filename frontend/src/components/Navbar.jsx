import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, ChevronDown, LogOut, User, Settings, X, Dices, Globe } from 'lucide-react';
import CinemaRouletteModal from './CinemaRouletteModal';
import { fetchMoviesByCategory, requests } from '../api/tmdb';

const Navbar = ({ onSearchChange, searchQuery, activeCategory = 'home', onCategoryChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [lang, setLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [rouletteMovies, setRouletteMovies] = useState([]);
  const { selectedProfile, setSelectedProfile, profiles, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenRoulette = async () => {
    if (rouletteMovies.length === 0) {
      const data = await fetchMoviesByCategory(requests.fetchTrending);
      setRouletteMovies(data);
    }
    setShowRoulette(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleNavClick = (path, catKey) => {
    if (catKey && onCategoryChange) {
      onCategoryChange(catKey);
    }
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 px-4 md:px-12 py-3 flex items-center justify-between ${
        isScrolled ? 'bg-[#141414]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}>
        {/* Left section: Logo & Nav Links */}
        <div className="flex items-center space-x-6 md:space-x-8">
          <div 
            onClick={() => handleNavClick('/browse', 'home')}
            className="cursor-pointer transition hover:opacity-80 flex items-center"
          >
            <span className="text-red-600 font-black text-2xl md:text-3xl tracking-tighter drop-shadow">NETFLIX</span>
          </div>

          <ul className="hidden md:flex items-center space-x-2 lg:space-x-4 text-sm">
            <li 
              onClick={() => handleNavClick('/browse', 'home')}
              onMouseEnter={() => handleNavClick('/browse', 'home')}
              className={`px-3 py-1 rounded cursor-pointer transition-all duration-200 font-bold ${
                location.pathname === '/browse' 
                  ? 'bg-red-600 text-white shadow-md scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {lang === 'हिन्दी' ? 'होम' : 'Home'}
            </li>

            <li 
              onClick={() => handleNavClick('/tv-shows')}
              onMouseEnter={() => handleNavClick('/tv-shows')}
              className={`px-3 py-1 rounded cursor-pointer transition-all duration-200 font-bold ${
                location.pathname === '/tv-shows' 
                  ? 'bg-red-600 text-white shadow-md scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {lang === 'हिन्दी' ? 'टीवी शो' : 'TV Shows'}
            </li>

            <li 
              onClick={() => handleNavClick('/movies')}
              onMouseEnter={() => handleNavClick('/movies')}
              className={`px-3 py-1 rounded cursor-pointer transition-all duration-200 font-bold ${
                location.pathname === '/movies' 
                  ? 'bg-red-600 text-white shadow-md scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {lang === 'हिन्दी' ? 'फिल्मों' : 'Movies'}
            </li>

            <li 
              onClick={() => handleNavClick('/latest')}
              onMouseEnter={() => handleNavClick('/latest')}
              className={`px-3 py-1 rounded cursor-pointer transition-all duration-200 font-bold ${
                location.pathname === '/latest' 
                  ? 'bg-red-600 text-white shadow-md scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {lang === 'हिन्दी' ? 'नई और लोकप्रिय' : 'New & Popular'}
            </li>

            <li 
              onClick={() => handleNavClick('/my-list')}
              onMouseEnter={() => handleNavClick('/my-list')}
              className={`px-3 py-1 rounded cursor-pointer transition-all duration-200 font-bold ${
                location.pathname === '/my-list' 
                  ? 'bg-red-600 text-white shadow-md scale-105' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {lang === 'हिन्दी' ? 'मेरी सूची' : 'My List'}
            </li>
          </ul>
        </div>

        {/* Right section: Search, Language Switcher, AI Roulette, Notifications, Profile */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Global Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 bg-gray-900 border border-gray-700 hover:border-white px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-200 transition cursor-pointer"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-4 h-4 text-red-500" />
              <span>{lang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-black/95 border border-gray-800 rounded-xl p-2 shadow-2xl z-50 text-xs">
                <div 
                  onClick={() => { setLang('English'); setShowLangMenu(false); }}
                  className={`px-3 py-2 rounded cursor-pointer font-semibold transition ${lang === 'English' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  English
                </div>
                <div 
                  onClick={() => { setLang('हिन्दी'); setShowLangMenu(false); }}
                  className={`px-3 py-2 rounded cursor-pointer font-semibold transition ${lang === 'हिन्दी' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  हिन्दी (Hindi)
                </div>
              </div>
            )}
          </div>

          {/* AI Cinema Roulette Button */}
          <button
            onClick={handleOpenRoulette}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg transition cursor-pointer"
            title="Spin the Wheel: Can't Decide What to Watch?"
          >
            <Dices className="w-4 h-4" />
            <span className="hidden sm:inline">AI Roulette</span>
          </button>

          {/* Search Bar */}
          <div 
            onMouseEnter={() => setShowSearch(true)}
            className="relative flex items-center"
          >
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className="p-1 text-gray-200 hover:text-white transition focus:outline-none cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {showSearch && (
              <div className="flex items-center bg-black/95 border border-gray-600 rounded px-2 py-1 ml-2 transition-all duration-300 shadow-xl">
                <input
                  type="text"
                  placeholder={lang === 'हिन्दी' ? "खोजें..." : "Titles, people, genres..."}
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-36 md:w-56 px-1"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange && onSearchChange('')}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="text-gray-200 hover:text-white transition hidden sm:block relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-2 h-2"></span>
          </button>

          {/* Profile Dropdown */}
          <div 
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            className="relative py-1"
          >
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 cursor-pointer focus:outline-none group"
            >
              <img 
                src={selectedProfile?.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"} 
                alt="Avatar"
                className="w-8 h-8 rounded border border-transparent group-hover:border-white transition object-cover" 
              />
              <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-1 w-56 bg-black/95 border border-gray-800 rounded-md shadow-2xl py-2 z-50 divide-y divide-gray-800 text-sm">
                <div className="py-2 px-3 space-y-2">
                  <p className="text-xs text-gray-400 font-medium uppercase px-2">Profiles</p>
                  {profiles.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedProfile(p);
                        setShowDropdown(false);
                        navigate('/browse');
                      }}
                      className={`flex items-center space-x-3 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-800/80 transition ${
                        selectedProfile?.id === p.id ? 'bg-gray-800/50' : ''
                      }`}
                    >
                      <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded" />
                      <span className="text-white text-xs font-medium truncate">{p.name}</span>
                    </div>
                  ))}
                  
                  <div 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profiles');
                    }}
                    className="flex items-center space-x-3 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-800/80 text-gray-300 hover:text-white transition"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs">Manage Profiles</span>
                  </div>

                  <div 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/account');
                    }}
                    className="flex items-center space-x-3 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-800/80 text-gray-300 hover:text-white transition"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-xs">Account Settings</span>
                  </div>
                </div>

                <div className="pt-2 px-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 text-left py-2 px-2 text-xs text-gray-300 hover:text-red-500 hover:bg-gray-900 rounded transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Netflix</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* AI Cinema Roulette Modal */}
      {showRoulette && (
        <CinemaRouletteModal 
          movies={rouletteMovies} 
          onClose={() => setShowRoulette(false)}
          onSelectMovie={(mov) => {
            setShowRoulette(false);
            if (mov) {
              window.dispatchEvent(new CustomEvent('openMovieDetails', { detail: mov }));
            }
          }} 
        />
      )}
    </>
  );
};

export default Navbar;
