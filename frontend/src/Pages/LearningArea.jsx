import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = "https://eps-backendvtwo.onrender.com";

const LearningArea = () => {
  const [learningareas, setLearningAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({
    subjectCode: "",
    name: "",
    description: "",
    level: "",
    department: "",
    teacher: "",
    assessmentType: "",
    status: "",
    languageOfInstruction: "",
  });

  const [streams, setStreams] = useState([]); // Stream options for dropdown
  const navigate = useNavigate();

  const getFetchData = () => {
    setLoading(true);
    axios.get("https://eps-backendvtwo.onrender.com/api/learningAreas")
      .then(response => {
        setLoading(false);
        setLearningAreas(response.data);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  
  const getFetchDataTeachers = () => {
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
  const fetchDepartments = () => {
    //  setLoading(true);
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
  
  const fetchStreams = () => {
    axios.get("https://eps-backendvtwo.onrender.com/api/stream")
      .then(response => {
        setStreams(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getFetchData();
    fetchStreams();
    fetchDepartments();
    getFetchDataTeachers()
  }, []);




  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/delete/${id}`);
      if (response.data.success === "true") {
        toast.success("Learning area has been deleted successfully");
        setLearningAreas(prevLearningAreas => prevLearningAreas.filter(learningarea => learningarea._id !== id));
      } else {
        toast.error("Failed to delete learning area.");
      }
    } catch (error) {
      console.error("Error deleting learning area:", error);
      toast.error("Error deleting learning area. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add simple form validation
    if (!formData.subjectCode || !formData.name || !formData.description) {
      toast.error("Subject Code, Name, and Description are required fields.");
      return;
    }

    console.log("Form Data to be submitted:", formData);

    axios.post("/api/learningAreas", formData)
      .then(response => {
        toast.success("New learning area added successfully");
        setShowModal(false); // Close modal after successful submission
        getFetchData(); // Reload learning area data
      })
      .catch(error => {
        toast.error("Error adding learning area");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex px-1 flex-col min-w-full">
      <div className=" flex gap-5">
        <input
          type="text"
          placeholder="Search by name or regno"
          className="w-full px-3 py-2 mb-4 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <button
            onClick={() => setShowModal(true)} // Open modal on button click
            className="bg-green-600 p-2 rounded text-white"
          >
            New
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-2/3">
            <div className="py-1">
              <p className="text-lg font-semibold">Add New Learning Area</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="pt-2 flex flex-col md:flex-row gap-6">
                <div className="w-full flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
                  {/* Subject Code */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Subject Code</p>
                    <input
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="subjectCode"
                      value={formData.subjectCode}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Subject Name */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Subject Name</p>
                    <input
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Description */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Description</p>
                    <input
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Level */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Level</p>
                    <input
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Department */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Department</p>
                    <select
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value=""></option>
                      {departments.map((department) => (
                        <option key={department._id} value={department.name}>
                         {department.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Teacher ID */}
                  <div>
                    <p>Instructor</p>
                    <div className="relative">
                      <select
                        className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                        name="departmentHead"
                        value={formData.teacher}
                        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >
                        <option value=""></option>
                        {teachers.map((teacher) => (
                          <option
                            key={teacher.fullname}
                            value={teacher.fullname}
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

                  {/* Schedule */}
                 

                  {/* Number of Students */}
                 
                  {/* Maximum Capacity */}
                

                  {/* Assessment Type */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Assessment Type</p>
                    <input
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="assessmentType"
                      value={formData.assessmentType}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Resources */}
                 

                  {/* Grade Weighting */}
                 

                  {/* Status */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Status</p>
                    <input
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Language of Instruction */}
                  <div className="min-w-full">
                    <p className="text-sm text-gray-700">Language of Instruction</p>
                    <input
                      className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="languageOfInstruction"
                      value={formData.languageOfInstruction}
                      onChange={handleChange}
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

      {/* Learning Areas Table */}
      <div className='mx-4 md:mx-0 grid gri-cols-1 max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
        <table className="min-w-full bg-white shadow-md">
          <thead>
            <tr className="border-b-2">
            <th className="py-2 px-4 text-left">No</th>
              <th className="py-2 px-4 text-left">Subject Code</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-left">Instuctor</th>
              <th className="py-2 px-4 text-left">Delete</th>
              <th className="py-2 px-4 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {learningareas
              .filter((learningarea) =>
                learningarea.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((learningarea,index) => (
                <tr className='border border-b hover:bg-slate-100 courser-pointer' key={learningarea._id}>
                    <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{learningarea.subjectCode}</td>
                  <td className="py-2 px-4">{learningarea.name}</td>
                  <td className="py-2 px-4">{learningarea.department}</td>
                  <td className="py-2 px-4">{learningarea.teacher}</td>
                
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(learningarea._id)}
                      className="bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <button
                   
                      className="bg-green-600 text-white py-1 px-3 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default LearningArea;



