import React, { createContext, useEffect, useState, useContext } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import app from '../firebase/firebase.config';

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  // Create user with email & password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update user profile
  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // Google Sign In
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      setUser(loggedUser);
      setLoading(false);

      if (loggedUser) {
        fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email: loggedUser.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            localStorage.setItem('token', data.token);
            setToken(data.token);
          });
      } else {
        localStorage.removeItem('token');
        setToken('');
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    token,
    createUser,
    updateUserProfile,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

// Custom hook
export const useAuth = () => useContext(AuthContext);
