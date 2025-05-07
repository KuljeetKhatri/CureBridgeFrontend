import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doctorService } from "../services/doctorService";

const ManageUsers: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [allUsers, pending] = await Promise.all([
          doctorService.fetchUsers(),
          doctorService.fetchPendingDoctors(),
        ]);
        setUsers(allUsers);
        setPendingDoctors(pending);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "doctor") return user.role.toLowerCase() === "doctor";
    if (filter === "patient") return user.role.toLowerCase() === "patient";
    return true;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );
  };

  const handleDoctorApproval = async (doctorId: string, action: "approve" | "reject") => {
    try {
    //   const adminId = currentUser?.id;
    const adminId = currentUser?.id;
      if (!adminId) throw new Error("Admin ID not found");
      await doctorService.updateDoctorStatus(doctorId, action, adminId);
      setPendingDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorId));
      const updatedUsers = await doctorService.fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error(`Error ${action}ing doctor:`, error);
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        </div>

        {pendingDoctors.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pending Doctor Requests</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Specialization</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{doctor.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doctor.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doctor.specialization}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDoctorApproval(doctor.id, "approve")}
                          className="text-green-600 hover:text-green-800 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDoctorApproval(doctor.id, "reject")}
                          className="text-red-600 hover:text-red-800"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Management</h2>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => { setFilter("all"); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
            >
              All
            </button>
            <button
              onClick={() => { setFilter("doctor"); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg ${filter === "doctor" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
            >
              Doctors
            </button>
            <button
              onClick={() => { setFilter("patient"); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg ${filter === "patient" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
            >
              Patients
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "Inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className="text-sm border rounded p-1 mr-2"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-700 hover:text-white transition`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;