import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = "http://localhost:3000";

const LearnerDetail = () => {
  const { id } = useParams(); // Get the learner ID from the URL
  const [learner, setLearner] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [updatedLearner, setUpdatedLearner] = useState({}); // State to hold updated learner data
  const [newImage, setNewImage] = useState(null); // State to hold new image file
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearner();
  }, [id]);

  // Fetch learner details
  const fetchLearner = async () => {
    try {
      const response = await axios.get(`/api/learners/${id}`);
      setLearner(response.data);
      setUpdatedLearner(response.data.learner); // Initialize updatedLearner with fetched data
    } catch (error) {
      console.error("Error fetching learner details:", error);
      toast.error("Failed to fetch learner details");
    }
  };

  // Handle input change for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLearner({ ...updatedLearner, [name]: value });
  };

  // Handle file input change for new image
  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Save updated learner information
  const saveChanges = async () => {
    const formData = new FormData();
    Object.keys(updatedLearner).forEach((key) => {
      formData.append(key, updatedLearner[key]);
    });
    if (newImage) {
      formData.append("learnerImage", newImage);
    }

    try {
      await axios.put(`/api/learners/${id}`, formData);
      setIsEditing(false); // Exit edit mode
      fetchLearner(); // Refresh learner data
      toast.success("Learner updated successfully!");
    } catch (error) {
      console.error("Error updating learner:", error);
      toast.error("Failed to update learner");
    }
  };

  if (!learner) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Learner Details</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Image */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={
                newImage
                  ? URL.createObjectURL(newImage)
                  : `http://localhost:3000${learner.learner.learnerImage}`
              }
              alt={learner.learner.name}
              className="w-48 h-48 object-cover rounded-md mb-4"
            />
            {isEditing && (
              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 w-48 mb-4"
              />
            )}
          </div>

          {/* Right Column: Learner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={updatedLearner.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.name}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Nationality</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nationality"
                  value={updatedLearner.nationality || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.nationality}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Guardian Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="guardianName"
                  value={updatedLearner.guardianName || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.guardianName}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Guardian Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  name="guardianPhone"
                  value={updatedLearner.guardianPhone || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.guardianPhone}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Registration Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="regNo"
                  value={updatedLearner.regNo || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.regNo}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Grade</label>
              {isEditing ? (
                <input
                  type="text"
                  name="grade"
                  value={updatedLearner.grade || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.grade}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Stream</label>
              {isEditing ? (
                <input
                  type="text"
                  name="stream"
                  value={updatedLearner.stream || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.stream}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={updatedLearner.gender || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p>{learner.learner.gender}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={updatedLearner.dateOfBirth || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{new Date(learner.learner.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>

            <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={updatedLearner.address || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={saveChanges}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnerDetail;