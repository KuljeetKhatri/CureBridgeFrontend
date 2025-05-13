// "use client"

// import type React from "react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { UserRole } from "../types/auth";

// const Register: React.FC = () => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
//   const [specialization, setSpecialization] = useState("");
//   const [licenseNumber, setLicenseNumber] = useState("");
//   const [experienceYears, setExperienceYears] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [clinicAddress, setClinicAddress] = useState("");
//   const [degreePdfPath, setDegreePdfPath] = useState("");
//   const [specializationList, setSpecializationList] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!fullName || !email || !password || !confirmPassword) {
//       setError("Email, password, fullName, and role are required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (role === UserRole.DOCTOR && (!specialization || !licenseNumber || !experienceYears || !contactNumber || !clinicAddress || !degreePdfPath || !specializationList)) {
//       setError("All doctor fields are required");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError("");

//       const user = await register(email, password, fullName, role, specialization, licenseNumber, experienceYears, contactNumber, clinicAddress, degreePdfPath, specializationList);

//       // Redirect based on user role
//       switch (user.role) {
//         case UserRole.ADMIN:
//           navigate("/admin");
//           break;
//         case UserRole.DOCTOR:
//           navigate("/doctor");
//           break;
//         case UserRole.PATIENT:
//           navigate("/patient");
//           break;
//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to register");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{" "}
//             <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               sign in to your existing account
//             </Link>
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="fullName" className="sr-only">
//                 Full Name
//               </label>
//               <input
//                 id="fullName"
//                 name="fullName"
//                 type="text"
//                 autoComplete="name"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Full Name"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="email-address" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="confirm-password" className="sr-only">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirm-password"
//                 name="confirm-password"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="role" className="sr-only">
//                 Role
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value as UserRole)}
//               >
//                 <option value={UserRole.PATIENT}>Patient</option>
//                 <option value={UserRole.DOCTOR}>Doctor</option>
//                 <option value={UserRole.ADMIN}>Admin</option>
//               </select>
//             </div>
//             {role === UserRole.DOCTOR && (
//               <>
//                 <div>
//                   <label htmlFor="specialization" className="sr-only">
//                     Specialization
//                   </label>
//                   <input
//                     id="specialization"
//                     name="specialization"
//                     type="text"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="Specialization (e.g., Cardiology)"
//                     value={specialization}
//                     onChange={(e) => setSpecialization(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="licenseNumber" className="sr-only">
//                     License Number
//                   </label>
//                   <input
//                     id="licenseNumber"
//                     name="licenseNumber"
//                     type="text"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="License Number"
//                     value={licenseNumber}
//                     onChange={(e) => setLicenseNumber(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="experienceYears" className="sr-only">
//                     Experience Years
//                   </label>
//                   <input
//                     id="experienceYears"
//                     name="experienceYears"
//                     type="number"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="Experience Years"
//                     value={experienceYears}
//                     onChange={(e) => setExperienceYears(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="contactNumber" className="sr-only">
//                     Contact Number
//                   </label>
//                   <input
//                     id="contactNumber"
//                     name="contactNumber"
//                     type="text"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="Contact Number"
//                     value={contactNumber}
//                     onChange={(e) => setContactNumber(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="clinicAddress" className="sr-only">
//                     Clinic Address
//                   </label>
//                   <input
//                     id="clinicAddress"
//                     name="clinicAddress"
//                     type="text"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="Clinic Address"
//                     value={clinicAddress}
//                     onChange={(e) => setClinicAddress(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="degreePdfPath" className="sr-only">
//                     Degree PDF Path
//                   </label>
//                   <input
//                     id="degreePdfPath"
//                     name="degreePdfPath"
//                     type="text"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="Degree PDF Path"
//                     value={degreePdfPath}
//                     onChange={(e) => setDegreePdfPath(e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="specializationList" className="sr-only">
//                     Specialization List
//                   </label>
//                   <input
//                     id="specializationList"
//                     name="specializationList"
//                     type="text"
//                     required
//                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                     placeholder="Specialization List"
//                     value={specializationList}
//                     onChange={(e) => setSpecializationList(e.target.value)}
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                 isLoading ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isLoading ? "Creating account..." : "Create account"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth";

const Register: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [degreePdfPath, setDegreePdfPath] = useState("");
  const [specializationList, setSpecializationList] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const user = await register(
        email,
        password,
        fullName,
        role,
        role === UserRole.DOCTOR ? specialization : undefined,
        role === UserRole.DOCTOR ? licenseNumber : undefined,
        role === UserRole.DOCTOR ? experienceYears : undefined,
        contactNumber,
        role === UserRole.DOCTOR ? clinicAddress : undefined,
        role === UserRole.DOCTOR ? degreePdfPath : undefined,
        role === UserRole.DOCTOR ? specializationList : undefined,
        role === UserRole.PATIENT ? age : undefined,
        role === UserRole.PATIENT ? gender : undefined,
        role === UserRole.PATIENT ? medicalHistory : undefined
      );
      setSuccess("Registration successful! Please log in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h1>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value={UserRole.PATIENT}>Patient</option>
              <option value={UserRole.DOCTOR}>Doctor</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>
          {role === UserRole.DOCTOR && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization *</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number *</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience Years *</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Clinic Address *</label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree PDF Path *</label>
                <input
                  type="text"
                  value={degreePdfPath}
                  onChange={(e) => setDegreePdfPath(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization List *</label>
                <input
                  type="text"
                  value={specializationList}
                  onChange={(e) => setSpecializationList(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </>
          )}
          {role === UserRole.PATIENT && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;