import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import UserAccount from '../components/UserAccount';
import SidebarToggleButton from '../components/SidebarToggleButton';
import SideBar from '../components/SideBar';
import { FaPlus, FaTimes } from 'react-icons/fa';

axios.defaults.baseURL = "http://localhost:3000";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    dateOfBirth: "",
    regno: "",
    email: "",
    gender: "",
    nationality: "",
    phoneNumber: "",
    address: "",
    admissionDate: "",
    stream: "",
    guardianName: "",
    guardianRelationship: "",
    medicalHistory: "",
    feeStatus: "Pending",
    scholarships: [],
  });
  const [streams, setStreams] = useState([]);
  const navigate = useNavigate();

  // Fetch all students
  const getFetchData = () => {
    setLoading(true);
    axios.get("/api/students")
      .then(response => {
        setStudents(response.data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  // Fetch streams for dropdown
  const fetchStreams = () => {
    axios.get("/api/streams")
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
  }, []);

  // Handle delete student
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/students/${id}`);
      if (response.data.success) {
        toast.success("Student has been deleted successfully");
        setStudents((prevStudents) => prevStudents.filter(student => student._id !== id));
      } else {
        toast.error("Failed to delete student.");
      }
    } catch (error) {
      toast.error("Error deleting student. Please try again.");
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const payload = { ...formData };

    try {
      let response;

      if (isEditing) {
        // If editing, perform an update (PUT request)
        if (formData.photo) {
          const formDataToSend = new FormData();
          for (let key in payload) {
            if (key === 'photo' && formData[key]) {
              formDataToSend.append(key, formData[key]); // Append the photo file
            } else {
              formDataToSend.append(key, payload[key]); // Append other fields
            }
          }

          response = await axios.put(`/api/students/${currentStudentId}`, formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          response = await axios.put(`/api/students/${currentStudentId}`, payload, {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (response.data.success) {
          toast.success("Student updated successfully");
          setShowModal(false);
          getFetchData(); // Reload the student data after update
        }
      } else {
        // If adding a new student, perform a POST request
        if (formData.photo) {
          const formDataToSend = new FormData();
          for (let key in payload) {
            if (key === 'photo' && formData[key]) {
              formDataToSend.append(key, formData[key]); // Append the photo file
            } else {
              formDataToSend.append(key, payload[key]); // Append other fields
            }
          }

          response = await axios.post("/api/students", formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          response = await axios.post("/api/students", payload, {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (response.data.success) {
          toast.success("Student added successfully");
          setShowModal(false);
          getFetchData(); // Reload the student data after adding
        }
      }
    } catch (error) {
      console.error("Error saving student:", error.response?.data || error.message);
      toast.error("Error saving student. Please check the console for details.");
    }
  };

  // Handle update button click
  const handleUpdateClick = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student._id);
    setFormData({
      name: student.name,
      photo: student.photo,
      dateOfBirth: student.dateOfBirth,
      regno: student.regno,
      gender: student.gender,
      nationality: student.nationality,
      phoneNumber: student.phoneNumber,
      address: student.address,
      email: student.email,
      admissionDate: student.admissionDate,
      stream: student.stream,
      guardianName: student.guardianName,
      guardianRelationship: student.guardianRelationship,
      medicalHistory: student.medicalHistory,
      feeStatus: student.feeStatus,
      scholarships: student.scholarships,
    });
    setShowModal(true);
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      photo: "",
      dateOfBirth: "",
      regno: "",
      gender: "",
      email: "",
      nationality: "",
      phoneNumber: "",
      address: "",
      admissionDate: "",
      stream: "",
      guardianName: "",
      guardianRelationship: "",
      medicalHistory: "",
      feeStatus: "Pending",
      scholarships: [],
    });
    setIsEditing(false);
    setCurrentStudentId(null);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.regno.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const toggleSideBar = () => {
    setSideBar(prev => !prev); // Toggle sidebar visibility
  };
  return (
    <div className='flex '>
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-72' : 'w-16'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>
      <div className='flex bg-white w-full flex-col  bg-gray-100'>
        <div className='px-6 py-2 flex gap-5 justify-between items-center bg-white shadow-md'> 
          <div className='flex items-center gap-3'>
            <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
            <h1 className=" text-sm md:text-xl font-bold text-gray-800">SAMGE SCHOOL</h1>
            <p className="text-gray-500 hidden md:flex">Student</p>
          </div>
          <input
            type="text"
            placeholder="Search by name or regno"
            className=" px-3 hidden md:flex py-2 mb-4 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div>
            <button
              onClick={() => { setShowModal(true); resetFormData(); }}
              className='bg-green-600 flex  p-2 rounded-full text-white'
            >
              <p><FaPlus/> </p>
            </button>
          </div>
          <UserAccount />
        </div>

        {/* Multi-Step Modal */}
        {showModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-5/6 border border-gray-300 shadow-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
        <p className="text-lg font-semibold text-gray-800">
          {isEditing ? "Edit Student" : "Add New Student"}
        </p>
        <button
          type="button"
          onClick={() => { setShowModal(false); resetFormData(); }}
          className="bg-blue-500 text-white py-1 px-3 rounded-full hover:bg-blue-600 transition duration-300"
        >
          <FaTimes />
        </button>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="max-w-32">
              <div className="flex flex-col gap-2">
                {/* Image Preview */}
                {formData.photo && (
                  <img
                    src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : formData.photo}
                    alt="Passport Preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                  />
                )}
                {/* File Input */}
                <label className="cursor-pointer max-w-24 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition duration-300 text-center">
                  <span>{formData.photo ? "Change" : "Upload"}</span>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, photo: e.target.files[0] });
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="regno"
                  value={formData.regno}
                  onChange={(e) => setFormData({ ...formData, regno: e.target.value })}
                  placeholder="Reg No"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  placeholder="Gender"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  placeholder="Date of Birth"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="Nationality"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Phone Number"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Address"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                placeholder="Admission Date"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <select
                name="stream"
                value={formData.stream}
                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <option value="">Select Stream</option>
                {streams.map((stream) => (
                  <option key={stream._id} value={stream.name}>
                    {stream.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Guardian Name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <input
                type="text"
                name="guardianRelationship"
                value={formData.guardianRelationship}
                onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                placeholder="Guardian Relationship"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div>
              <select
                name="feeStatus"
                value={formData.feeStatus}
                onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                name="scholarships"
                value={formData.scholarships.join(", ")}
                onChange={(e) => setFormData({ ...formData, scholarships: e.target.value.split(", ") })}
                placeholder="Scholarships"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div className="col-span-1/2">
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                placeholder="Medical History"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
        >
          {isEditing ? "Update Student" : "Add Student"}
        </button>
      </form>
    </div>
  </div>
)}


        {/* Student Table and other content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg font-semibold text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="md:mx-0 grid gri-cols-1 pb-6 max-h-[72vh] md:max-h-[88vh] overflow-y-auto overflow-x-auto md:mr-0">
            <table>
              <thead className="bg-slate-800 px-1 h-10 text-slate-700">
                <tr>
                  <th className="border whitespace-nowrap px-1">NO</th>
                  <th className="border whitespace-nowrap px-1">Full Name</th>
                  <th className="border whitespace-nowrap px-1">ADM</th>
                  <th className="border whitespace-nowrap px-1">GENDER</th>
                  <th className="border whitespace-nowrap px-1">DATE OF ADM</th>
                  <th className="border whitespace-nowrap px-1">STREAM</th>
                  <th className="border whitespace-nowrap px-1">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student._id}
                    className="h-10 cursor-pointer hover:bg-gray-200"
                    onClick={() => navigate(`/student/${student._id}`)} // Navigate on row click
                  >
                    <td className="border px-1">{index + 1}</td>
                    <td className="border px-1">{student.name}</td>
                    <td className="border px-1">{student.regno}</td>
                    <td className="border px-1">{student.gender}</td>
                    <td className="border px-1">{formatDate(student.admissionDate)}</td>
                    <td className="border px-1">{student.stream}</td>
                    <td className="border px-1 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click when clicking the button
                          handleUpdateClick(student);
                        }}
                        className="bg-blue-600 text-white p-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click when clicking the button
                          handleDelete(student._id);
                        }}
                        className="bg-red-600 text-white p-1 rounded"
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

export default Students;