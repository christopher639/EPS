import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
import { NavLink } from "react-router-dom";

const FeesDistribution = () => {
  const [feeDistributions, setFeeDistributions] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFeeDistribution, setCurrentFeeDistribution] = useState({
    dateDistributed: "",
    feesCategory: "",
    feeAmount: 0,
    grade: "",
    term: "",
    year: "",
    studentType: "",
  });
  const [totalsByCategory, setTotalsByCategory] = useState([]);
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [grade, setGrade] = useState("");

  // Fetch all fee distributions
  const fetchFeeDistributions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/fee-distributions");
      setFeeDistributions(response.data);
      setFilteredFees(response.data); // Initialize filteredFees with all data
    } catch (error) {
      toast.error("Error fetching fee distributions: " + error.message);
    }
  };

  // Fetch total fee amounts by category
  const fetchTotalsByCategory = async () => {
    if (!year || !term || !grade) {
      toast.warning("Please provide year, term, and grade to fetch totals.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/api/fees-distribution/${year}/${term}/${grade}`
      );
      setTotalsByCategory(response.data);
    } catch (error) {
      toast.error("Error fetching totals by category: " + error.message);
    }
  };

  useEffect(() => {
    fetchFeeDistributions();
  }, []);

  // Handle input change for the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFeeDistribution({ ...currentFeeDistribution, [name]: value });
  };

  // Open modal for adding or editing a fee distribution
  const openModal = (feeDistribution = null) => {
    if (feeDistribution) {
      setCurrentFeeDistribution(feeDistribution);
      setIsEditMode(true);
    } else {
      setCurrentFeeDistribution({
        dateDistributed: "",
        feesCategory: "",
        feeAmount: 0,
        grade: "",
        term: "",
        year: "",
        studentType: "",
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission for adding/editing fee distribution
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:3000/api/fee-distributions/${currentFeeDistribution._id}`,
          currentFeeDistribution
        );
        toast.success("Fee distribution updated successfully!");
      } else {
        await axios.post(
          "http://localhost:3000/api/fee-distributions",
          currentFeeDistribution
        );
        toast.success("Fee distribution added successfully!");
      }
      fetchFeeDistributions();
      closeModal();
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  // Apply filter based on grade
  const applyFilter = () => {
    if (grade.trim() === "") {
      setFilteredFees(feeDistributions);
    } else {
      setFilteredFees(feeDistributions.filter(fee => fee.grade.toLowerCase() === grade.toLowerCase()));
    }
  };

  // Handle delete fee distribution
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/fee-distributions/${id}`);
      toast.success("Fee distribution deleted successfully!");
      fetchFeeDistributions();
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  // Toggle sidebar visibility
  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? "w-72" : "w-16"} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 w-full ">
        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-sm p-4 border-b">
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <h1 className="text-xl font-bold text-gray-800">Fee Distribution Management</h1>
          <UserAccount />
        </div>
        <ToastContainer />

        {/* Add Fee Distribution Button */}
        <div className="p-4  flex justify-between ">
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md  hover:bg-blue-600"
          >
            Add New Fee Distribution
          </button>
            {/* Filter by Grade */}
        <div className=" flex items-center">
          <input
            type="text"
            placeholder="Filter by Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="p-2 border rounded-md mr-2"
          />
          <button
            onClick={applyFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>
         <NavLink to="/fees-structure">
         <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md  hover:bg-blue-600"
          >
            Fee Structures
          </button>
         </NavLink>
        </div>

      

        {/* Fee Distribution Table */}
        <div className="px-4  pt-4 pb-8 max-h-[73vh]  overflow-x-auto overflow-y-auto">
          <div className=" bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Grade</th>
                  <th className="px-6 py-3 text-left">Term</th>
                  <th className="px-6 py-3 text-left">Year</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => (
                  <tr key={fee._id} className="border-b">
                    <td className="px-6 py-4">{new Date(fee.dateDistributed).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{fee.feesCategory}</td>
                    <td className="px-6 py-4">${fee.feeAmount}</td>
                    <td className="px-6 py-4">{fee.grade}</td>
                    <td className="px-6 py-4">{fee.term}</td>
                    <td className="px-6 py-4">{fee.year}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openModal(fee)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(fee._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add/Edit Fee Distribution */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? "Edit Fee Distribution" : "Add New Fee Distribution"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="dateDistributed"
                    value={currentFeeDistribution.dateDistributed}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="feesCategory"
                    placeholder="Fees Category"
                    value={currentFeeDistribution.feesCategory}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />
                  <input
                    type="number"
                    name="feeAmount"
                    placeholder="Fee Amount"
                    value={currentFeeDistribution.feeAmount}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="grade"
                    placeholder="Grade"
                    value={currentFeeDistribution.grade}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="term"
                    placeholder="Term"
                    value={currentFeeDistribution.term}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={currentFeeDistribution.year}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="studentType"
                    placeholder="Student Type"
                    value={currentFeeDistribution.studentType}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    {isEditMode ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesDistribution;