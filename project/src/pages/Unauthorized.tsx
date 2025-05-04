// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShieldAlert } from 'lucide-react';

// const Unauthorized = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full text-center">
//         <div className="flex justify-center">
//           <ShieldAlert className="h-16 w-16 text-red-600" />
//         </div>
//         <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//           Access Denied
//         </h2>
//         <p className="mt-2 text-sm text-gray-600">
//           You don't have permission to access this page.
//         </p>
//         <div className="mt-6">
//           <Link
//             to="/dashboard"
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Return to Dashboard
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Unauthorized;

import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Unauthorized: React.FC = () => {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-700 mb-6">You don't have permission to access this page.</p>

        {currentUser ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              You are logged in as <span className="font-semibold">{currentUser.email}</span> with role{" "}
              <span className="font-semibold">{currentUser.role}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Home
              </Link>
              <Link
                to={`/${currentUser.role.toLowerCase()}`}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Unauthorized

