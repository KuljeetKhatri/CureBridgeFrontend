
// "use client"
// import type React from "react"
// import { useState, useEffect } from "react"
// import { useAuth } from "../context/AuthContext"
// // import VideoCall from "../components/VideoCall";


// // Mock data for patient dashboard
// const mockAppointments = [
//   {
//     id: "1",
//     doctorName: "Dr. Smith",
//     specialty: "Cardiology",
//     date: "2023-05-20",
//     time: "10:00 AM",
//     status: "Scheduled",
//   },
//   {
//     id: "2",
//     doctorName: "Dr. Johnson",
//     specialty: "Dermatology",
//     date: "2023-06-05",
//     time: "02:30 PM",
//     status: "Scheduled",
//   },
//   {
//     id: "3",
//     doctorName: "Dr. Williams",
//     specialty: "Neurology",
//     date: "2023-04-15",
//     time: "09:15 AM",
//     status: "Completed",
//   },
// ]

// const mockMedications = [
//   {
//     id: "1",
//     name: "Lisinopril",
//     dosage: "10mg",
//     frequency: "Once daily",
//     startDate: "2023-01-10",
//     endDate: "2023-07-10",
//   },
//   {
//     id: "2",
//     name: "Metformin",
//     dosage: "500mg",
//     frequency: "Twice daily",
//     startDate: "2023-02-15",
//     endDate: "2023-08-15",
//   },
//   {
//     id: "3",
//     name: "Atorvastatin",
//     dosage: "20mg",
//     frequency: "Once daily at bedtime",
//     startDate: "2023-03-01",
//     endDate: "2023-09-01",
//   },
// ]

// const mockTestResults = [
//   { id: "1", testName: "Blood Pressure", date: "2023-04-15", result: "120/80 mmHg", status: "Normal" },
//   { id: "2", testName: "Blood Glucose", date: "2023-04-15", result: "95 mg/dL", status: "Normal" },
//   { id: "3", testName: "Cholesterol", date: "2023-03-10", result: "210 mg/dL", status: "Elevated" },
// ]

// const PatientDashboard: React.FC = () => {
//   const { currentUser } = useAuth()
//   const [appointments, setAppointments] = useState(mockAppointments)
//   const [medications, setMedications] = useState(mockMedications)
//   const [testResults, setTestResults] = useState(mockTestResults)
//   const [isLoading, setIsLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState("appointments")

//   useEffect(() => {
//     // Simulate loading data
//     const timer = setTimeout(() => {
//       setIsLoading(false)
//     }, 1000)

//     return () => clearTimeout(timer)
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
//         <div className="text-sm text-gray-600">Welcome, {currentUser?.fullName || currentUser?.email}</div>
//       </div>
//       {/* <div>
//       <h1>Chat with Doctor</h1>
//       <VideoCall userType="patient" />
//     </div> */}

//       <div className="mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-blue-50 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-blue-700">Upcoming Appointments</h3>
//             <p className="text-3xl font-bold">{appointments.filter((a) => a.status === "Scheduled").length}</p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-green-700">Active Medications</h3>
//             <p className="text-3xl font-bold">{medications.length}</p>
//           </div>
//           <div className="bg-purple-50 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-purple-700">Recent Test Results</h3>
//             <p className="text-3xl font-bold">{testResults.length}</p>
//           </div>
//         </div>
//       </div>

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
//             <button
//               onClick={() => setActiveTab("medications")}
//               className={`ml-8 py-2 px-4 text-sm font-medium ${
//                 activeTab === "medications"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Medications
//             </button>
//             <button
//               onClick={() => setActiveTab("testResults")}
//               className={`ml-8 py-2 px-4 text-sm font-medium ${
//                 activeTab === "testResults"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Test Results
//             </button>
//           </nav>
//         </div>

//         {activeTab === "appointments" && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">My Appointments</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Doctor</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Specialty</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Time</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appointment) => (
//                     <tr key={appointment.id} className="border-t">
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.doctorName}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.specialty}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.date}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.time}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             appointment.status === "Scheduled"
//                               ? "bg-blue-100 text-blue-800"
//                               : appointment.status === "Completed"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {appointment.status}
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 text-sm">
//                         {appointment.status === "Scheduled" && (
//                           <>
//                             <button className="text-blue-600 hover:text-blue-800 mr-2">Reschedule</button>
//                             <button className="text-red-600 hover:text-red-800">Cancel</button>
//                           </>
//                         )}
//                         {appointment.status === "Completed" && (
//                           <button className="text-blue-600 hover:text-blue-800">View Summary</button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Schedule New Appointment
//             </button>
//           </div>
//         )}

//         {activeTab === "medications" && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">My Medications</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Medication</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Dosage</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Frequency</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Start Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">End Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {medications.map((medication) => (
//                     <tr key={medication.id} className="border-t">
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.name}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.dosage}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.frequency}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.startDate}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.endDate}</td>
//                       <td className="py-2 px-4 text-sm">
//                         <button className="text-blue-600 hover:text-blue-800">View Details</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Request Refill</button>
//           </div>
//         )}

//         {activeTab === "testResults" && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">My Test Results</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Test</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Result</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {testResults.map((test) => (
//                     <tr key={test.id} className="border-t">
//                       <td className="py-2 px-4 text-sm text-gray-700">{test.testName}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{test.date}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{test.result}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             test.status === "Normal"
//                               ? "bg-green-100 text-green-800"
//                               : test.status === "Elevated"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {test.status}
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 text-sm">
//                         <button className="text-blue-600 hover:text-blue-800">View Details</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default PatientDashboard

// "use client" // Remove this line; it's only needed in Next.js

// import type React from "react";
// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, useSearchParams } from "react-router-dom"; // Use react-router-dom hooks

// // Mock data for patient dashboard
// const mockAppointments = [
//   {
//     id: "1",
//     doctorName: "Dr. Smith",
//     specialty: "Cardiology",
//     date: "2023-05-20",
//     time: "10:00 AM",
//     status: "Scheduled",
//   },
//   {
//     id: "2",
//     doctorName: "Dr. Johnson",
//     specialty: "Dermatology",
//     date: "2023-06-05",
//     time: "02:30 PM",
//     status: "Scheduled",
//   },
//   {
//     id: "3",
//     doctorName: "Dr. Williams",
//     specialty: "Neurology",
//     date: "2023-04-15",
//     time: "09:15 AM",
//     status: "Completed",
//   },
// ];

// const mockMedications = [
//   {
//     id: "1",
//     name: "Lisinopril",
//     dosage: "10mg",
//     frequency: "Once daily",
//     startDate: "2023-01-10",
//     endDate: "2023-07-10",
//   },
//   {
//     id: "2",
//     name: "Metformin",
//     dosage: "500mg",
//     frequency: "Twice daily",
//     startDate: "2023-02-15",
//     endDate: "2023-08-15",
//   },
//   {
//     id: "3",
//     name: "Atorvastatin",
//     dosage: "20mg",
//     frequency: "Once daily at bedtime",
//     startDate: "2023-03-01",
//     endDate: "2023-09-01",
//   },
// ];

// const mockTestResults = [
//   { id: "1", testName: "Blood Pressure", date: "2023-04-15", result: "120/80 mmHg", status: "Normal" },
//   { id: "2", testName: "Blood Glucose", date: "2023-04-15", result: "95 mg/dL", status: "Normal" },
//   { id: "3", testName: "Cholesterol", date: "2023-03-10", result: "210 mg/dL", status: "Elevated" },
// ];

// const PatientDashboard: React.FC = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate(); // Replace useRouter with useNavigate
//   const [searchParams] = useSearchParams(); // Use react-router-dom's useSearchParams
//   const [appointments, setAppointments] = useState(mockAppointments);
//   const [medications, setMedications] = useState(mockMedications);
//   const [testResults, setTestResults] = useState(mockTestResults);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("appointments");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleCall = (appointmentId: string) => {
//     console.log(appointmentId);
//     navigate(`/video-call?appointmentId=${appointmentId}&userType=patient`); // Use navigate instead of router.push
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
//         <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
//         <div className="text-sm text-gray-600">Welcome, {currentUser?.fullName || currentUser?.email}</div>
//       </div>

