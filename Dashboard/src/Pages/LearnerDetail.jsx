import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../components/SideBar";

axios.defaults.baseURL = "https://eps-dashboard.onrender.com";

const LearnerDetail = () => {
  const { id } = useParams(); // Get the learner ID from the URL
    const [academicData, setAcademicData] = useState(null);
    const [sideBar, setSideBar] = useState(true);
    const [feesPayments, setFeesPayments] = useState([]); // Store payment records
    const [year, setYear] = useState("2024-2025");
    const [term, setTerm] = useState("Term-1");
    const [category, setCategory] = useState("Opener");
    const [regno, setRegno] = useState(""); // Student regno
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
      const response = await axios.get(`https://eps-dashboard.onrender.com/api/learners/${id}`);
      setLearner(response.data);
      setRegno(response.data.regno); // Set the regno
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
      await axios.put(`https://eps-dashboard.onrender.com/api/learners/${id}`, formData);
      setIsEditing(false); // Exit edit mode
      fetchLearner(); // Refresh learner data
      toast.success("Learner updated successfully!");
    } catch (error) {
      console.error("Error updating learner:", error);
      toast.error("Failed to update learner");
    }
  };


  // Fetch academic data
  useEffect(() => {
    if (regno) {
      const fetchAcademicData = async () => {
        try {
          const response = await axios.get(`https://eps-dashboard.onrender.com/api/marks/marks/${year}/${term}/${category}/${regno}`);
          setAcademicData(response.data);
        } catch (error) {
          console.error("Error fetching academic data:", error);
        }
      };
      fetchAcademicData();
    }
  }, [year, term, category, regno]);

  // Fetch fees payment records
  useEffect(() => {
    if (regno) {
      const fetchFeesPayments = async () => {
        try {
          const response = await axios.get(`https://eps-dashboard.onrender.com/api/fees-payments/regno/${regno}`);
          setFeesPayments(response.data);
          
        } catch (error) {
          console.error("Error fetching fees payments:", error);
        }
      };
      fetchFeesPayments();
    }
  }, [regno]);

 

  const getRemark = (score) => {
    if (score >= 75) return "E.E"; // Exceeding Expectation
    if (score >= 50) return "M.E"; // Meeting Expectation
    if (score >= 0) return "B.E";  // Below Expectation
    return "F"; // Failed
  };

  //remove this part and do not replace it with anything
  if (!learner) {
    return <div>Loading...</div>;
  }
  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className="flex">
        <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>
      <div className="p-6 w-full bg-gray-100 max-h-[100vh] overflow-y-auto min-h-screen">
      <ToastContainer />

      <div className="bg-white  rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Learner Details</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Image */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={
                newImage
                  ? URL.createObjectURL(newImage)
                  : `https://eps-dashboard.onrender.com${learner.learner.learnerImage}`
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
                  name="regno"
                  value={updatedLearner.regno || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.regno}</p>
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
        <div>
        <div className="flex gap-2">
              <label className="block text-gray-700 font-medium">Birth Certificate NO</label>
              {isEditing ? (
                <input
                  type="text"
                  name="birthCertificateNo"
                  value={updatedLearner.birthCertificateNo || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p>{learner.learner.birthCertificateNo}</p>
              )}
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

      <div className="py-6 px-2 mt-10 flex flex-col gap-5 bg-white rounded-lg ">
            <h2 className="text-xl font-semibold mb-4">Fees Payment Statement</h2>
            {feesPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left border">Payment ID</th>
                      <th className="px-4 py-2 text-left border">Amount Paid</th>
                      <th className="px-4 py-2 text-left border">Payment Method</th>
                      <th className="px-4 py-2 text-left border">Date Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-100 transition-colors">
                        <td className="px-4 py-2 border">{payment._id}</td>
                        <td className="px-4 py-2 border">Ksh {payment.amountPaid.toLocaleString()}</td>
                        <td className="px-4 py-2 border">{payment.paymentMethod}</td>
                        <td className="px-4 py-2 border">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No payment records found.</p>
            )}
          </div>

          {/* Academic Section */}
          <div className="py-6 px-2 mt-10 flex flex-col gap-5 bg-white rounded-lg ">
            <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
            {academicData ? (
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left border">Subject</th>
                    <th className="px-4 py-2 text-left border">Score</th>
                    <th className="px-4 py-2 text-left border">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData[0]?.subjects.map((subject) => (
                    <tr key={subject.code}>
                      <td className="px-4 py-2 border">{subject.name}</td>
                      <td className="px-4 py-2 border">{subject.filteredScore}</td>
                      <td className="px-4 py-2 border">{getRemark(subject.filteredScore)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No academic data available.</p>
            )}
          </div>
    </div>
    </div>
  );
};

export default LearnerDetail;