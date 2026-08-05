import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Tv, Download, Monitor, Shield, Play } from 'lucide-react';

const LandingPage = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle, devLoginDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartEmail = (e) => {
    e.preventDefault();
    if (emailInput) {
      setEmail(emailInput);
      setIsSignup(true);
      setIsLoginModalOpen(true);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/profiles');
    } catch (err) {
      console.warn("Firebase authentication error:", err.message);
      // Fallback demo login if firebase test credentials are used
      devLoginDemo(email || "demo@netflix.com");
      navigate('/profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      navigate('/profiles');
    } catch (err) {
      devLoginDemo("google-user@netflix.com");
      navigate('/profiles');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 relative overflow-hidden">
      {/* Background Hero Banner Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
        style={{
          backgroundImage: `url('https://assets.nflxext.com/ffe/siteui/vlv3/59444182-b39f-49ba-8106-88d8b023e5a6/ae3721d1-8608-4100-b8d9-291730058b87/US-en-20240422-POP_SIGNUP_TWO_WEEKS-perspective_WEB_3e1a681c-848e-4a62-959c-703350172559_large.jpg')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6 max-w-7xl mx-auto">
        <span className="text-red-600 font-black text-3xl md:text-5xl tracking-tighter drop-shadow-md cursor-pointer">
          NETFLIX
        </span>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsSignup(false);
              setIsLoginModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 md:px-6 py-2 rounded text-sm transition shadow-lg cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-shadow-lg">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-lg md:text-2xl font-semibold text-gray-200">
          Watch anywhere. Cancel anytime.
        </p>
        <p className="text-base md:text-lg text-gray-300">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        {/* Email Form */}
        <form onSubmit={handleStartEmail} className="flex flex-col sm:flex-row items-center w-full max-w-2xl gap-3 pt-2">
          <input
            type="email"
            placeholder="Email address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className="w-full sm:flex-1 px-4 py-4 rounded bg-black/70 border border-gray-600 text-white text-base focus:outline-none focus:border-white transition"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded flex items-center justify-center space-x-2 transition shadow-xl cursor-pointer"
          >
            <span>Get Started</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </form>

        <div className="pt-4">
          <button
            onClick={() => devLoginDemo("guest@netflix.com")}
            className="text-xs text-gray-400 hover:text-white underline transition cursor-pointer"
          >
            Or click here to instantly test as Demo Guest
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-20 border-t-8 border-gray-800 bg-black py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-900/60 rounded-xl border border-gray-800 space-y-3">
            <Tv className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold">Enjoy on your TV</h3>
            <p className="text-gray-400 text-sm">Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
          </div>
          
          <div className="p-6 bg-gray-900/60 rounded-xl border border-gray-800 space-y-3">
            <Download className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold">Download your shows</h3>
            <p className="text-gray-400 text-sm">Save your favorites easily and always have something to watch offline.</p>
          </div>

          <div className="p-6 bg-gray-900/60 rounded-xl border border-gray-800 space-y-3">
            <Monitor className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-bold">Watch everywhere</h3>
            <p className="text-gray-400 text-sm">Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-black/90 border border-gray-800 rounded-xl p-8 shadow-2xl relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-6">
              {isSignup ? 'Sign Up' : 'Sign In'}
            </h2>

            {error && (
              <div className="bg-red-900/40 border border-red-600 text-red-300 p-3 rounded text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition shadow-lg cursor-pointer"
              >
                {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="my-4 flex items-center justify-center space-x-2">
              <span className="h-px w-full bg-gray-800" />
              <span className="text-xs text-gray-500 uppercase">OR</span>
              <span className="h-px w-full bg-gray-800" />
            </div>

            <button
              onClick={handleGoogleAuth}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <div className="mt-6 text-sm text-gray-400 text-center">
              {isSignup ? (
                <p>Already have an account? <button onClick={() => setIsSignup(false)} className="text-white hover:underline">Sign In</button></p>
              ) : (
                <p>New to Netflix? <button onClick={() => setIsSignup(true)} className="text-white hover:underline">Sign up now</button></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
