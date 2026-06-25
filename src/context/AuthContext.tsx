"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail
} from "firebase/auth";

interface AuthUser {
  uid: string;
  email: string;
  role: 'Super Admin' | 'Editor' | 'Viewer';
  displayName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isFallback: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isFallback = !isFirebaseConfigured;

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Auth check from localStorage
      const stored = localStorage.getItem("agency_admin_session");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem("agency_admin_session");
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          role: "Super Admin", // In real apps, role is fetched from Firestore
          displayName: firebaseUser.displayName || "Admin"
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFallback]);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // Mock login credentials check
      if (email === "admin@agency.com" && password === "admin123") {
        const mockUser: AuthUser = {
          uid: "mock-admin-uid",
          email: "admin@agency.com",
          role: "Super Admin",
          displayName: "Demo Admin"
        };
        setUser(mockUser);
        localStorage.setItem("agency_admin_session", JSON.stringify(mockUser));
        return;
      } else {
        throw new Error("Invalid admin credentials. Hint: use admin@agency.com / admin123");
      }
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      localStorage.removeItem("agency_admin_session");
      return;
    }
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseConfigured) {
      alert(`[Fallback Mode] Password reset link simulated for: ${email}`);
      return;
    }
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFallback, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
