import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { appointmentService } from "../services/appointmentService";

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

const ScheduleAppointment: React.FC = () => {
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reasonForAppointment, setReasonForAppointment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // const token = currentUser?.token; // Assuming token is in currentUser
        // if (!token) throw new Error("No authentication token found");

        const response = await fetch("http://localhost:8089/api/doctors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.responseCode === "00" && data.data) {
          setDoctors(data.data);
        } else {
          throw new Error(data.responseMessage || "Invalid response format");
        }
      } catch (err: any) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again.");
      }
    };

    fetchDoctors();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
      setError("Please fill in all required fields.");
      return;
    }

    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      setError("Please select a future date and time.");
      return;
    }

    try {
      const newAppointment = await appointmentService.createAppointment({
        doctorId: selectedDoctorId,
        patientId: currentUser?.id || "",
        appointmentDate: appointmentDateTime.toISOString(),
      });
      setSuccess("Appointment scheduled successfully!");
      console.log("Created appointment:", newAppointment);
      // Optionally reset form
      setSelectedDoctorId("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReasonForAppointment("");
    } catch (err) {
      setError("Failed to schedule appointment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Schedule New Appointment</h1>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select a Doctor --</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Appointment</label>
            <textarea
              value={reasonForAppointment}
              onChange={(e) => setReasonForAppointment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the reason for your appointment (optional)"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleAppointment;