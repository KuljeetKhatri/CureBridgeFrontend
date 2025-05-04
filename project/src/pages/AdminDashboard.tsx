import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth";

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8089/getalldoctor");
        const data = await response.json();

        // Transform API data to match frontend format
        const formattedDoctors = data.map((doc: any) => ({
          id: doc.id.toString(),
          name: doc.user.fullName,
          email: doc.user.email,
          role: UserRole.DOCTOR,
          status: doc.status.charAt(0).toUpperCase() + doc.status.slice(1).toLowerCase(), // Capitalize status
        }));

        setUsers(formattedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role.toLowerCase() === filter;
  });

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );
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
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">Welcome, {currentUser?.name || currentUser?.email}</div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-700">Total Doctors</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Doctor Management</h2>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("doctor")}
            className={`px-3 py-1 rounded ${filter === "doctor" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Doctors
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-2 px-4 text-sm text-gray-700">{user.name}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{user.email}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">
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
                  <td className="py-2 px-4 text-sm">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className="text-sm border rounded p-1"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <button className="ml-2 text-blue-600 hover:text-blue-800">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Doctor</button>
      </div> */}
    </div>
  );
};

export default AdminDashboard;
