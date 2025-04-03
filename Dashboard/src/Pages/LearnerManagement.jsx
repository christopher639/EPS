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
        `https://eps-dashboard.onrender.com/api/learners?page=${currentPage}&limit=${learnersPerPage}`
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
      const { data } = await axios.get("https://eps-dashboard.onrender.com/api/clase");
      setClases(data);
    } catch (err) {
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch streams
  const fetchStreams = async () => {
    try {
      const response = await axios.get("https://eps-dashboard.onrender.com/api/streams");
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
      await axios.post("https://eps-dashboard.onrender.com/api/learners/add", formData);
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
        `https://eps-dashboard.onrender.com/api/learners/search?regno=${searchTerm}`
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
          className={`px-2 sm:px-4 py-1 sm:py-2 mx-1 rounded-lg text-xs sm:text-sm ${
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
      <div className="  w-full  bg-gray-100 min-h-screen">
        <ToastContainer />
        {/* Search Bar */}
        <div className="mb-0  bg-white py-[19px] border-b  ">
  <div className="flex flex-col md:flex-row gap-2 justify-between">
    <div className="flex items-center    justify-between gap-4 w-full  ">
      {/* Mobile Navigation (Left Side) */}
      <div className="flex px-2 items-center gap-2">
        <MobileNav className="text-blue-600 hover:text-blue-800 transition-colors" />
        <div className="hidden md:block">
          <SidebarToggleButton
            toggleSidebar={toggleSideBar}
            isSidebarCollapsed={!sideBar}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          />
        </div>
      </div>
      <div className="hidden md:flex max-w-128 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:border-blue-300 transition-all">
  <input
    type="text"
    placeholder="Search by RegNo..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="px-3 py-1 text-xs sm:text-sm w-full focus:outline-none"
  />
  <button
    onClick={handleSearch}
    className="bg-blue-600 text-white px-3 hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
    data-tooltip-id="search-tooltip"
    data-tooltip-content="Search learners"
  >
    <FaSearch className="text-xs sm:text-sm" />
  </button>
</div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 hidden md:flex mx-2 flex gap-2 items-center max-w-64 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors  shadow-md hover:shadow-lg text-xs sm:text-sm"
        data-tooltip-id="add-tooltip"
        data-tooltip-content="Add new learner"
      >
        <FaPlus className="text-xs sm:text-sm" />
  
      </button>
    <img src="lion.jpg" alt="" className="h-[54px] md:hidden" />
    
       
      {/* User Account (Right Side) */}
      <div className="md:hidden">
        <UserAccount className="text-blue-600" />
      </div>
    </div>

   
  
    <div className="hidden md:flex">
      <UserAccount className="text-blue-600 hover:text-blue-800 transition-colors" />
    </div>
  </div>

  
</div>


        {/* Add Learner Modal - Unchanged as requested */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-2xl max-h-[95vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 sm:p-4 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Add New Learner</h2>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                  disabled={isSavingLearner}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-3 sm:p-4 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-1 gap-4">
                  {/* Personal Information */}
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 border-b pb-1">Personal Information</h3>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        value={newLearner.name}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Birth Cert No</label>
                      <input
                        type="text"
                        name="birthCertificateNo"
                        placeholder="12345678"
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        value={newLearner.birthCertificateNo}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange}
                          value={newLearner.gender}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange}
                          value={newLearner.dateOfBirth}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        placeholder="Kenyan"
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        value={newLearner.nationality}
                        required
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 border-b pb-1">Academic Information</h3>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select
                        name="selectedClass"
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        value={clases.find((c) => c.name === newLearner.grade)?._id || ""}
                        required
                      >
                        <option value="">Select Class</option>
                        {clases.map((clase) => (
                          <option key={clase._id} value={clase._id}>
                            {clase.clasename}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Stream</label>
                      <select
                        name="selectedStream"
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        value={streams.find((s) => s.name === newLearner.stream)?._id || ""}
                        required
                      >
                        <option value="">Select Stream</option>
                        {streams.map((stream) => (
                          <option key={stream._id} value={stream._id}>
                            {stream.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 border-b pb-1">Guardian Information</h3>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                      <input
                        type="text"
                        name="guardianName"
                        placeholder="Jane Doe"
                        className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        value={newLearner.guardianName}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          name="guardianPhone"
                          placeholder="0712345678"
                          className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange}
                          value={newLearner.guardianPhone}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Nairobi"
                          className="w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500"
                          onChange={handleChange}
                          value={newLearner.address}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 border-b pb-1">Learner Photo</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                        <label className="flex flex-col items-center justify-center w-full p-2 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
                              Click to upload or drag and drop
                            </p>
                          </div>
                          <input 
                            type="file" 
                            name="learnerImage" 
                            className="hidden" 
                            onChange={handleFileChange} 
                            accept="image/*"
                            required
                          />
                        </label>
                      </div>
                      
                      {newLearner.learnerImage && (
                        <div className="flex justify-center">
                          <img
                            src={
                              typeof newLearner.learnerImage === "string"
                                ? ` https://eps-dashboard.onrender.com${newLearner.learnerImage}`
                                : URL.createObjectURL(newLearner.learnerImage)
                            }
                            alt="Preview"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-3 sm:px-4 py-3 flex justify-end space-x-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 transition"
                  disabled={isSavingLearner}
                >
                  Cancel
                </button>
                <button
                  onClick={addLearner}
                  disabled={isSavingLearner}
                  className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 transition flex items-center justify-center min-w-[80px] sm:min-w-[100px]"
                >
                  {isSavingLearner ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
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
          <div className="bg-white mx-4  md:mx-0 grid gri-cols-1 pb-4 md:pb-6 max-h-screen max-h-[75vh] md:max-h-[85vh] pb-20 md:pb-5 overflow-y-auto overflow-x-auto   ">
            <div className="flex ">       
    <div className="flex   mx-2  justify-between gap-2 sm:gap-3 items-center">
    <div className="flex md:hidden  focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:border-blue-300 transition-all">
        <input
          type="text"
          placeholder="Search by RegNo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 text-xs sm:text-sm w-full sm:w-64 max-w-40 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-3 hover:bg-blue-700 transition-colors flex items-center justify-center"
          data-tooltip-id="search-tooltip"
          data-tooltip-content="Search learners"
        >
          <FaSearch className="text-xs sm:text-sm" />
        </button>
      </div>
      
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 md:hidden mx-2 flex gap-2 items-center max-w-64 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors  shadow-md hover:shadow-lg text-xs sm:text-sm"
        data-tooltip-id="add-tooltip"
        data-tooltip-content="Add new learner"
      >
        <FaPlus className="text-xs sm:text-sm" />
  
      </button>
    </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className=" p-1 sm:p-2">#</th>
                    <th className=" p-1 sm:p-2">Image</th>
                    <th className=" p-1 sm:p-2">Full Name</th>
                    <th className=" p-1 sm:p-2">Reg No</th>
                    <th className=" p-1 sm:p-2">Grade</th>
                    <th className=" p-1 sm:p-2">Stream</th>
                    <th className=" p-1 sm:p-2">Gender</th>
                    <th className=" p-1 sm:p-2">P/G Name</th>
                    <th className=" p-1 sm:p-2">P/G Phone</th>
                    <th className=" p-1 sm:p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLearners.map((learner) => (
                    <tr
                      key={learner._id}
                      className="text-center border-y border-gray-300 hover:bg-gray-100"
                    >
                      <td className="p-1 sm:p-2">
                        {learner.index}
                      </td>
                      <td className=" p-1 sm:p-2">
                        <img
                          src={` https://eps-dashboard.onrender.com${learner.learnerImage}`}
                          alt={learner.name}
                          className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className=" p-1 sm:p-2">
                        {learner.name}
                      </td>
                      <td className="p-1 sm:p-2">
                        {learner.regno}
                      </td>
                      <td className=" p-1 sm:p-2">
                        {learner.grade}
                      </td>
                      <td className=" p-1 sm:p-2">
                        {learner.stream}
                      </td>
                      <td className=" p-1 sm:p-2">
                        {learner.gender}
                      </td>
                      <td className=" p-1 sm:p-2">
                        {learner.guardianName}
                      </td>
                      <td className=" p-1 sm:p-2">
                        {learner.guardianPhone}
                      </td>
                      <td className="flex gap-1 sm:gap-2   p-1 sm:p-2">
                        <button
                          onClick={() => handleRowClick(learner._id)}
                          className="bg-blue-600 mt-2 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-900 transition flex items-center justify-center min-w-[60px] sm:min-w-[100px] text-xs sm:text-sm"
                          disabled={loadingProfile === learner._id}
                        >
                          {loadingProfile === learner._id ? (
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white mr-1 sm:mr-2"></div>
                          ) : null}
                          View More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="max-w-screen overflow-x-auto flex">
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg mr-1 sm:mr-2 hover:bg-blue-700 transition disabled:bg-gray-400 text-xs sm:text-sm"
                  >
                    Previous
                  </button>
                  {renderPageNumbers()}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg ml-1 sm:ml-2 hover:bg-blue-700 transition disabled:bg-gray-400 text-xs sm:text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerManagement;