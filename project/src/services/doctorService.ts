// import { User } from "../interface/User";

// export const doctorService = {
//   fetchUsers: async (): Promise<User[]> => {
//     try {
//       const response = await fetch("http://localhost:8089/getallusers");
//       if (!response.ok) {
//         throw new Error("Failed to fetch users");
//       }
//       const data = await response.json();

//       // Validate response
//       if (data.responseCode !== "00" || !data.data?.users) {
//         throw new Error(data.responseMessage || "Invalid response format");
//       }

//       // Transform API data to match frontend User interface
//       const formattedUsers: User[] = data.data.users.map((user: any) => ({
//         id: user.id.toString(),
//         name: user.fullName,
//         email: user.email,
//         role: user.role,
//         status: "Active", // Default status since it's not provided
//       }));

//       return formattedUsers;
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw error;
//     }
//   },
// };

import { User } from "../interface/User";

export const doctorService = {
  fetchUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch("http://localhost:8089/api/getallusers");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();

      if (data.responseCode !== "00" || !data.data?.users) {
        throw new Error(data.responseMessage || "Invalid response format");
      }

      const formattedUsers: User[] = data.data.users.map((user: any) => ({
        id: user.id.toString(),
        name: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status, // Default status since it's not provided in user response
      }));

      return formattedUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  fetchActiveUsersByRole: async (role: string): Promise<User[]> => {
    try {
      const response = await fetch(`http://localhost:8089/api/getactiveusers?role=${role}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch active ${role}s`);
      }
      const data = await response.json();

      if (data.responseCode !== "00" || !data.data?.users) {
        throw new Error(data.responseMessage || "Invalid response format");
      }

      const formattedUsers: User[] = data.data.users.map((user: any) => ({
        id: user.id.toString(),
        name: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status || "Active",
      }));

      return formattedUsers;
    } catch (error) {
      console.error(`Error fetching active ${role}s:`, error);
      throw error;
    }
  },

  fetchPendingDoctors: async (): Promise<any[]> => {
    try {
      const response = await fetch("http://localhost:8089/api/getpendingdoctors");
      if (!response.ok) {
        throw new Error("Failed to fetch pending doctors");
      }
      const data = await response.json();

      if (data.responseCode !== "00" || !data.data?.doctors) {
        throw new Error(data.responseMessage || "Invalid response format");
      }

      const formattedDoctors = data.data.doctors.map((doctor: any) => ({
        id: doctor.id.toString(),
        name: doctor.user.fullName,
        email: doctor.user.email,
        specialization: doctor.specialization,
        status: doctor.status,
      }));

      return formattedDoctors;
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
      throw error;
    }
  },

  updateDoctorStatus: async (doctorId: string, action: "approve" | "reject", adminId: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8089/api/updatedoctorstatus/${doctorId}?adminId=${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} doctor`);
      }

      const data = await response.json();
      if (data.responseCode !== "00") {
        throw new Error(data.responseMessage || "Failed to update doctor status");
      }
    } catch (error) {
      console.error(`Error ${action}ing doctor:`, error);
      throw error;
    }
  },

  updateStatus: async (userId: string, newStatus: string): Promise<void> => {
    await fetch(`http://localhost:8089/api/updatestatus/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }
  
};