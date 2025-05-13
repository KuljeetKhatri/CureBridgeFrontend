// import type React from "react";
// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// // Mock data
// const mockAppointments = [
//   {
//     id: "1",
//     patientName: "Jane Smith",
//     date: "2023-05-15",
//     time: "09:00 AM",
//     status: "Scheduled",
//     reason: "Annual checkup",
//   },
//   // ... (other mock appointments)
// ];

// // ... (mockPatients data as in your original code)

// const DoctorDashboard: React.FC = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState(mockAppointments);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("appointments");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleAppointmentStatusChange = (appointmentId: string, newStatus: string) => {
//     setAppointments(
//       appointments.map((appointment) =>
//         appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
//       )
//     );
//   };

//   const handleCall = (appointmentId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
//     console.log("Call button clicked, event:", event); // Debug: Check if the event is firing
//     event.preventDefault(); // Prevent default behavior
//     event.stopPropagation(); // Prevent event bubbling
//     const url = `/video-call?appointmentId=${appointmentId}&userType=doctor`;
//     console.log("Navigating to:", url); // Debug: Confirm the URL
//     try {
//       navigate(url); // Attempt navigation
//       console.log("Navigation successful, current URL:", window.location.href); // Debug: Check post-navigation URL
//     } catch (error) {
//       console.error("Navigation failed:", error); // Debug: Catch navigation errors
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
//         <div className="text-sm text-gray-600">Welcome, Dr. {currentUser?.fullName || currentUser?.email}</div>
//       </div>

//       {/* ... (other JSX like the grid for stats) ... */}

//       <div className="mb-4">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex">
//             <button
//               onClick={() => setActiveTab("appointments")}
//               className={`py-2 px-4 text-sm font-medium ${
//                 activeTab === "appointments"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Appointments
//             </button>
//             {/* ... (other tabs) ... */}
//           </nav>
//         </div>

//         {activeTab === "appointments" && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Appointments</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Patient</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Time</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Reason</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appointment) => (
//                     <tr key={appointment.id} className="border-t">
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.patientName}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.date}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.time}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.reason}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             appointment.status === "Scheduled"
//                               ? "bg-blue-100 text-blue-800"
//                               : appointment.status === "Completed"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {appointment.status}
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 text-sm">
//                         <select
//                           value={appointment.status}
//                           onChange={(e) => handleAppointmentStatusChange(appointment.id, e.target.value)}
//                           className="text-sm border rounded p-1"
//                         >
//                           <option value="Scheduled">Scheduled</option>
//                           <option value="Completed">Completed</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                         <button className="ml-2 text-blue-600 hover:text-blue-800">View</button>
//                         {appointment.status === "Scheduled" && (
//                           <button
//                             type="button"
//                             onClick={handleCall(appointment.id)}
//                             className="ml-2 text-green-600 hover:text-green-800"
//                           >
//                             Call
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//         {/* ... (other tabs) ... */}
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../services/appointmentService"; // Import the service

const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      if (currentUser?.id) {
        setIsLoading(true);
        try {
          const doctorAppointments = await appointmentService.fetchAppointmentsByDoctorId(currentUser.id);
          setAppointments(doctorAppointments);
        } catch (error) {
          console.error("Failed to fetch doctor appointments:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDoctorAppointments();
  }, [currentUser?.id]);

  const handleAppointmentStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      )
    );
  };

  const handleCall = (appointmentId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Call button clicked, event:", event);
    event.preventDefault();
    event.stopPropagation();
    localStorage.setItem("appointmentId", appointmentId);
    localStorage.setItem("userType", "doctor");
    console.log("id ", appointmentId);

    const url = `/video-call?appointmentId=${appointmentId}&userType=doctor`;
    console.log("Navigating to:", url);
    try {
      navigate(url);
      console.log("Navigation successful, current URL:", window.location.href);
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <div className="text-sm text-gray-600">Welcome, Dr. {currentUser?.fullName || currentUser?.email}</div>
      </div>

      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === "appointments"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Appointments
            </button>
          </nav>
        </div>

        {activeTab === "appointments" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Appointments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Patient</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Reason</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-t">
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.patientName}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.date}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.time}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.reason}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === "Scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : appointment.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        <select
                          value={appointment.status}
                          onChange={(e) => handleAppointmentStatusChange(appointment.id, e.target.value)}
                          className="text-sm border rounded p-1"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        
                        {appointment.status === "SCHEDULED" && (
                          <button
                            type="button"
                            onClick={handleCall(appointment.id)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            Call
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;