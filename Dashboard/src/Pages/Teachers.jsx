import { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from "../components/SideBar";
import IconSideBar from "../components/IconSideBar"; // Import IconSideBar component
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import UserAccount from '../components/UserAccount';
import { FaBars } from "react-icons/fa"; // Import the hamburger icon for sidebar toggle
import SidebarToggleButton from '../components/SidebarToggleButton';

axios.defaults.baseURL = "http://localhost:3000";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [learningareas, setLearningAreas] = useState([]);
  const [departments, setDepartments] = useState([]);
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
  const [isUpdating, setIsUpdating] = useState(false); // Track if it's update mode
  const [streams, setStreams] = useState([]);
  const navigate = useNavigate();

  const getFetchData = () => {
    setLoading(true);
    axios.get("/api/teachers")
      .then(response => {
        setTeachers(response.data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const getLeaningareaData = () => {
    setLoading(true);
    axios.get("/api/learningAreas")
      .then(response => {
        setLoading(false);
        setLearningAreas(response.data);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchStreams = () => {
    axios.get("/api/streams")
      .then(response => {
        setStreams(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchDepartments = () => {
    axios.get("/api/departments")
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
    getFetchData();
    fetchStreams();
    fetchDepartments();
    getLeaningareaData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/delete/${id}`);
      if (response.data.success === "true") {
        toast.success("Teacher has been deleted successfully");
        setTeachers((prevTeachers) => prevTeachers.filter(teacher => teacher._id !== id));
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
    if (isUpdating) {
      // Update teacher
      axios.put(`/api/teachers/${formData._id}`, formData)
        .then(response => {
          toast.success("Teacher updated successfully");
          setShowModal(false);
          getFetchData(); // Reload teachers list after updating
        })
        .catch(error => {
          toast.error(error.message || "Error occurred while updating teacher.");
        });
    } else {
      // Add new teacher
      axios.post("http://localhost:3000/api/teachers", formData)
        .then(response => {
          toast.success("Teacher added successfully");
          setShowModal(false);
          getFetchData(); // Reload teachers list after adding
        })
        .catch(error => {
          toast.error(error.message || "Error occurred while adding teacher.");
        });
    }
  };

  const handleUpdateClick = (teacher) => {
    setIsUpdating(true);
    setFormData(teacher); // Pre-fill form with teacher data
    setShowModal(true);
  };

  const handleAddClick = () => {
    setIsUpdating(false); // Switch to add mode
    setFormData({
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
    setShowModal(true);
  };
  const toggleSideBar = () => {
    setSideBar(prev => !prev); // Toggle sidebar visibility
  };

  return (
    <div className='flex'>
      <div
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}
      >
        <SideBar/> {/* Conditionally render based on sidebar state */}
      </div>
    <div className='flex bg-white flex-col w-full bg-gray-100'>
      <div className='px-6 py-4 flex gap-5 justify-between items-center bg-white shadow-md'>
      <div className='flex items-center gap-2'>
      <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          <h1 className="text-xl py-3 font-bold text-gray-800 sm:text-sm md:text-md lg:text-lg">KIBABII SCHOOL</h1>
          <p className="text-gray-500">Teachers</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or regno"
          className="w-full hidden sm:flex sm:w-2/3 md:w-1/3 px-4 py-2 mb-4 border rounded-md text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleAddClick} // Open modal on button click for adding
          className='bg-green-600 flex text-white py-2 px-4 rounded-md hover:bg-green-700 transition'
        >
          <p>+</p> <p className='hidden md:flex'>Add Teacher</p>
        </button>
        <UserAccount/>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-2/3 shadow-lg">
            <div className="py-2 text-center">
              <p className="text-lg font-semibold">{isUpdating ? 'Update Teacher' : 'Add New Teacher'}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
                {/* Input Fields */}
                {["fullname", "nationaid", "email", "phone", "salary", "tse"].map((field, index) => (
                  <div className="min-w-full" key={index}>
                    <label className="text-sm text-gray-700" htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                    <input
                      id={field}
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type={field === "salary" ? "number" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    />
                  </div>
                ))}

                {/* Gender and Date of Birth */}
                {["gender", "dob", "subjectsteaching", "type", "department"].map((field, index) => (
                  <div className="min-w-full" key={index}>
                    <label className="text-sm text-gray-700" htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                    {field === "gender" || field === "type" || field === "subjectsteaching" || field === "department" ? (
                      <select
                        id={field}
                        className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                        name={field}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      >
                        <option value="">Select {field.replace(/([A-Z])/g, ' $1')}</option>
                        {field === "gender" ? (
                          <>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </>
                        ) : field === "type" ? (
                          <>
                            <option value="Government">Government</option>
                            <option value="Bonded">Bonded</option>
                          </>
                        ) : field === "subjectsteaching" ? (
                          learningareas.map(area => (
                            <option key={area._id} value={area.name}>{area.name}</option>
                          ))
                        ) : field === "department" ? (
                          departments.map(department => (
                            <option key={department._id} value={department.departmentName}>{department.departmentName}</option>
                          ))
                        ) : null}
                      </select>
                    ) : (
                      <input
                        id={field}
                        className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                        type="date"
                        name={field}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-xl text-gray-700">Loading...</p>
        </div>
      ) : (
        <div className=" overflow-x-auto px-5  bg-white overflow-y-auto max-h-[82vh]">
          <table className="min-w-full table-auto  px-5 border  shadow-lg " >
            <thead className=" text-slate-700">
              <tr>
                {["NO", "Full Name", "TSE NO", "Salary", "Type", "Gender", "Delete", "Update"].map((header, index) => (
                  <th key={index} className="py-2 px-4 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr
                  key={teacher._id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/teacher/${teacher._id}`)}
                >
                  <td className="py-2 px-4">{teachers.length - index}</td>
                  <td className="py-2 px-4">{teacher.fullname}</td>
                  <td className="py-2 px-4">{teacher.tse}</td>
                  <td className="py-2 px-4">{`KSH. ${teacher.salary}`}</td>
                  <td className="py-2 px-4">{teacher.type}</td>
                  <td className="py-2 px-4">{teacher.gender}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(teacher._id); }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpdateClick(teacher); }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
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
    </div>
  );
};

export default Teachers;
