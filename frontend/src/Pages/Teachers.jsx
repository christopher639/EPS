import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = "https://eps-backendvtwo.onrender.com";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [learningareas, setLearningAreas] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    gender: "",
    dob: "",
    nationaid: "",
    email: "",
    phone: "",
    salary: "",
    subjectsteaching: "",
    type: "",
    tse: "",
    department: "",
  });

  const navigate = useNavigate();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [teachersRes, learningAreasRes, departmentsRes, streamsRes] = await Promise.all([
        axios.get("/api/teachers"),
        axios.get("/api/learningAreas"),
        axios.get("/api/departments"),
        axios.get("/api/streams"),
      ]);

      setTeachers(teachersRes.data.reverse());
      setLearningAreas(learningAreasRes.data);
      setDepartments(departmentsRes.data);
      setStreams(streamsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/delete/${id}`);
      if (response.data.success === "true") {
        toast.success("Teacher has been deleted successfully");
        setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher._id !== id));
      } else {
        toast.error("Failed to delete Teacher.");
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Error deleting teacher. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/teachers", formData)
      .then((response) => {
        toast.success("Teacher added successfully");
        setShowModal(false);
        fetchAllData(); // Reload data after adding
      })
      .catch((error) => {
        toast.error(error.message || "Error occurred while adding teacher.");
      });
  };

  return (
    <div className="flex flex-col min-w-full">
      <div className="px-4 flex gap-5">
        <input
          type="text"
          placeholder="Search by name or regno"
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
        <p className="text-lg font-semibold">Add New Teacher</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
          {/* Full Name */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Full Name</p>
            <input
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            />
          </div>

          {/* Gender */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Gender</p>
            <select
              className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              name="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Date of Birth</p>
            <input
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>

          {/* National ID */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">National ID</p>
            <input
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              type="text"
              name="nationaid"
              value={formData.nationaid}
              onChange={(e) => setFormData({ ...formData, nationaid: e.target.value })}
            />
          </div>
          {/*Email */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Email</p>
            <input
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Phone</p>
            <input
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Salary */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Salary</p>
            <input
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>

          {/* Subjects Teaching */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Modules Teaching</p>
            
            <select
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              name="subjectsteaching"
              value={formData.subjectsteaching}
              onChange={(e) => setFormData({ ...formData, subjectsteaching: e.target.value })}
            >
              <option value="">Select a Module</option>
              {learningareas.map((area) => (
                <option key={area._id} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          {/* Type */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">Type of Teacher</p>
            <select
              className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              name="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Government">Government</option>
              <option value="Bonded">Bonded</option>
            </select>
          </div>

          {/* TSC Number */}
          <div className="min-w-full">
            <p className="text-sm text-gray-700">TSC Number</p>
            <input
              className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              type="text"
              name="tse"
              value={formData.tse}
              onChange={(e) => setFormData({ ...formData, tse: e.target.value })}
            />
          </div>
          <div className="min-w-full">
                    <p className="text-sm text-gray-700">Department</p>
                    <select
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      name="department"
                      value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value=""></option>
                      {departments.map((department) => (
                        <option key={department._id} value={department.departmentName}>
                         {department.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md"
                    >
                      Add Teacher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">loading...</p>
        </div>
      ) : (
        <div className="mx-4 md:mx-0 grid gri-cols-1 max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0">
          <table className="min-w-full mt-2">
            <thead className="bg-slate-800 px-1 h-10 text-white">
              <tr>
                <th className="border whitespace-nowrap px-1">NO</th>
                <th className="border whitespace-nowrap px-1">Full Name</th>
                <th className="border whitespace-nowrap px-1">TSE NO</th>
                <th className="border whitespace-nowrap px-1">SALARY</th>
                <th className="border whitespace-nowrap px-1">TYPE</th>
                <th className="border whitespace-nowrap px-1">GENDER</th>
                <th className="border whitespace-nowrap px-1">DELETE</th>
                <th className="border whitespace-nowrap px-1">UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr
                  key={teacher._id}
                  className="border hover:bg-gray-200 py-1 border-slate-500 cursor-pointer"
                  onClick={() => navigate(`/teacher/${teacher._id}`)}
                >
                  <td className="border py-1 text-center">{teachers.length - index}</td>
                  <td className="border whitespace-nowrap px-4 py-1">{teacher.fullname}</td>
                  <td className="border whitespace-nowrap px-4 py-1 text-center">{teacher.tse}</td>
                  <td className="border whitespace-nowrap px-4 py-1 text-center">KSH.{teacher.salary}</td>
                  <td className="border whitespace-nowrap px-4 py-1 text-center">{teacher.type}</td>
                  <td className="border whitespace-nowrap px-4 py-1 text-center">{teacher.gender}</td>
                  <td className="border whitespace-nowrap px-4 py-1 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(teacher._id);
                      }}
                      className="text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Not working at the moment");
                      }}
                      className="text-white px-2 py-1 rounded-md bg-green-600 hover:bg-green-700"
                    >
                      Update
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

export default Teachers;
