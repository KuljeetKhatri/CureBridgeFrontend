// import React from 'react';
// import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { MessageSquare, Phone, Users, Activity, LogOut } from 'lucide-react';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navigation */}
//       <nav className="bg-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <Activity className="h-8 w-8 text-indigo-600" />
//                 <span className="ml-2 text-xl font-bold text-gray-900">Medical Platform</span>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
//               <button
//                 onClick={handleLogout}
//                 className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Messages Card */}
//             <Link
//               to="/dashboard/messages"
//               className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="flex items-center">
//                   <MessageSquare className="h-8 w-8 text-indigo-600" />
//                   <div className="ml-4">
//                     <h3 className="text-lg font-medium text-gray-900">Messages</h3>
//                     <p className="text-sm text-gray-500">Communicate with doctors/patients</p>
//                   </div>
//                 </div>
//               </div>
//             </Link>

//             {/* Voice Calls Card */}
//             <Link
//               to="/dashboard/calls"
//               className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="px-4 py-5 sm:p-6">
//                 <div className="flex items-center">
//                   <Phone className="h-8 w-8 text-indigo-600" />
//                   <div className="ml-4">
//                     <h3 className="text-lg font-medium text-gray-900">Voice Calls</h3>
//                     <p className="text-sm text-gray-500">Start or join voice consultations</p>
//                   </div>
//                 </div>
//               </div>
//             </Link>

//             {/* Users Management Card (Admin Only) */}
//             {user?.role === 'ADMIN' && (
//               <Link
//                 to="/dashboard/users"
//                 className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
//               >
//                 <div className="px-4 py-5 sm:p-6">
//                   <div className="flex items-center">
//                     <Users className="h-8 w-8 text-indigo-600" />
//                     <div className="ml-4">
//                       <h3 className="text-lg font-medium text-gray-900">Users</h3>
//                       <p className="text-sm text-gray-500">Manage doctors and patients</p>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             )}
//           </div>

//           {/* Nested Routes Content */}
//           <div className="mt-6">
//             <Routes>
//               <Route path="messages" element={<div>Messages Component (To be implemented)</div>} />
//               <Route path="calls" element={<div>Calls Component (To be implemented)</div>} />
//               <Route path="users" element={<div>Users Management (To be implemented)</div>} />
//               <Route index element={<div>Select a feature from above to get started</div>} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { UserRole } from "../types/auth"

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    // Redirect to role-specific dashboard if user is logged in
    if (currentUser) {
      switch (currentUser.role) {
        case UserRole.ADMIN:
          navigate("/admin")
          break
        case UserRole.DOCTOR:
          navigate("/doctor")
          break
        case UserRole.PATIENT:
          navigate("/patient")
          break
        default:
          break
      }
    }
  }, [currentUser, navigate])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Healthcare Portal</h1>

        {!currentUser ? (
          <div className="space-y-4">
            <p className="text-gray-600">Please log in to access your personalized dashboard.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Register
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">You are logged in as {currentUser.name || currentUser.email}.</p>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

