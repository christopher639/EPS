import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = "https://eps-backendvtwo.onrender.com";

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

  const getFetchData = () => {
    setLoading(true);
    axios.get("https://eps-backendvtwo.onrender.com/api/teachers")
      .then(response => {
        setTeachers(response.data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };


  const navigate = useNavigate();

  const fetchDepartments = () => {
  //  setLoading(true);
    axios
      .get("https://eps-backendvtwo.onrender.com/api/departments")
      .then((response) => {
        setDepartments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartments();
    getFetchData(); // Fetch teachers here
  }, []);

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

    // Validate required fields
    if (!formData.departmentCode || !formData.departmentName) {
      toast.error("Department Code and Name are required fields.");
      return;
    }

    console.log("Form Data to be submitted:", formData);

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

  return (
    <div className="flex px-1 flex-col min-w-full">
      <div className="flex gap-5">
        <input
          type="text"
          placeholder="Search by name or code"
          className="w-full px-3 py-2 mb-4 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 p-2 rounded text-white"
          >
            New
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-2/3">
            <div className="py-1">
              <p className="text-lg font-semibold">Add New Department</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="pt-2 flex flex-col md:flex-row gap-6">
                <div className="w-full flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p>Department Code</p>
                    <input
                      type="text"
                      name="departmentCode"
                      value={formData.departmentCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <p>Department Name</p>
                    <input
                      type="text"
                      name="departmentName"
                      value={formData.departmentName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <p>Location</p>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <p>Contact Email</p>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <p>Contact Phone</p>
                    <input
                      type="text"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <p>Department Head</p>
                    <div className="relative">
                      <select
                        className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                        name="departmentHead"
                        value={formData.departmentHead}
                        onChange={(e) => setFormData({ ...formData, departmentHead: e.target.value })}
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >
                        <option value=""></option>
                        {teachers.map((teacher) => (
                          <option
                            key={teacher._id}
                            value={teacher._id}
                            className="border-b border-gray-300 last:border-b-0"
                            style={{
                              borderBottom: "1px solid #d1d5db", // Tailwind gray-300
                            }}
                          >
                            {teacher.fullname}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <p>Number Of Stuff</p>
                    <input
                      type="number"
                      name="numberOfStaff"
                      value={formData.numberOfStaff}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <p>Established Year</p>
                    <input
                      type="number"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <p>Budget</p>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

<div className='mx-4 md:mx-0 grid gri-cols-1 max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
      <div className="w-full">
      <table className="min-w-full bg-white shadow-md">
          <thead>
            <tr className="border-b-2">
              <th className="py-2 px-4">No</th>
              <th className="py-2 px-4 text-start">Code</th>
              <th className="py-2 px-4 text-start">Department Name</th>
              <th className="py-2 px-4 text-start">Chair</th>
              <th className="py-2 px-4 text-start">Location</th>
              <th className="py-2 px-4">Delete</th>
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
                <tr key={department._id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{department.departmentCode}</td>
                  <td className="py-2 px-4">{department.departmentName}</td>
                  <td className="py-2 px-4">{department.departmentHead}</td>
                  <td className="py-2 px-4">{department.location}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(department._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
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

      <ToastContainer />
    </div>
  );
};

export default Departments;
