import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddPrescriptionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const appointmentId = query.get("appointmentId");
  const doctorId = query.get("doctorId");
  const patientId = query.get("patientId");

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!appointmentId || !doctorId || !patientId) {
      setError("Missing required parameters (appointmentId, doctorId, or patientId).");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8089/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          doctorId,
          patientId,
          diagnosis,
          medicines,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save prescription");
      }

      navigate("/doctor/dashboard");
    } catch (err) {
      console.error("Error submitting prescription:", err);
      setError("Error saving prescription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg transition-all duration-300">
        {/* Back Button */}
        <button
          onClick={() => navigate("/doctor/dashboard")}
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Prescription</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>
            <textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              rows={4}
              required
              placeholder="Enter diagnosis details..."
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="medicines" className="block text-sm font-medium text-gray-700 mb-1">
              Medicines
            </label>
            <textarea
              id="medicines"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              rows={4}
              required
              placeholder="Enter prescribed medicines..."
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Submit Prescription"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescriptionPage;