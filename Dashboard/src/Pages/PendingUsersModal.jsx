import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import BASE_URL from "../config";

// // Set Axios Base URL globally
// axios.defaults.baseURL = BASE_URL;

const PendingUsersModal = ({ isOpen, onClose }) => {
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch pending users when the modal opens
  useEffect(() => {
    if (isOpen) {
      axios.get("https://eps-dashboard.onrender.com/api/users/admin/pending-users")
        .then((res) => {
          setPendingUsers(res.data.filter((user) => user.status === "pending"));
        })
        .catch((error) => {
          toast.error("Failed to fetch pending users.");
          console.error("Error fetching pending users:", error);
        });
    }
  }, [isOpen]);

  // Handle user approval
  const handleApprove = async (userId) => {
    try {
      await axios.put(`https://eps-dashboard.onrender.com/api/users/admin/approve/${userId}`, { status: "approved" });
      toast.success("User approved successfully!");
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to approve user.");
      console.error("Error approving user:", error);
    }
  };

  // Handle user rejection
  const handleReject = async (userId) => {
    try {
      await axios.put(`https://eps-dashboard.onrender.com/api/users/admin/approve/${userId}`, { status: "rejected" });
      toast.success("User rejected successfully!");
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to reject user.");
      console.error("Error rejecting user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/6">
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Users</h2>
            {pendingUsers.length > 0 && (
              <span className="ml-2 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </div>
          {pendingUsers.length === 0 ? (
            <p className="text-gray-500">No pending users</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id} className="border">
                    <td className="border p-2">{user.fullName}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default PendingUsersModal;
