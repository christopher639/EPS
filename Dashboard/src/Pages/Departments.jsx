import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import UserAccount from "../components/UserAccount";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton"; // Import SidebarToggleButton
import BASE_URL from '../config';
axios.defaults.baseURL = BASE_URL;

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sideBar, setSideBar] = useState(true); // Sidebar state to toggle visibility
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    departmentHead: "",
    numberOfStaff: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
    establishedYear: "",
    budget: "",
  });
 

  const navigate = useNavigate();

  const fetchDepartments = () => {
    setLoading(true);
    axios
      .get("/api/departments")
      .then((response) => {
        setDepartments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const getFetchData = () => {
    setLoading(true);
    axios
      .get("/api/teachers")
      .then((response) => {
        setTeachers(response.data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/departments/${id}`);
      if (response.data.success) {
        toast.success("Department deleted successfully");
        setDepartments((prevDepartments) =>
          prevDepartments.filter((department) => department._id !== id)
        );
      } else {
        toast.error("Failed to delete department.");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Error deleting department. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.departmentCode || !formData.departmentName) {
      toast.error("Department Code and Name are required fields.");
      return;
    }

    axios
      .post("/api/departments", formData)
      .then(() => {
        toast.success("New department added successfully");
        setShowModal(false);
        fetchDepartments();
      })
      .catch((error) => {
        console.error("API Error:", error.response?.data || error.message);
        toast.error("Error adding department");
      });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  useEffect(() => {
    fetchDepartments();
    getFetchData();
  }, []);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? "w-72" : "w-16"
        } bg-gray-800 min-h-screen`}
      >
       <SideBar /> {/* Conditionally render Sidebar */}
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-sm p-4 border-b">
          <div className="flex items-center gap-2">
            {/* Render the SidebarToggleButton here */}
            <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          
            <h1 className="text-xl font-bold text-gray-800 sm:text-sm md:text-md lg:text-lg">SAMGE SCHOOL</h1>
            <p className="text-gray-500">Departments</p>
          </div>
          <input
            type="text"
            placeholder="Search "
            className="w-full max-w-40 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 flex text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none"
          >
            <p>+</p> <p className="hidden md:flex">Add </p>
          </button>
          <UserAccount />
        </div>

        {/* Modal for Adding New Department */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full md:w-2/3 shadow-lg">
              <p className="text-lg font-semibold mb-4">Add New Department</p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Department Code</p>
                    <input
                      type="text"
                      name="departmentCode"
                      value={formData.departmentCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Department Name</p>
                    <input
                      type="text"
                      name="departmentName"
                      value={formData.departmentName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Add other form inputs here */}
                </div>

                <div className="flex justify-end mt-6 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto mt-8 overflow-y-auto max-h-[76vh]">
            <table className="min-w-full table-auto shadow-md bg-white rounded-lg border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">No</th>
                  <th className="py-3 px-4 text-left">Code</th>
                  <th className="py-3 px-4 text-left">Department Name</th>
                  <th className="py-3 px-4 text-left">Chair</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments
                  .filter((department) =>
                    department.departmentName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((department, index) => (
                    <tr key={department._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{department.departmentCode}</td>
                      <td className="py-2 px-4">{department.departmentName}</td>
                      <td className="py-2 px-4">{department.departmentHead}</td>
                      <td className="py-2 px-4">{department.location}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDelete(department._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Departments;
