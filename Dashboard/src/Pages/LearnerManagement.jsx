import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:3000";

const LearnerManagement = () => {
  const [learners, setLearners] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]); // State for filtered learners
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [newLearner, setNewLearner] = useState({
    name: "",
    regno: "",
    grade: "",
    stream: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    learnerImage: null,
  });
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [learnersPerPage, setLearnersPerPage] = useState(10); // Learners per page
  const navigate = useNavigate();

  // Fetch all learners with pagination
  const fetchLearners = async () => {
    setIsLoading(true); // Show loading spinner
    try {
      const response = await axios.get(`/api/learners?page=${currentPage}&limit=${learnersPerPage}`);
      setLearners(response.data.learners);
      setFilteredLearners(response.data.learners); // Initialize filtered learners
      setTotalPages(response.data.totalPages); // Set total pages
    } catch (error) {
      toast.error("Failed to fetch learners");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [currentPage, learnersPerPage]); // Fetch learners when page or learnersPerPage changes

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
      await axios.post("/api/learners/add", formData);
      setModalOpen(false);
      fetchLearners(); // Refresh the list after adding a learner
      toast.success("Learner added successfully!");
    } catch (error) {
      toast.error("Failed to add learner");
    }
  };

  // Delete learner
  const deleteLearner = async (id) => {
    try {
      await axios.delete(`/api/learners/${id}`);
      setDeleteModalOpen(false);
      fetchLearners(); // Refresh the list after deleting a learner
      toast.success("Learner deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete learner");
    }
  };

  // Handle search by registration number
  const handleSearch = async () => {
    if (!searchTerm) {
      fetchLearners(); // Reset to all learners if search term is empty
      return;
    }

    setIsLoading(true); // Show loading spinner
    try {
      const response = await axios.get(`/api/learners/search?regno=${searchTerm}`);
      setFilteredLearners(response.data.learners);
      setTotalPages(1); // Reset pagination for search results
    } catch (error) {
      toast.error("Failed to search learners");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // Handle row click to navigate to learner detail page
  const handleRowClick = (learnerId) => {
    navigate(`/learner/${learnerId}`);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Learner Management</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Learner
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by Registration Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 w-full sm:w-64 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Add Learner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white w-full sm:w-3/4 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg shadow-lg overflow-y-auto max-h-screen">
            <input type="text" name="name" placeholder="Name" className="border p-2 w-full mb-2" onChange={handleChange} required />
            <input type="text" name="regno" placeholder="Registration Number" className="border p-2 w-full mb-2" onChange={handleChange} required />
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
        <div className="bg-white shadow-lg md:mx-0 grid gri-cols-1 pb-6 max-h-[72vh] md:max-h-[75vh] overflow-y-auto overflow-x-auto md:mr-0 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Learner List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Image</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Reg No</th>
                  <th className="border border-gray-300 p-2">Grade</th>
                  <th className="border border-gray-300 p-2">Stream</th>
                  <th className="border border-gray-300 p-2">Gender</th>
                  <th className="border border-gray-300 p-2">DOB</th>
                  <th className="border border-gray-300 p-2">Nationality</th>
                  <th className="border border-gray-300 p-2">Guardian</th>
                  <th className="border border-gray-300 p-2">Phone</th>
                  <th className="border border-gray-300 p-2">Address</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLearners.map((learner) => (
                  <tr
                    key={learner._id}
                    className="text-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(learner._id)}
                  >
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
                    <td className="border border-gray-300 p-2">{new Date(learner.dateOfBirth).toLocaleDateString()}</td>
                    <td className="border border-gray-300 p-2">{learner.nationality}</td>
                    <td className="border border-gray-300 p-2">{learner.guardianName}</td>
                    <td className="border border-gray-300 p-2">{learner.guardianPhone}</td>
                    <td className="border border-gray-300 p-2">{learner.address}</td>
                    <td className="border flex gap-2 border-gray-300 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Stop event propagation
                          setSelectedLearner(learner);
                          setDeleteModalOpen(true);
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="flex items-center mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
        </div>
      )}

    

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedLearner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete {selectedLearner.name}?
            </h2>
            <p className="text-gray-600 mb-4">
              This action is irreversible, and the student data will disappear permanently.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => deleteLearner(selectedLearner._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerManagement;