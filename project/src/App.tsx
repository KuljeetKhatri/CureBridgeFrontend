// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import { Toaster } from 'react-hot-toast';
// // import { AuthProvider } from './context/AuthContext';
// // import { ProtectedRoute } from './components/ProtectedRoute';
// // import Login from './pages/Login';
// // import Register from './pages/Register';
// // import AdminDashboard from './pages/AdminDashboard';
// // import DoctorDashboard from './pages/DoctorDashboard';
// // import PatientDashboard from './pages/PatientDashboard';
// // import Unauthorized from './pages/Unauthorized';

// // function App() {
// //   return (
// //     <Router>
// //       <AuthProvider>
// //         <div className="min-h-screen bg-gray-50">
// //           <Routes>
// //             <Route path="/login" element={<Login />} />
// //             <Route path="/register" element={<Register />} />
// //             <Route path="/unauthorized" element={<Unauthorized />} />
// //             <Route
// //               path="/admin/*"
// //               element={
// //                 <ProtectedRoute allowedRoles={['ADMIN']}>
// //                   <AdminDashboard />
// //                 </ProtectedRoute>
// //               }
// //             />
// //             <Route
// //               path="/doctor/*"
// //               element={
// //                 <ProtectedRoute allowedRoles={['DOCTOR']}>
// //                   <DoctorDashboard />
// //                 </ProtectedRoute>
// //               }
// //             />
// //             <Route
// //               path="/patient/*"
// //               element={
// //                 <ProtectedRoute allowedRoles={['PATIENT']}>
// //                   <PatientDashboard />
// //                 </ProtectedRoute>
// //               }
// //             />
// //             <Route
// //               path="/"
// //               element={
// //                 <Navigate
// //                   to="/patient"
// //                   replace
// //                 />
// //               }
// //             />
// //           </Routes>
// //           <Toaster position="top-right" />
// //         </div>
// //       </AuthProvider>
// //     </Router>
// //   );
// // }

// // export default App;

// import type React from "react"
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// import { AuthProvider, useAuth } from "./context/AuthContext"
// import { UserRole } from "./types/auth"

// // Pages
// import Login from "./pages/Login"
// import Register from "./pages/Register"
// import Dashboard from "./pages/Dashboard"
// import AdminDashboard from "./pages/AdminDashboard"
// import DoctorDashboard from "./pages/DoctorDashboard"
// import PatientDashboard from "./pages/PatientDashboard"
// import Unauthorized from "./pages/Unauthorized"


// // Components
// import Navbar from "./components/Navbar"
// import ProtectedRoute from "./components/ProtectedRoute"

// // Protected route wrapper with role check
// const RoleProtectedRoute: React.FC<{
//   children: React.ReactNode
//   allowedRoles: UserRole[]
// }> = ({ children, allowedRoles }) => {
//   const { currentUser, loading } = useAuth()

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>
//   }

//   if (!currentUser) {
//     return <Navigate to="/login" />
//   }

//   if (!allowedRoles.includes(currentUser.role)) {
//     return <Navigate to="/unauthorized" />
//   }

//   return <>{children}</>
// }

// const AppRoutes = () => {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <Routes>
//             {/* Public routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />

//             {/* Protected routes */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Admin routes */}
//             <Route
//               path="/admin"
//               element={
//                 <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
//                   <AdminDashboard />
//                 </RoleProtectedRoute>
//               }
//             />

//             {/* Doctor routes */}
//             <Route
//               path="/doctor"
//               element={
//                 <RoleProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
//                   <DoctorDashboard />
//                 </RoleProtectedRoute>
//               }
//             />

//             {/* Patient routes */}
//             <Route
//               path="/patient"
//               element={
//                 <RoleProtectedRoute allowedRoles={[UserRole.PATIENT]}>
//                   <PatientDashboard />
//                 </RoleProtectedRoute>
//               }
//             />

//             {/* Catch all route */}
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   )
// }

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   )
// }

// export default App

import type React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserRole } from "./types/auth";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ManageUsers from "./pages/ManageUsers"; // Add ManageUsers page
import Unauthorized from "./pages/Unauthorized";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Protected route wrapper with role check
const RoleProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <ManageUsers />
                </RoleProtectedRoute>
              }
            />

            {/* Doctor routes */}
            <Route
              path="/doctor"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
                  <DoctorDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
                  <div>Doctor Patients Page</div>
                </RoleProtectedRoute>
              }
            />

            {/* Patient routes */}
            <Route
              path="/patient"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                  <PatientDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <RoleProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                  <div>Patient Appointments Page</div>
                </RoleProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;