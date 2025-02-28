import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaPlus, FaSearch } from "react-icons/fa";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
// import BASE_URL from "../config";
// axios.defaults.baseURL = BASE_URL;

const LearnerManagement = () => {
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
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
  const navigate = useNavigate();

  // Fetch all learners with pagination
  const fetchLearners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://eps-dashboard.onrender.com/api/learners?page=${currentPage}&limit=${learnersPerPage}`);
      setFilteredLearners(response.data.learners);
      setTotalPages(response.data.totalPages);
      setTotalLearners(response.data.totalLearners);
    } catch (error) {
      toast.error("Failed to fetch learners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [currentPage, learnersPerPage]);

  // Handle input change for adding a new learner
  const handleChange = (e) => {
    setNewLearner({ ...newLearner, [e.target.name]: e.target.value });
  };

  // Handle file input change for new learner
  const handleFileChange = (e) => {
    setNewLearner({ ...newLearner, learnerImage: e.target.files[0] });
  };

  // Add a new learner
  const addLearner = async () => {
    const formData = new FormData();
    Object.keys(newLearner).forEach((key) => {
      formData.append(key, newLearner[key]);
    });
    try {
      await axios.post("https://eps-dashboard.onrender.com/api/learners/add", formData);
      setModalOpen(false);
      fetchLearners();
      toast.success("Learner added successfully!");
    } catch (error) {
      toast.error("Failed to add learner");
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
      const response = await axios.get(`https://eps-dashboard.onrender.com/api/learners/search?regno=${searchTerm}`);
      setFilteredLearners(response.data.learners);
      setTotalPages(1);
    } catch (error) {
      toast.error("Failed to search learners");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  // Handle row click to navigate to learner detail page
  const handleRowClick = (learnerId) => {
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
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>
      <div className="p-4 w-full sm:p-6 bg-gray-100 min-h-screen">
        <ToastContainer />
        {/* Search Bar */}
        <div className="mb-4">
        <div className="flex flex-col md:flex-row   gap-2 justify-between">
         <div className="flex gap-2 justify-between">
         <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
         <h1 className="text-lg  text-2xl  font-semibold  sm:mb-0">Learner Management</h1>
         </div>
         <div className="flex justify-between gap-3">
           <div className="flex  focus:outline-none focus:ring-blue-500 focus:ring-2 rounded-lg">
           <input
            type="text"
            placeholder="Search by RegNO"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" p-2 w-full sm:w-64  max-w-40 "
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600  text-white px-2 hover:bg-blue-700 transition"
          >
            <p> <FaSearch/></p>
        
          </button>
           </div>
          <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 flex gap-1 max-w-64 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <p  className="pt-1"> <FaPlus/> </p>
        <p className="hidden md:flex"> Add Learner</p>
          </button>
         </div>
        <div className="hidden md:flex ">
          <UserAccount/>
        </div>
        </div>
      </div>

        {/* Add Learner Modal */}
        {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white max-h-[94vh] pb-20 md:pb-4 w-full sm:w-3/4 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg shadow-lg overflow-y-auto max-h-screen">
            <input type="text" name="name" placeholder="Name" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="text" name="birthCertificateNo" placeholder="birthCertificateNo" className="border p-2 w-full mb-2" onChange={handleChange} required />
            
            <input type="text" name="grade" placeholder="Grade" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="text" name="stream" placeholder="Stream" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <select name="gender" className="border p-2 w-full mb-2" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input type="date" name="dateOfBirth" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="text" name="nationality" placeholder="Nationality" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="text" name="guardianName" placeholder="Guardian Name" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="text" name="guardianPhone" placeholder="Guardian Phone" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="file" className="border p-2 w-full mb-2" onChange={handleFileChange} required />
            {newLearner.learnerImage && (
              <img src={URL.createObjectURL(newLearner.learnerImage)} alt="Preview" className="w-full h-32 object-cover mb-2" />
            )}
            <div className="flex justify-end col-span-1 sm:col-span-2 md:col-span-3">
              <button
                onClick={addLearner}
                className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
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
              <p className="text-slate-800 bg-gray-50 border px-2 rounded-lg text-slate-700 font-semibold text-lg">{totalLearners}</p>
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
                    <tr key={learner._id} className="text-center hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">
                        <img
                          src={`http://localhost:3000${learner.learnerImage}`}
                          alt={learner.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">{learner.name}</td>
                      <td className="border border-gray-300 p-2">{learner.regno}</td>
                      <td className="border border-gray-300 p-2">{learner.grade}</td>
                      <td className="border border-gray-300 p-2">{learner.stream}</td>
                      <td className="border border-gray-300 p-2">{learner.gender}</td>
                      <td className="border border-gray-300 p-2">{learner.guardianName}</td>
                      <td className="border border-gray-300 p-2">{learner.guardianPhone}</td>
                      <td className="border flex gap-2 border-gray-300 p-2">
                        <button
                          onClick={() => handleRowClick(learner._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-red-900 transition"
                        >
                          View More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               {/* Pagination Controls */}
            <div className="flex justify-center  mt-6">
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
        )}

       
      </div>
    </div>
  );
};

export default LearnerManagement;