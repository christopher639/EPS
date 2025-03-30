import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../components/SideBar";
import MobileNav from "../components/MobileNav";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";

axios.defaults.baseURL = "https://eps-dashboard.onrender.com";

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
  </div>
);

const LearnerDetail = () => {
  const { id } = useParams();
  const [academicData, setAcademicData] = useState(null);
  const [sideBar, setSideBar] = useState(true);
  const [feesPayments, setFeesPayments] = useState([]);
  const [year, setYear] = useState("2024-2025");
  const [term, setTerm] = useState("Term-1");
  const [category, setCategory] = useState("Opener");
  const [regno, setRegno] = useState("");
  const [learner, setLearner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedLearner, setUpdatedLearner] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearner();
  }, [id]);

  const fetchLearner = async () => {
    try {
      const response = await axios.get(`https://eps-dashboard.onrender.com/api/learners/${id}`);
      setLearner(response.data);
      setRegno(response.data.regno);
      setUpdatedLearner(response.data.learner);
    } catch (error) {
      console.error("Error fetching learner details:", error);
      toast.error("Failed to fetch learner details");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLearner({ ...updatedLearner, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const saveChanges = async () => {
    setIsUpdating(true);
    const formData = new FormData();
    Object.keys(updatedLearner).forEach((key) => {
      formData.append(key, updatedLearner[key]);
    });
    if (newImage) {
      formData.append("learnerImage", newImage);
    }

    try {
      await axios.put(`https://eps-dashboard.onrender.com/api/learners/${id}`, formData);
      setIsEditing(false);
      fetchLearner();
      toast.success("Learner updated successfully!");
    } catch (error) {
      console.error("Error updating learner:", error);
      toast.error("Failed to update learner");
    } finally {
      setIsUpdating(false);
    }
  };

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
    if (score >= 75) return "E.E";
    if (score >= 50) return "M.E";
    if (score >= 0) return "B.E";
    return "F";
  };

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  if (!learner) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>
      <div className="p-3 sm:p-6 w-full bg-gray-100 max-h-[100vh] overflow-y-auto min-h-screen">
        <ToastContainer />
       
        {/* Responsive Header */}
        <div className="flex items-center justify-between gap-2 py-2">
          <MobileNav className="text-xs"/>
          <div className="hidden md:flex">
            <SidebarToggleButton 
              toggleSidebar={toggleSideBar} 
              isSidebarCollapsed={!sideBar} 
            />
          </div>
          <p className="text-xs sm:text-sm font-medium whitespace-nowrap mx-1">
            Learner Details
          </p>
          <div className="">
            <UserAccount className="text-xs"/>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-6">
          <h1 className="text-lg sm:text-xl font-semibold mb-3"></h1>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Column: Image */}
            <div className="flex flex-col items-center md:items-start">
              <img
                src={
                  newImage
                    ? URL.createObjectURL(newImage)
                    : `https://eps-dashboard.onrender.com${learner.learner.learnerImage}`
                }
                alt={learner.learner.name}
                className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-md mb-3"
              />
              {isEditing && (
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border p-1 sm:p-2 text-xs sm:text-sm w-full max-w-[200px] mb-3"
                />
              )}
            </div>

            {/* Right Column: Learner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
              {Object.entries(learner.learner).map(([key, value]) => (
                <div className="flex  flex-row justify-between gap-1 sm:gap-2" key={key}>
                  <label className="block text-xs sm:text-sm text-gray-700 font-medium capitalize">
                    {key}:
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={updatedLearner[key] || ""}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm font-bold">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end mt-4 gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={saveChanges}
                  className="text-xs sm:text-sm bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Spinner /> : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs sm:text-sm bg-gray-400 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs sm:text-sm bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="text-xs sm:text-sm bg-gray-400 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Back
            </button>
          </div>
        </div>

        <div className="py-4 px-2 mt-6 flex flex-col gap-3 bg-white rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Fees Payment Statement</h2>
          {feesPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left border">Payment ID</th>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left border">Amount</th>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left border">Method</th>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feesPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-100 transition-colors">
                      <td className="px-2 py-1 sm:px-4 sm:py-2 border truncate max-w-[80px]">{payment._id}</td>
                      <td className="px-2 py-1 sm:px-4 sm:py-2 border">Ksh {payment.amountPaid.toLocaleString()}</td>
                      <td className="px-2 py-1 sm:px-4 sm:py-2 border">{payment.paymentMethod}</td>
                      <td className="px-2 py-1 sm:px-4 sm:py-2 border">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600">No payment records found.</p>
          )}
        </div>

        {/* Academic Section */}
        <div className="py-4 px-2 mt-6 flex flex-col gap-3 bg-white rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Academic Information</h2>
          {academicData ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left border">Subject</th>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left border">Score</th>
                    <th className="px-2 py-1 sm:px-4 sm:py-2 text-left border">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData[0]?.subjects.map((subject) => (
                    <tr key={subject.code}>
                      <td className="px-2 py-1 sm:px-4 sm:py-2 border">{subject.name}</td>
                      <td className="px-2 py-1 sm:px-4 sm:py-2 border">{subject.filteredScore}</td>
                      <td className="px-2 py-1 sm:px-4 sm:py-2 border">{getRemark(subject.filteredScore)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs sm:text-sm">No academic data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnerDetail;