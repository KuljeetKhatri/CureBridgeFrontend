"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
// import VideoCall from "../components/VideoCall"


// Mock data for doctor dashboard
const mockAppointments = [
  {
    id: "1",
    patientName: "Jane Smith",
    date: "2023-05-15",
    time: "09:00 AM",
    status: "Scheduled",
    reason: "Annual checkup",
  },
  {
    id: "2",
    patientName: "Alice Brown",
    date: "2023-05-15",
    time: "10:30 AM",
    status: "Completed",
    reason: "Flu symptoms",
  },
  {
    id: "3",
    patientName: "Charlie Wilson",
    date: "2023-05-16",
    time: "02:00 PM",
    status: "Cancelled",
    reason: "Headache",
  },
  {
    id: "4",
    patientName: "David Miller",
    date: "2023-05-17",
    time: "11:15 AM",
    status: "Scheduled",
    reason: "Follow-up",
  },
  {
    id: "5",
    patientName: "Eva Garcia",
    date: "2023-05-18",
    time: "03:45 PM",
    status: "Scheduled",
    reason: "Blood test",
  },
]

const mockPatients = [
  { id: "1", name: "Jane Smith", age: 35, lastVisit: "2023-04-10", condition: "Hypertension" },
  { id: "2", name: "Alice Brown", age: 28, lastVisit: "2023-05-15", condition: "Influenza" },
  { id: "3", name: "Charlie Wilson", age: 42, lastVisit: "2023-03-22", condition: "Migraine" },
  { id: "4", name: "David Miller", age: 50, lastVisit: "2023-05-01", condition: "Diabetes" },
  { id: "5", name: "Eva Garcia", age: 31, lastVisit: "2023-04-28", condition: "Anemia" },
]

const DoctorDashboard: React.FC = () => {
  const { currentUser } = useAuth()
  const [appointments, setAppointments] = useState(mockAppointments)
  const [patients, setPatients] = useState(mockPatients)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("appointments")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAppointmentStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
      ),
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <div className="text-sm text-gray-600">Welcome, Dr. {currentUser?.name || currentUser?.email}</div>
      </div>
      {/* <div>
      <h1>Doctor-Patient Chat</h1>
      <VideoCall userType="doctor" />
      </div> */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-700">Today's Appointments</h3>
            <p className="text-3xl font-bold">{appointments.filter((a) => a.date === "2023-05-15").length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-700">Total Patients</h3>
            <p className="text-3xl font-bold">{patients.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-purple-700">Completed Today</h3>
            <p className="text-3xl font-bold">
              {appointments.filter((a) => a.date === "2023-05-15" && a.status === "Completed").length}
            </p>
          </div>
        </div>
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
            <button
              onClick={() => setActiveTab("patients")}
              className={`ml-8 py-2 px-4 text-sm font-medium ${
                activeTab === "patients"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Patients
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
                        <button className="ml-2 text-blue-600 hover:text-blue-800">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">My Patients</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Age</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Last Visit</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Condition</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-t">
                      <td className="py-2 px-4 text-sm text-gray-700">{patient.name}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{patient.age}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{patient.lastVisit}</td>
                      <td className="py-2 px-4 text-sm text-gray-700">{patient.condition}</td>
                      <td className="py-2 px-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">View Records</button>
                        <button className="text-blue-600 hover:text-blue-800">Schedule</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {activeTab === "appointments" ? "Add New Appointment" : "Add New Patient"}
        </button>
      </div>
    </div>
  )
}

export default DoctorDashboard

