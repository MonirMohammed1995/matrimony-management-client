import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [role, setRole] = useState(null); // ✅ role state

  const googleProvider = new GoogleAuthProvider();

  // 🧠 Create user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // 🧠 Login
  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🧠 Google SignIn
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // 🧠 Update user profile
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // 🧠 Logout
  const logout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    return signOut(auth);
  };

  // ✅ Auth state listener and token/role fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedUser) => {
      setUser(loggedUser);
      setLoading(false);

      if (loggedUser?.email) {
        try {
          // 🔐 Get JWT from backend
          const jwtRes = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loggedUser.email }),
          });
          const jwtData = await jwtRes.json();

          if (jwtData?.token) {
            localStorage.setItem("token", jwtData.token);
            setToken(jwtData.token);
          } else {
            localStorage.removeItem("token");
            setToken("");
          }

          // 🔎 Get user role from backend
          const roleRes = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${loggedUser.email}`
          );
          const roleData = await roleRes.json();

          setRole(roleData?.role || null); // e.g., 'admin' or 'user'
        } catch (error) {
          console.error("AuthContext error:", error);
          localStorage.removeItem("token");
          setToken("");
          setRole(null);
        }
      } else {
        localStorage.removeItem("token");
        setToken("");
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Provide everything to context
  const authInfo = {
    user,
    loading,
    token,
    role, // ✅ provided role
    createUser,
    login,
    logout,
    updateUserProfile,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;