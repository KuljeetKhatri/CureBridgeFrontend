export const appointmentService = {
    // Fetch appointments for a specific patient by ID
    fetchAppointmentsByPatientId: async (id: string): Promise<any[]> => {
      try {
        const response = await fetch(`http://localhost:8089/api/getappointment?id=${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
  
        const data = await response.json();
  
        if (data.responseCode !== "00" || !data.data?.appointments || data.data.appointments.length === 0) {
          console.error("No appointments found or invalid response format.");
          return [];
        }
  
        console.log(data);
  
        const formattedAppointments: any[] = data.data.appointments.map((appointment: any) => {
          const dateObj = new Date(appointment.appointmentDate);
          const createdAtObj = new Date(appointment.createdAt);
  
          return {
            id: appointment.id?.toString() || "",
            doctorName: appointment.doctor.user.fullName || "Unknown",
            specialty: appointment.doctor.specialization || "Unknown",
            date: dateObj.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time: createdAtObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            status: appointment.status || "",
          };
        });
  
        return formattedAppointments;
      } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
      }
    },
  
    // Fetch specific appointment details by ID
    fetchAppointmentDetails: async (appointmentId: string): Promise<any> => {
      try {
        const response = await fetch(`http://localhost:8089/api/getappointmentdetails?id=${appointmentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }
  
        const data = await response.json();
  
        if (data.responseCode !== "00" || !data.data?.appointment) {
          throw new Error(data.responseMessage || "Invalid response format");
        }
  
        return data.data.appointment;
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        throw error;
      }
    },
  
  
  
    // Create a new appointment
    createAppointment: async (appointment: {
        doctorId: string;
        patientId: string;
        appointmentDate: string;
      }): Promise<any> => {
        try {
          const response = await fetch(`http://localhost:8089/api/createappointment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doctorId: appointment.doctorId,
              patientId: appointment.patientId,
              appointmentDate: appointment.appointmentDate,
            }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to create appointment, response:", errorData);
            throw new Error("Failed to create appointment");
          }
      
          const data = await response.json();
          console.log("Create appointment response:", data); // Debug log
      
          // Access mapData instead of data
          const responseData = data.mapData;
          if (data.responseCode !== "00" || !responseData?.appointment) {
            throw new Error(data.responseMessage || "Invalid response format");
          }
      
          const createdAppointment = responseData.appointment;
          const dateObj = new Date(createdAppointment.appointmentDate);
          // Handle null createdAt by using current timestamp as a fallback
          const createdAtObj = createdAppointment.createdAt
            ? new Date(createdAppointment.createdAt)
            : new Date();
      
          return {
            id: createdAppointment.id?.toString() || "",
            doctorName: createdAppointment.doctor.user.fullName || "Unknown",
            specialty: createdAppointment.doctor.specialization || "Unknown",
            date: dateObj.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time: createdAtObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            status: createdAppointment.status || "SCHEDULED",
          };
        } catch (error) {
          console.error("Error creating appointment:", error);
          throw error;
        }
      },
      fetchAppointmentsByDoctorId: async (id: string): Promise<any[]> => {
        try {
          const response = await fetch(`http://localhost:8089/api/getappointment?id=${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch doctor appointments");
          }
    
          const data = await response.json();
    
          if (data.responseCode !== "00" || !data.data?.appointments || data.data.appointments.length === 0) {
            console.error("No appointments found or invalid response format.");
            return [];
          }
    
          console.log(data);
    
          const formattedAppointments: any[] = data.data.appointments.map((appointment: any) => {
            const dateObj = new Date(appointment.appointmentDate);
            const createdAtObj = new Date(appointment.createdAt || new Date()); // Fallback if createdAt is null
    
            return {
              id: appointment.id?.toString() || "",
              doctorId: appointment.doctor.id,
              patientId:appointment.patient.id,
              patientName: appointment.patient?.user?.fullName || "Unknown",
              date: dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              time: createdAtObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }),
              reason: "Not specified", // Add a placeholder; update if backend provides reason
              status: appointment.status || "SCHEDULED",
            };
          });
    
          return formattedAppointments;
        } catch (error) {
          console.error("Error fetching doctor appointments:", error);
          return [];
        }
      },
      updateAppointmentStatus: async (appointmentId: string, newStatus: string) => {
        const response = await fetch(`http://localhost:8089/api/appointment/${appointmentId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update appointment status");
        }
    
        return response.text(); // or response.json() if your backend returns JSON
      },
  };