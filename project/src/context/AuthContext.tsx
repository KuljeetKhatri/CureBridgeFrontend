// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { AuthState, User } from '../types/auth';
// import { createClient } from '@supabase/supabase-js';
// import { jwtDecode } from 'jwt-decode';
// import { toast } from 'react-hot-toast';

// // Check if environment variables are available
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Supabase configuration is missing. Please connect to Supabase using the "Connect to Supabase" button in the top right.');
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// interface AuthContextType extends AuthState {
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   register: (email: string, password: string, name: string, role: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [auth, setAuth] = useState<AuthState>({
//     user: null,
//     token: localStorage.getItem('token'),
//     isAuthenticated: false,
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode<User>(token);
//         setAuth({
//           user: decoded,
//           token,
//           isAuthenticated: true,
//         });
//       } catch (error) {
//         localStorage.removeItem('token');
//       }
//     }

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       if (session) {
//         const user: User = {
//           id: session.user.id,
//           email: session.user.email!,
//           name: session.user.user_metadata.name,
//           role: session.user.user_metadata.role,
//         };
//         setAuth({
//           user,
//           token: session.access_token,
//           isAuthenticated: true,
//         });
//         localStorage.setItem('token', session.access_token);
//       } else {
//         setAuth({ user: null, token: null, isAuthenticated: false });
//         localStorage.removeItem('token');
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       const user: User = {
//         id: data.user!.id,
//         email: data.user!.email!,
//         name: data.user!.user_metadata.name,
//         role: data.user!.user_metadata.role,
//       };

//       setAuth({
//         user,
//         token: data.session!.access_token,
//         isAuthenticated: true,
//       });
//       localStorage.setItem('token', data.session!.access_token);
//     } catch (error: any) {
//       toast.error(error.message || 'Login failed');
//       throw error;
//     }
//   };

//   const register = async (email: string, password: string, name: string, role: string) => {
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             name,
//             role,
//           },
//         },
//       });

//       if (error) throw error;

//       if (data.user) {
//         toast.success('Registration successful! Please login.');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Registration failed');
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await supabase.auth.signOut();
//       setAuth({ user: null, token: null, isAuthenticated: false });
//       localStorage.removeItem('token');
//     } catch (error: any) {
//       toast.error(error.message || 'Logout failed');
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ ...auth, login, logout, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { UserRole } from "../types/auth"

interface User {
  id: string
  email: string
  name?: string
  role: UserRole
}

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<User>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for testing
const MOCK_USERS = [
  { id: "1", email: "admin@example.com", password: "password", name: "Admin User", role: UserRole.ADMIN },
  { id: "2", email: "doctor@example.com", password: "password", name: "Doctor User", role: UserRole.DOCTOR },
  { id: "3", email: "patient@example.com", password: "password", name: "Patient User", role: UserRole.PATIENT },
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user with matching email and password
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (!user) {
        throw new Error("Invalid email or password")
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = user

      // Save user to state and localStorage
      setCurrentUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

      return userWithoutPassword
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      if (MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("User with this email already exists")
      }

      // Create new user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email,
        password,
        name,
        role,
      }

      // Add to mock users (in a real app, this would be an API call)
      MOCK_USERS.push(newUser)

      // Create user object without password
      const { password: _, ...userWithoutPassword } = newUser

      // Save user to state and localStorage
      setCurrentUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

      return userWithoutPassword
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

