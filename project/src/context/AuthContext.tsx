// "use client"

// import type React from "react";
// import { createContext, useContext, useState, useEffect } from "react";
// import { UserRole } from "../types/auth";

// interface User {
//   id: string;
//   email: string;
//   fullName?: string;
//   role: UserRole;
// }

// interface AuthContextType {
//   currentUser: User | null;
//   login: (email: string, password: string) => Promise<User>;
//   register: (email: string, password: string, fullName: string, role: UserRole, specialization?: string, licenseNumber?: string, experienceYears?: string, contactNumber?: string, clinicAddress?: string, degreePdfPath?: string, specializationList?: string) => Promise<User>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   error: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<User> => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("http://localhost:8089/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (data.responseCode !== "00") {
//         throw new Error(data.responseMessage || "Login failed");
//       }

//       const user = data.data;
//       setCurrentUser(user);
//       localStorage.setItem("currentUser", JSON.stringify(user));
//       return user;
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "An unknown error occurred");
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (email: string, password: string, fullName: string, role: UserRole, specialization?: string, licenseNumber?: string, experienceYears?: string, contactNumber?: string, clinicAddress?: string, degreePdfPath?: string, specializationList?: string): Promise<User> => {
//     setLoading(true);
//     setError(null);

//     try {
//       const payload: any = { email, password, fullName, role };
//       if (role === UserRole.DOCTOR) {
//         payload.specialization = specialization;
//         payload.licenseNumber = licenseNumber;
//         payload.experienceYears = experienceYears;
//         payload.contactNumber = contactNumber;
//         payload.clinicAddress = clinicAddress;
//         payload.degreePdfPath = degreePdfPath;
//         payload.specializationList = specializationList;
//       }

//       const response = await fetch("http://localhost:8089/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (data.responseCode !== "00") {
//         throw new Error(data.responseMessage || "Registration failed");
//       }

//       const user = data.data;
//       setCurrentUser(user);
//       localStorage.setItem("currentUser", JSON.stringify(user));
//       return user;
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "An unknown error occurred");
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async (): Promise<void> => {
//     setCurrentUser(null);
//     localStorage.removeItem("currentUser");
//   };

//   const value = {
//     currentUser,
//     login,
//     register,
//     logout,
//     loading,
//     error,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

"use client"

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "../types/auth";

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  token?: string; // Keep token for future use
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, fullName: string, role: UserRole, specialization?: string, licenseNumber?: string, experienceYears?: string, contactNumber?: string, clinicAddress?: string, degreePdfPath?: string, specializationList?: string, age?: string, gender?: string, medicalHistory?: string) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8089/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.responseCode !== "00") {
        throw new Error(data.responseMessage || "Login failed");
      }

      const user = data.data;
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, role: UserRole, specialization?: string, licenseNumber?: string, experienceYears?: string, contactNumber?: string, clinicAddress?: string, degreePdfPath?: string, specializationList?: string, age?: string, gender?: string, medicalHistory?: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const payload: any = { email, password, fullName, role };
      if (role === UserRole.DOCTOR) {
        if (!specialization || !licenseNumber || !experienceYears || !contactNumber || !clinicAddress || !degreePdfPath || !specializationList) {
          throw new Error("All doctor fields are required");
        }
        payload.specialization = specialization;
        payload.licenseNumber = licenseNumber;
        payload.experienceYears = experienceYears;
        payload.contactNumber = contactNumber;
        payload.clinicAddress = clinicAddress;
        payload.degreePdfPath = degreePdfPath;
        payload.specializationList = specializationList;
      } else if (role === UserRole.PATIENT) {
        if (!age || !gender || !contactNumber) {
          throw new Error("Age, gender, and contactNumber are required for patients");
        }
        payload.age = age;
        payload.gender = gender;
        payload.contactNumber = contactNumber;
        payload.medicalHistory = medicalHistory;
      }

      const response = await fetch("http://localhost:8089/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.responseCode !== "00") {
        throw new Error(data.responseMessage || "Registration failed");
      }

      const user = data.data;
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};