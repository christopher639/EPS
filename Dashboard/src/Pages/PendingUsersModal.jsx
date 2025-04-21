import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingUsersModal = ({ isOpen, onClose }) => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://eps-dashboard.onrender.com/api/users/admin/pending-users")
        .then((res) => {
          setPendingUsers(res.data.filter((user) => user.status === "pending"));
        })
        .catch((error) => {
          toast.error("Failed to fetch pending users.");
          console.error("Error fetching pending users:", error);
        });
    }
  }, [isOpen]);

  const handleApprove = async (userId) => {
    try {
      await axios.put(
        `https://eps-dashboard.onrender.com/api/users/admin/approve/${userId}`,
        { status: "approved" }
      );
      toast.success("User approved successfully!");
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to approve user.");
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.put(
        `https://eps-dashboard.onrender.com/api/users/admin/approve/${userId}`,
        { status: "rejected" }
      );
      toast.success("User rejected successfully!");
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to reject user.");
      console.error("Error rejecting user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="w-full h-full bg-white overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pending Users</h2>
          <button
            onClick={onClose}
            className="text-white bg-gray-700 px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-600">No pending users</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
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
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default PendingUsersModal;
