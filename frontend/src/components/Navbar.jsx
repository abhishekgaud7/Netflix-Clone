import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, ChevronDown, LogOut, User, X } from 'lucide-react';

const Navbar = ({ onSearchChange, searchQuery }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 px-4 md:px-12 py-3 flex items-center justify-between ${
      isScrolled ? 'bg-[#141414]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
    }`}>
      {/* Left section: Logo & Nav Links */}
      <div className="flex items-center space-x-8">
        <div 
          onClick={() => navigate('/browse')}
          className="cursor-pointer transition hover:opacity-80 flex items-center"
        >
          <span className="text-red-600 font-black text-2xl md:text-3xl tracking-tighter drop-shadow">NETFLIX</span>
        </div>

        <ul className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
          <li 
            onClick={() => navigate('/browse')}
            className={`cursor-pointer transition duration-200 hover:text-white font-medium hover:scale-105 ${location.pathname === '/browse' ? 'text-white font-bold border-b-2 border-red-600 pb-0.5' : ''}`}
          >
            Home
          </li>
          <li 
            onClick={() => navigate('/browse')}
            className="cursor-pointer transition duration-200 hover:text-white font-medium hover:scale-105"
          >
            TV Shows
          </li>
          <li 
            onClick={() => navigate('/browse')}
            className="cursor-pointer transition duration-200 hover:text-white font-medium hover:scale-105"
          >
            Movies
          </li>
          <li 
            onClick={() => navigate('/browse')}
            className="cursor-pointer transition duration-200 hover:text-white font-medium hover:scale-105"
          >
            New & Popular
          </li>
          <li 
            onClick={() => navigate('/my-list')}
            className={`cursor-pointer transition duration-200 hover:text-white font-medium hover:scale-105 ${location.pathname === '/my-list' ? 'text-white font-bold border-b-2 border-red-600 pb-0.5' : ''}`}
          >
            My List
          </li>
        </ul>
      </div>

      {/* Right section: Search, Notifications, Profile */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Search Bar with Hover Auto-Expand */}
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
                placeholder="Titles, people, genres..."
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

        {/* Profile Dropdown with Hover Open/Close */}
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
  );
};

export default Navbar;
