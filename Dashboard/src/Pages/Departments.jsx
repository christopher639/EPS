import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import UserAccount from "../components/UserAccount";

axios.defaults.baseURL = "http://localhost:3000";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div className="flex flex-col min-w-full p-4 bg-gray-50">
      {/* Search and Add Department Button */}
      <div className="flex justify-between gap-4 mb-6 items-center">
        <p>Depertments</p>
        <input
          type="text"
          placeholder="Search by name or code"
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 flex text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none"
        >
          <p>+</p> <p className="hidden md:flex">Add Department</p>
        
        </button>
        <UserAccount/>
      </div>

      {/* Modal for Adding New Department */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg  w-full md:w-2/3 shadow-lg">
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
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Email</p>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Phone</p>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Department Head</p>
                  <select
                    name="departmentHead"
                    value={formData.departmentHead}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Head</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.fullname}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium">Number of Staff</p>
                  <input
                    type="number"
                    name="numberOfStaff"
                    value={formData.numberOfStaff}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Established Year</p>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
  );
};

export default Departments;
