import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext();

export const DEFAULT_AVATARS = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
  'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-dyrp2f122wsp7b1g.jpg',
  'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wfduzr1qcsypf8.jpg',
  'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-vntt1ch1b2w7abtt.jpg'
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([
    { id: '1', name: 'User 1', avatarUrl: DEFAULT_AVATARS[0] },
    { id: '2', name: 'Kids', avatarUrl: DEFAULT_AVATARS[1] },
    { id: '3', name: 'Family', avatarUrl: DEFAULT_AVATARS[2] }
  ]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setCurrentUser(user);
        } catch (e) {
          console.warn("Could not retrieve ID token, using fallback dev token", e);
          const devToken = `dev-user-${user.uid}`;
          setAuthToken(devToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${devToken}`;
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
        setSelectedProfile(null);
        setAuthToken(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    setSelectedProfile(null);
    return signOut(auth);
  };

  const devLoginDemo = (email = "demo@netflix.com") => {
    const mockUser = {
      uid: "demo-user-123",
      email: email,
      displayName: email.split('@')[0]
    };
    const mockToken = "dev-user-demo-user-123";
    setAuthToken(mockToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
    setCurrentUser(mockUser);
    setSelectedProfile({ id: '1', name: mockUser.displayName || 'Demo User', avatarUrl: DEFAULT_AVATARS[0] });
    setLoading(false);
  };

  const addProfile = (name, avatarUrl) => {
    const newProf = {
      id: Date.now().toString(),
      name,
      avatarUrl: avatarUrl || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]
    };
    setProfiles(prev => [...prev, newProf]);
  };

  const value = {
    currentUser,
    selectedProfile,
    setSelectedProfile,
    profiles,
    addProfile,
    signup,
    login,
    loginWithGoogle,
    logout,
    devLoginDemo,
    authToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
