// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ViewUserPage = () => {
//   const { userId } = useParams();
//   const [user, setUser] = useState<any>(null);
//   const [appointments, setAppointments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [slideIndex, setSlideIndex] = useState(0);
//   const [transcript, setTranscript] = useState<string | null>(null);
//   const [sentiment, setSentiment] = useState<string | null>(null);
//   const [sentimentLoading, setSentimentLoading] = useState(false);


//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:8089/api/user/${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch user details");
//         const data = await response.json();
//         setUser(data.data);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchDoctorAppointments = async () => {
//       try {
//         const response = await fetch(`http://localhost:8089/api/doctor/${userId}/appointments`);
//         if (!response.ok) throw new Error("Failed to fetch appointments");
//         const data = await response.json();
//         setAppointments(data.data || []);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     if (userId) {
//       fetchUserDetails();
//       fetchDoctorAppointments();
//     }
//   }, [userId]);
  

//   const handleSlide = (direction: "left" | "right") => {
//     setTranscript(null); // clear old transcript on slide
//     setSentiment(null);
//     if (direction === "left") {
//       setSlideIndex((prev) => (prev === 0 ? appointments.length - 1 : prev - 1));
//     } else {
//       setSlideIndex((prev) => (prev === appointments.length - 1 ? 0 : prev + 1));
//     }
//   };

//   const handleSentimentAnalysis = async () => {
//     const currentAppointment = appointments[slideIndex];
//     setSentiment(null);            // Reset old result
//     setSentimentLoading(true);     // Start loading
  
//     try {
//       // Step 1: Get transcript
//       const transcriptResponse = await fetch(`http://localhost:8089/api/transcript/${currentAppointment.id}`);
//       if (!transcriptResponse.ok) throw new Error("Failed to fetch transcript");
//       const transcriptData = await transcriptResponse.json();
//       const transcriptText = transcriptData.transcript;
  
//       // Step 2: Send to sentiment API
//       const sentimentResponse = await fetch(`http://localhost:8089/api/sentiment`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: transcriptText }),
//       });
  
//       if (!sentimentResponse.ok) throw new Error("Failed to fetch sentiment");
//       const sentimentData = await sentimentResponse.json();
  
//       // Assuming API response is: { sentiment: "Positive" }
//       setSentiment(sentimentData.prediction || "Not Cyberbullying");
//     } catch (error) {
//       console.error("Error during sentiment analysis:", error);
//       setSentiment("Error");
//     } finally {
//       setSentimentLoading(false);
//     }
//   };
  

//   if (loading) return <div className="p-4 text-center">Loading...</div>;
//   if (!user) return <div className="p-4 text-center text-red-500">User not found</div>;

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded mt-10">
//       <h2 className="text-2xl font-bold mb-4">User Details</h2>
//       <div className="space-y-2 mb-6">
//         <div><strong>Name:</strong> {user.fullName}</div>
//         <div><strong>Email:</strong> {user.email}</div>
//         <div><strong>Role:</strong> {user.role}</div>
//         {user.specialization && (
//           <div><strong>Specialization:</strong> {user.specialization}</div>
//         )}
//         <div><strong>Status:</strong> {user.status}</div>
//       </div>

//       {user.role?.toLowerCase() === "doctor" && appointments.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-xl font-semibold mb-4">Past Appointments</h3>
//           <div className="relative flex items-center justify-center">
//             <button onClick={() => handleSlide("left")} className="absolute left-0 z-10 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
//               <FaChevronLeft />
//             </button>
//             <div className="w-full sm:w-[70%] md:w-[60%] border p-4 rounded shadow bg-gray-50 text-center transition-all duration-300 ease-in-out">
//               <p><strong>Patient:</strong> {appointments[slideIndex].patientName}</p>
//               <p><strong>Message:</strong> {appointments[slideIndex].message}</p>
//               <button 
//                 className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 onClick={handleSentimentAnalysis}
//               >
//                 Sentiment Analysis
//               </button>
//               {sentimentLoading && <p className="mt-2 text-blue-500">Analyzing sentiment...</p>}
//               {sentiment && !sentimentLoading && (
//                  <p className="mt-2 font-semibold text-green-700">Sentiment: {sentiment}</p>
//               )}

//             </div>
//             <button onClick={() => handleSlide("right")} className="absolute right-0 z-10 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
//               <FaChevronRight />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewUserPage;


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { format, parseISO } from "date-fns";

const ViewUserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8089/api/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctorAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:8089/api/doctor/${userId}/appointments`);
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        console.log(data);
        setAppointments(data.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
      fetchDoctorAppointments();
    }
  }, [userId]);

  const handleSlide = (direction: "left" | "right") => {
    setTranscript(null); // Clear old transcript on slide
    setSentiment(null);
    if (direction === "left") {
      setSlideIndex((prev) => (prev === 0 ? appointments.length - 1 : prev - 1));
    } else {
      setSlideIndex((prev) => (prev === appointments.length - 1 ? 0 : prev + 1));
    }
  };

  const handleSentimentAnalysis = async () => {
    const currentAppointment = appointments[slideIndex];
    setSentiment(null); // Reset old result
    setSentimentLoading(true); // Start loading

    try {
      // Step 1: Get transcript
      const transcriptResponse = await fetch(`http://localhost:8089/api/transcript/${currentAppointment.id}`);
      if (!transcriptResponse.ok) throw new Error("Failed to fetch transcript");
      const transcriptData = await transcriptResponse.json();
      const transcriptText = transcriptData.transcript;

      // Step 2: Send to sentiment API
      const sentimentResponse = await fetch(`http://localhost:8089/api/sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcriptText }),
      });

      if (!sentimentResponse.ok) throw new Error("Failed to fetch sentiment");
      const sentimentData = await sentimentResponse.json();

      // Assuming API response is: { sentiment: "Positive" }
      setSentiment(sentimentData.prediction || "Not Cyberbullying");
    } catch (error) {
      console.error("Error during sentiment analysis:", error);
      setSentiment("Error");
    } finally {
      setSentimentLoading(false);
    }
  };
  const formatAppointmentDate = (dateString: string) => {
    try {
      const date = parseISO(dateString); // Parse ISO string (UTC)
      // Format the date to a readable format, including PKT timezone
      return format(date, "EEEE, MMMM d, yyyy, h:mm a 'PKT'", {
        // Manually adjust for PKT (UTC+5)
        // date-fns doesn't handle timezone conversion natively, so we adjust manually
        // Alternatively, you can use date-fns-tz for proper timezone support
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading...</div>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-xl font-semibold text-red-500 bg-white p-4 rounded-lg shadow-lg">User not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
        {/* User Details Section */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">User Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200">
            <span className="text-blue-600 font-semibold">Name:</span>
            <span className="text-gray-800">{user.fullName}</span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200">
            <span className="text-blue-600 font-semibold">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200">
            <span className="text-blue-600 font-semibold">Role:</span>
            <span className="text-gray-800">{user.role}</span>
          </div>
          {user.specialization && (
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200">
              <span className="text-blue-600 font-semibold">Specialization:</span>
              <span className="text-gray-800">{user.specialization}</span>
            </div>
          )}
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200">
            <span className="text-blue-600 font-semibold">Status:</span>
            <span className={`text-gray-800 font-medium ${user.status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}>
              {user.status}
            </span>
          </div>
        </div>

        {/* Past Appointments Section */}
        {user.role?.toLowerCase() === "doctor" && appointments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">Past Appointments</h3>
            <div className="relative flex items-center justify-center">
              {/* Left Arrow */}
              <button
                onClick={() => handleSlide("left")}
                className="absolute left-0 z-10 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Appointment Card */}
              <div className="w-full sm:w-[80%] md:w-[70%] bg-white p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl border border-gray-200">
                <div className="space-y-3">
                  <p className="text-lg">
                    <span className="font-semibold text-blue-600">Patient:</span>{" "}
                    <span className="text-gray-800">{appointments[slideIndex].patientName}</span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-blue-600">Message:</span>{" "}
                    <span className="text-gray-800">{appointments[slideIndex].message}</span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-blue-600">Time:</span>{" "}
                    <span className="text-gray-800">
                      {appointments[slideIndex].appointmentDate
                        ? formatAppointmentDate(appointments[slideIndex].appointmentDate)
                        : "Not Available"}
                    </span>
                  </p>
                </div>

                {/* Sentiment Analysis Button */}
                <button
                  onClick={handleSentimentAnalysis}
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Sentiment Analysis
                </button>

                {/* Sentiment Loading and Result */}
                {sentimentLoading && (
                  <p className="mt-3 text-blue-600 font-medium animate-pulse">Analyzing sentiment...</p>
                )}
                {sentiment && !sentimentLoading && (
                  <p className="mt-3 text-lg font-semibold text-green-700">
                    Sentiment: {sentiment}
                  </p>
                )}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => handleSlide("right")}
                className="absolute right-0 z-10 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUserPage;