import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewPrescriptionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = new URLSearchParams(location.search).get("appointmentId");
  const [prescription, setPrescription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!appointmentId) {
        setError("No appointment ID provided.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8089/api/prescription/${appointmentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch prescription.");
        }
        const data = await response.json();
        setPrescription(data);
      } catch (err) {
        console.error("Error fetching prescription:", err);
        setError("Unable to load prescription. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescription();
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg transition-all duration-300">
        {/* Back Button */}
        <button
          onClick={() => navigate("/patient/dashboard")}
          className="group flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-4 py-2 rounded-full transition duration-200 ease-in-out mb-6"
        >
          <svg
            className="w-4 h-4 group-hover:stroke-white stroke-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Prescription Details</h2>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Prescription Content */}
        {!isLoading && !error && prescription && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-700">Diagnosis</h3>
              <p className="text-gray-600 mt-1">
                {prescription.diagnosis || "No diagnosis provided."}
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-700">Medicines</h3>
              <p className="text-gray-600 mt-1">
                {prescription.medicines || "No medicines prescribed."}
              </p>
            </div>
          </div>
        )}

        {/* No Prescription Found */}
        {!isLoading && !error && !prescription && (
          <div className="text-center text-gray-600 py-10">
            No Prescription Found for this Appointment.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPrescriptionPage;