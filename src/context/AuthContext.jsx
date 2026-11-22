import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      let role = "user";
      try {
        const userSnapshot = await getDoc(doc(db, "usuarios", currentUser.uid));
        if (userSnapshot.exists() && userSnapshot.data().rol === "admin") {
          role = "admin";
        }
      } catch (error) {
        console.error("No se pudo consultar el rol del usuario:", error);
      }

      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        rol: role,
      });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "usuarios", credential.user.uid), {
      email: credential.user.email,
      rol: "user",
    });
    return credential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}
