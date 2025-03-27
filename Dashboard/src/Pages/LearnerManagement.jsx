import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaPlus, FaSearch } from "react-icons/fa";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
import MobileNav from "../components/MobileNav";

const LearnerManagement = () => {
  const [streams, setStreams] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [clases, setClases] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [newLearner, setNewLearner] = useState({
    name: "",
    grade: "",
    stream: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    birthCertificateNo: "",
    learnerImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sideBar, setSideBar] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLearners, setTotalLearners] = useState(0);
  const [learnersPerPage, setLearnersPerPage] = useState(50);
  const [loadingProfile, setLoadingProfile] = useState(null);
  const [isSavingLearner, setIsSavingLearner] = useState(false);
  const navigate = useNavigate();


  // Fetch all learners with pagination
  const fetchLearners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/learners?page=${currentPage}&limit=${learnersPerPage}`
      );
      setFilteredLearners(response.data.learners);
      setTotalPages(response.data.totalPages);
      setTotalLearners(response.data.totalLearners);
    } catch (error) {
      toast.error("Failed to fetch learners");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all clases
  const fetchClases = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/clase");
      setClases(data);
    } catch (err) {
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch streams
  const fetchStreams = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/streams");
      setStreams(response.data);
    } catch (error) {
      toast.error("Failed to fetch streams");
    }
  };

  // Handle input change for adding a new learner
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle class selection
    if (name === "selectedClass") {
      const selectedClass = clases.find((c) => c._id === value);
      if (selectedClass) {
        setNewLearner({
          ...newLearner,
          grade: selectedClass.name
        });
        return;
      }
    }
    // Handle stream selection
    if (name === "selectedStream") {
      const selectedStream = streams.find((s) => s._id === value);
      if (selectedStream) {
        setNewLearner({
          ...newLearner,
          stream: selectedStream.name
        });
        return;
      }
    }

    setNewLearner({ ...newLearner, [name]: value });
  };

  // Handle file input change for new learner
  const handleFileChange = (e) => {
    setNewLearner({ ...newLearner, learnerImage: e.target.files[0] });
  };

  // Add a new learner
  const addLearner = async () => {
    setIsSavingLearner(true);
    const formData = new FormData();
    
    // Append all newLearner fields to formData
    Object.keys(newLearner).forEach((key) => {
      if (newLearner[key] !== null) {
        formData.append(key, newLearner[key]);
      }
    });

    try {
      await axios.post("http://localhost:3000/api/learners/add", formData);
      setModalOpen(false);
      fetchLearners();
      toast.success("Learner added successfully!");
      
      // Reset form
      setNewLearner({
        name: "",
        grade: "",
        stream: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        guardianName: "",
        guardianPhone: "",
        address: "",
        birthCertificateNo: "",
        learnerImage: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add learner");
    } finally {
      setIsSavingLearner(false);
    }
  };

  // Handle search by registration number
  const handleSearch = async () => {
    if (!searchTerm) {
      fetchLearners();
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/learners/search?regno=${searchTerm}`
      );
      setFilteredLearners(response.data.learners);
      setTotalPages(1);
    } catch (error) {
      toast.error("Failed to search learners");
    } finally {
      setIsLoading(false);
    }
  };

  
  // Fetch all data
  useEffect(() => {
    fetchLearners();
    fetchClases();
    fetchStreams();
  }, [currentPage, learnersPerPage]);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  // Handle row click to navigate to learner detail page
  const handleRowClick = (learnerId) => {
    setLoadingProfile(learnerId);
    navigate(`/learner/${learnerId}`);
  };

  // Generate page numbers for pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex">
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? "w-0 md:w-72" : "w-0"
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>
      <div className="py-4 w-full sm:p-6 bg-gray-100 min-h-screen">
        <ToastContainer />
        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-2 justify-between">
            <div className="flex gap-2 justify-between">
              <MobileNav />
              <div className="hidden md:flex">
                <SidebarToggleButton
                  toggleSidebar={toggleSideBar}
                  isSidebarCollapsed={!sideBar}
                />
              </div>
              <h1 className="font-semibold sm:mb-0">Learner</h1>
              <div className="md:hidden">
                <UserAccount />
              </div>
            </div>
            <div className="flex mx-4 justify-between gap-3">
              <div className="flex focus:outline-none focus:ring-blue-500 focus:ring-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Search by RegNO"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-2 w-full sm:w-64 max-w-40"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-2 hover:bg-blue-700 transition"
                >
                  <FaSearch />
                </button>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 flex gap-1 max-w-64 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <p className="pt-1">
                  <FaPlus />
                </p>
                <p className="hidden md:flex"> Add Learner</p>
              </button>
            </div>
            <div className="hidden md:flex">
              <UserAccount />
            </div>
          </div>
        </div>

        {/* Add Learner Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white mt-4 max-h-[75vh] pb-20 md:pb-4 w-full sm:w-3/4 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg shadow-lg overflow-y-auto">
              <p className="col-span-1 sm:col-span-2 md:col-span-3">
                Fill the form to add Learners
              </p>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.name}
                required
              />
              <input
                type="text"
                name="birthCertificateNo"
                placeholder="Birth Certificate No"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.birthCertificateNo}
                required
              />

              {/* Class Selection */}
              <div className="mb-2">
                <select
                  name="selectedClass"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  value={clases.find((c) => c.name === newLearner.grade)?._id || ""}
                  required
                >
                  <option value="">Select a Class</option>
                  {clases.map((clase) => (
                    <option key={clase._id} value={clase._id}>
                      {clase.clasename}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream Selection */}
              <div className="mb-2">
                <select
                  name="selectedStream"
                  className="border p-2 w-full"
                  onChange={handleChange}
                  value={streams.find((s) => s.name === newLearner.stream)?._id || ""}
                  required
                >
                  <option value="">Select a Stream</option>
                  {streams.map((stream) => (
                    <option key={stream._id} value={stream._id}>
                      {stream.name}
                    </option>
                  ))}
                </select>
              </div>

              <select
                name="gender"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.gender}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                name="dateOfBirth"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.dateOfBirth}
                required
              />
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.nationality}
                required
              />
              <input
                type="text"
                name="guardianName"
                placeholder="Guardian Name"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.guardianName}
                required
              />
              <input
                type="text"
                name="guardianPhone"
                placeholder="Guardian Phone"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.guardianPhone}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                value={newLearner.address}
                required
              />
              <input
                type="file"
                name="learnerImage"
                className="border p-2 w-full mb-2"
                onChange={handleFileChange}
                required
              />
              {newLearner.learnerImage && (
                <img
                  src={
                    typeof newLearner.learnerImage === "string"
                      ? `http://localhost:3000${newLearner.learnerImage}`
                      : URL.createObjectURL(newLearner.learnerImage)
                  }
                  alt="Preview"
                  className="w-full h-32 object-cover mb-2"
                />
              )}
              <div className="flex justify-end col-span-1 sm:col-span-2 md:col-span-3">
                <button
                  onClick={addLearner}
                  disabled={isSavingLearner}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-700 transition flex items-center justify-center min-w-[80px]"
                >
                  {isSavingLearner && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  )}
                  Save
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                  disabled={isSavingLearner}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Learners List */}
        {!isLoading && (
          <div className="bg-white shadow-lg md:mx-0 grid gri-cols-1 pb-48 md:pb-6 max-h-screen md:max-h-[85vh] overflow-y-auto overflow-x-auto md:mr-0 rounded-lg p-4">
            <div className="flex mb-4 gap-2">
              <h2 className="text-xl font-semibold">Total Learners</h2>
              <p className="text-slate-800 bg-gray-50 border px-2 rounded-lg text-slate-700 font-semibold text-lg">
                {totalLearners}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Image</th>
                    <th className="border border-gray-300 p-2">Full Name</th>
                    <th className="border border-gray-300 p-2">Reg No</th>
                    <th className="border border-gray-300 p-2">Grade</th>
                    <th className="border border-gray-300 p-2">Stream</th>
                    <th className="border border-gray-300 p-2">Gender</th>
                    <th className="border border-gray-300 p-2">P/G Name</th>
                    <th className="border border-gray-300 p-2">P/G Phone</th>
                    <th className="border border-gray-300 p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLearners.map((learner) => (
                    <tr
                      key={learner._id}
                      className="text-center hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 p-2">
                        <img
                          src={`http://localhost:3000${learner.learnerImage}`}
                          alt={learner.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        {learner.name}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {learner.regno}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {learner.grade}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {learner.stream}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {learner.gender}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {learner.guardianName}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {learner.guardianPhone}
                      </td>
                      <td className="border flex gap-2 border-gray-300 p-2">
                        <button
                          onClick={() => handleRowClick(learner._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-red-900 transition flex items-center justify-center min-w-[100px]"
                          disabled={loadingProfile === learner._id}
                        >
                          {loadingProfile === learner._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          ) : null}
                          View More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className = "max-w-screen overflow-x-auto flex">
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  Previous
                </button>
                {renderPageNumbers()}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
      f
    </div>
  );
};

export default LearnerManagement;