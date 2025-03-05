import { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from "../components/SideBar";
import IconSideBar from "../components/IconSideBar"; // Import IconSideBar component
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import UserAccount from '../components/UserAccount';
import { FaBars, FaPlus } from "react-icons/fa"; // Import the hamburger icon for sidebar toggle
import SidebarToggleButton from '../components/SidebarToggleButton';
import BASE_URL from '../config';
import MobileNav from '../components/MobileNav';
axios.defaults.baseURL = BASE_URL;

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
    axios.get("http://localhost:3000/api/teachers")
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
    axios.get("http://localhost:3000/api/learning-reas")
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
    axios.get("http://localhost:3000/api/streams")
      .then(response => {
        setStreams(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchDepartments = () => {
    axios.get("http://localhost:3000/api/departments")
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
      const response = await axios.delete(`http://localhost:3000/api/delete/${id}`);
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
      axios.put(`http://localhost:3000/api/teachers/${formData._id}`, formData)
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
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}
      >
        <SideBar/> {/* Conditionally render based on sidebar state */}
      </div>
    <div className='flex bg-white flex-col w-full bg-gray-100'>
      <div className='px-2 py-2 flex gap-5 justify-between items-center bg-white '>
      <div className='flex items-center gap-2'>
        <MobileNav/>
   <div className='hidden md:flex'>
   <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
   </div>
          <h1 className="text-sm py-3 hidden md:flex font-bold text-gray-800 md:text-md lg:text-lg ">SAMGE SCHOOL</h1>
          <p className="text-gray-500 hidden  md:flex">Teachers</p>
        </div>
        <input
          type="text"
          placeholder="Search "
          className="w-full hidden  px-4 py-2 mb-4 border rounded-md text-gray-700  focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleAddClick} // Open modal on button click for adding
          className='bg-green-600 flex text-white py-2 px-4 rounded-md hover:bg-green-700 transition'
        >
          <p><FaPlus/></p> <p className='hidden md:flex'>Add Teacher</p>
        </button>
        <UserAccount/>
      </div>
     <div className='flex gap-2'>
     <h1 className="text-sm py-3 md:hidden px-2 font-bold text-gray-800 md:text-md lg:text-lg ">SAMGE SCHOOL</h1>
     <p className='text-sm py-3 md:hidden'>Teachers</p>
     </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-2/3">
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
        <div className='p-3 grid grid-cols-1 pb-4 max-h-[92vh] overflow-y-auto  w-full overflow-x-auto'>
          <table className="w-full table-auto  px-2 border   " >
            <thead className=" text-slate-700">
              <tr>
                {["NO", "Full Name", "TSEE NO",  "Type", "Gender", "Delete", "Update"].map((header, index) => (
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
