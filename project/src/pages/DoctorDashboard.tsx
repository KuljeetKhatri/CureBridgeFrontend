
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
          console.log(doctorAppointments);
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

  const handleAppointmentStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
        )
      );
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      alert("Failed to update status.");
    }
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
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        
                        {appointment.status === "SCHEDULED" && (
                          <button
                            type="button"
                            onClick={handleCall(appointment.id)}
                            className="inline-flex items-center gap-3 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-5 py-2.5 rounded-full transition duration-200 ease-in-out mx-2 my-1"
                            >
                            Call
                          </button>
                        )}
                        {appointment.status === "COMPLETED" && (
                          <button
                            onClick={() => navigate(`/prescription/add?appointmentId=${appointment.id}&doctorId=${appointment.doctorId}&patientId=${appointment.patientId}`)}
                            className="inline-flex items-center gap-3 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-5 py-2.5 rounded-full transition duration-200 ease-in-out mx-2 my-1"
                          >
                            Prescription
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