//       <div className="mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-blue-50 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-blue-700">Upcoming Appointments</h3>
//             <p className="text-3xl font-bold">{appointments.filter((a) => a.status === "Scheduled").length}</p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-green-700">Active Medications</h3>
//             <p className="text-3xl font-bold">{medications.length}</p>
//           </div>
//           <div className="bg-purple-50 p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-purple-700">Recent Test Results</h3>
//             <p className="text-3xl font-bold">{testResults.length}</p>
//           </div>
//         </div>
//       </div>

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
//             <button
//               onClick={() => setActiveTab("medications")}
//               className={`ml-8 py-2 px-4 text-sm font-medium ${
//                 activeTab === "medications"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Medications
//             </button>
//             <button
//               onClick={() => setActiveTab("testResults")}
//               className={`ml-8 py-2 px-4 text-sm font-medium ${
//                 activeTab === "testResults"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Test Results
//             </button>
//           </nav>
//         </div>

//         {activeTab === "appointments" && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">My Appointments</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Doctor</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Specialty</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Time</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appointments.map((appointment) => (
//                     <tr key={appointment.id} className="border-t">
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.doctorName}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.specialty}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.date}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{appointment.time}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             appointment.status === "Scheduled"
//                               ? "bg-blue-100 text-blue-800"
//                               : appointment.status === "Completed"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {appointment.status}
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 text-sm">
//                         {appointment.status === "Scheduled" && (
//                           <>
//                             <button className="text-blue-600 hover:text-blue-800 mr-2">Reschedule</button>
//                             <button className="text-red-600 hover:text-red-800 mr-2">Cancel</button>
//                             <button
//                               onClick={() => handleCall(appointment.id)}
//                               className="text-green-600 hover:text-green-800"
//                             >
//                               Call
//                             </button>
//                           </>
//                         )}
//                         {appointment.status === "Completed" && (
//                           <button className="text-blue-600 hover:text-blue-800">View Summary</button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Schedule New Appointment
//             </button>
//           </div>
//         )}

//         {activeTab === "medications" && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">My Medications</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Medication</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Dosage</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Frequency</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Start Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">End Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {medications.map((medication) => (
//                     <tr key={medication.id} className="border-t">
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.name}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.dosage}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.frequency}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.startDate}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{medication.endDate}</td>
//                       <td className="py-2 px-4 text-sm">
//                         <button className="text-blue-600 hover:text-blue-800">View Details</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Request Refill</button>
//           </div>
//         )}

//         {activeTab === "testResults" && (
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">My Test Results</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Test</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Result</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                     <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {testResults.map((test) => (
//                     <tr key={test.id} className="border-t">
//                       <td className="py-2 px-4 text-sm text-gray-700">{test.testName}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{test.date}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">{test.result}</td>
//                       <td className="py-2 px-4 text-sm text-gray-700">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             test.status === "Normal"
//                               ? "bg-green-100 text-green-800"
//                               : test.status === "Elevated"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {test.status}
//                         </span>
//                       </td>
//                       <td className="py-2 px-4 text-sm">
//                         <button className="text-blue-600 hover:text-blue-800">View Details</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientDashboard;

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../services/appointmentService";

// Define the Appointment interface to type-check the appointment objects
interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
}

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State to store appointments and loading state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  // Fetch appointments when the component mounts or currentUser changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (currentUser?.id) {
          const appointmentsData = await appointmentService.fetchAppointmentsByPatientId(currentUser?.id);
          setAppointments(appointmentsData); // Update the state with fetched appointments
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser?.id]);

  // Handle the video call button click
  const handleCall = (appointmentId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent the default action
    event.stopPropagation(); // Prevent event bubbling
    localStorage.setItem("appointmentId", appointmentId);
    localStorage.setItem("userType", "patient");
    const url = `/video-call?appointmentId=${appointmentId}&userType=patient`;
    navigate(url); // Navigate to the video call page
  };

  // Loading spinner while appointments are being fetched
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
        <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
        <div className="text-sm text-gray-600">Welcome, {currentUser?.fullName || currentUser?.email}</div>
      </div>

      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-2 px-4 text-sm font-medium ${activeTab === "appointments" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Appointments
            </button>
          </nav>
        </div>

        {activeTab === "appointments" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">My Appointments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Doctor</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Specialty</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-t">
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.doctorName}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.specialty}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.date}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{appointment.time}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${appointment.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : appointment.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {appointment.status === "SCHEDULED" && (
                          <button
                            type="button"
                            onClick={handleCall(appointment.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Call
                          </button>
                        )}
                        {appointment.status === "Completed" && (
                          <button className="text-blue-600 hover:text-blue-800">View Summary</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => navigate("/patient/schedule-appointment")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Schedule New Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
