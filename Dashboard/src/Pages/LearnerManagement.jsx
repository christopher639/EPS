import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaGraduationCap, FaPlus, FaRegSquare, FaSearch, FaUser, FaUsers } from "react-icons/fa";
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

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
          className={`px-3 py-1 mx-1 rounded-md text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sideBar ? "w-0 md:w-64" : "w-0"
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <header className="bg-white  py-[6px] border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <MobileNav className="text-blue-600 hover:text-blue-800 transition-colors" />
              <SidebarToggleButton
                toggleSidebar={toggleSideBar}
                isSidebarCollapsed={!sideBar}
                className="hidden md:block text-blue-600 hover:text-blue-800 transition-colors"
              />
              
              {/* Desktop Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search by registration number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent border-none focus:outline-none w-full text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
            <button
              onClick={() => setModalOpen(true)}
              className="hidden md:flex items-center bg-[rgb(232,240,254)] border border-[rgb(26,115,232)] text-blue-600 px-4 py-2 rounded-full hover:bg-[rgb(221,232,252)] transition-colors text-sm"
            >
              <FaPlus className="mr-2" />
              Add Learner
            </button>
              <UserAccount />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden px-4 pb-3">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Search learners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none focus:outline-none w-full text-sm"
              />
              <button
                onClick={handleSearch}
                className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="bg-gray-50 mx-1 md:mx-1  mx-0 grid gri-cols-1 pb-4 max-h-[60vh] pb-40 md:pb-6 max-h-screen md:max-h-[90vh] pb-20 md:pb-5 overflow-y-auto overflow-x-auto rounded-lg p-2 sm:p-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="bg-white flex justify-between  p-4 rounded-lg  border border-1 border-gray-300">
             <div>
             <h3 className="text-gray-500 text-sm font-medium">Total Learners</h3>
             <p className="text-2xl font-bold text-gray-800">{totalLearners}</p>
             </div>
             <div>
              <FaUsers className='text-4xl text-blue-500' />
             </div>
            </div>
            <div className="bg-white p-4 flex justify-between  gap-1 rounded-lg  border   border-1 border-gray-300">
              <div>
              <h3 className="text-gray-500 text-sm font-medium"> Alumni </h3>
              <p className="font-bold text-2xl ">0</p>
              </div>
             <div>
             <FaGraduationCap className='text-4xl text-blue-500' />
             </div>
            </div>
            <div className="bg-white p-4 flex justify-center rounded-lg  border border-1 border-gray-300 ">
             <div>
             <h3 className="text-gray-500 text-sm font-medium">Current Page</h3>
             <p className="text-2xl font-bold text-gray-800">{currentPage} of {totalPages}</p>
             </div>
            </div>
            <div className="bg-white p-4 rounded-lg  border   border-1 border-gray-300">
              <h3 className="text-gray-500 text-sm font-medium">Results Per Page</h3>
              <select 
                value={learnersPerPage}
                onChange={(e) => setLearnersPerPage(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

           
          </div>

          {/* Add Learner Button (Mobile) */}
          <button
            onClick={() => setModalOpen(true)}
           className="md:hidden items-center bg-[rgb(232,240,254)] border border-[rgb(26,115,232)] text-blue-600 px-4  mb-2 py-1 rounded-full hover:bg-[rgb(221,232,252)] transition-colors text-sm"
          >
            <FaPlus className="" />
          <p>  Add New Learner</p>
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Learners Table */}
          {!isLoading && (
            <div className="bg-white rounded-lg  border-1 border-gray-300 border  overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Photo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reg No
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stream
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                    
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLearners.map((learner, index) => (
                      <tr key={learner._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {(currentPage - 1) * learnersPerPage + index + 1}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img
                              src={`https://eps-dashboard.onrender.com${learner.learnerImage}`}
                              alt={learner.name}
                              className="h-full w-full object-cover"
                              // onError={(e) => {
                              //   e.target.src = 'https://via.placeholder.com/40';
                              // }}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {learner.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {learner.regno}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {learner.grade}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {learner.stream}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            learner.gender === 'Male' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-pink-100 text-pink-800'
                          }`}>
                            {learner.gender}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {learner.guardianPhone}
                        </td>
                      
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRowClick(learner._id)}
                            disabled={loadingProfile === learner._id}
                            className="md:flex items-center bg-[rgb(232,240,254)] border border-[rgb(26,115,232)] text-blue-600 px-4 py-1 rounded-full hover:bg-[rgb(221,232,252)] transition-colors text-sm"
                          >
                            {loadingProfile === learner._id ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                              </span>
                            ) : 'Profile'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white overflow-x-auto gap-2 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex gap-1">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * learnersPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * learnersPerPage, totalLearners)}</span> of{' '}
                      <span className="font-medium">{totalLearners}</span> learners
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {renderPageNumbers()}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

   {/* Add Learner Modal */}
{modalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          {isSavingLearner ? 'Edit Learner Details' : 'Add New Learner'}
        </h2>
        <button 
          onClick={() => setModalOpen(false)}
          className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-blue-800"
          disabled={isSavingLearner}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 max-h-[70vh] overflow-y-auto flex-1">
        <div className="space-y-8">
          {/* Personal Information Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={newLearner.name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Certificate No</label>
                <input
                  type="text"
                  name="birthCertificateNo"
                  placeholder="12345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={newLearner.birthCertificateNo}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={newLearner.gender}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={newLearner.dateOfBirth}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <select
                  name="nationality"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={newLearner.nationality}
                  required
                >
                  <option value="">Select Nationality</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="Ugandan">Ugandan</option>
                  <option value="Tanzanian">Tanzanian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Information Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  name="selectedClass"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                <select
                  name="selectedStream"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          </div>

          {/* Guardian Information Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={newLearner.guardianName}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1 text-gray-500">+254</span>
                  <input
                    type="text"
                    name="guardianPhone"
                    placeholder="712345678"
                    className="w-full pl-12 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={newLearner.guardianPhone}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main St, Nairobi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={newLearner.address}
                  required
                />
              </div>
            </div>
          </div>

          {/* Photo Upload Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100">Learner Photo</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              <div className="w-full sm:w-2/3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="learnerImage"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
              {newLearner.learnerImage && (
                <div className="flex justify-center sm:justify-start">
                  <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={
                        typeof newLearner.learnerImage === "string"
                          ? `https://eps-dashboard.onrender.com${newLearner.learnerImage}`
                          : URL.createObjectURL(newLearner.learnerImage)
                      }
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
        <button
          onClick={() => setModalOpen(false)}
          className="inline-flex justify-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={isSavingLearner}
        >
          Cancel
        </button>
        <button
          onClick={addLearner}
          disabled={isSavingLearner}
          className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors min-w-[120px]"
        >
          {isSavingLearner ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Learner'
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default LearnerManagement;