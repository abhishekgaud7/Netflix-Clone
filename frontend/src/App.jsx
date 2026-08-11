import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';

// LAZY LOAD ALL ROUTE COMPONENTS FOR ULTRA-FAST PERFORMANCE
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProfileSelection = lazy(() => import('./pages/ProfileSelection'));
const HomePage = lazy(() => import('./pages/HomePage'));
const TVShowsPage = lazy(() => import('./pages/TVShowsPage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const NewPopularPage = lazy(() => import('./pages/NewPopularPage'));
const MyListPage = lazy(() => import('./pages/MyListPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

// Sleek Red Netflix Loader Spinner for Suspense Fallback
const NetflixLoader = () => (
  <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-red-600 font-black text-xl tracking-tighter animate-pulse">NETFLIX</span>
  </div>
);

const ProtectedRoute = ({ children, requireProfile = true }) => {
  const { currentUser, selectedProfile } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requireProfile && !selectedProfile) {
    return <Navigate to="/profiles" replace />;
  }

  return children;
};

function AppRoutes() {
  const { currentUser, selectedProfile } = useAuth();

  return (
    <Suspense fallback={<NetflixLoader />}>
      <Routes>
        <Route 
          path="/" 
          element={
            currentUser ? (
              selectedProfile ? <Navigate to="/browse" replace /> : <Navigate to="/profiles" replace />
            ) : (
              <LandingPage />
            )
          } 
        />
        <Route 
          path="/profiles" 
          element={
            <ProtectedRoute requireProfile={false}>
              <ProfileSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/browse" 
          element={
            <ProtectedRoute requireProfile={true}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tv-shows" 
          element={
            <ProtectedRoute requireProfile={true}>
              <TVShowsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies" 
          element={
            <ProtectedRoute requireProfile={true}>
              <MoviesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/latest" 
          element={
            <ProtectedRoute requireProfile={true}>
              <NewPopularPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-list" 
          element={
            <ProtectedRoute requireProfile={true}>
              <MyListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute requireProfile={true}>
              <AccountPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Router>
          <AppRoutes />
        </Router>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;
