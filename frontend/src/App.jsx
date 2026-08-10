import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';

import LandingPage from './pages/LandingPage';
import ProfileSelection from './pages/ProfileSelection';
import HomePage from './pages/HomePage';
import TVShowsPage from './pages/TVShowsPage';
import MoviesPage from './pages/MoviesPage';
import NewPopularPage from './pages/NewPopularPage';
import MyListPage from './pages/MyListPage';
import AccountPage from './pages/AccountPage';

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
