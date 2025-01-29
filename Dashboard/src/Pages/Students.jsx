import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import UserAccount from '../components/UserAccount';
import SidebarToggleButton from '../components/SidebarToggleButton';
import SideBar from '../components/SideBar';

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
  const [currentStep, setCurrentStep] = useState(1); // Step tracking
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

    const formDataToSend = new FormData();
    for (let key in formData) {
      if (key === 'photo' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      if (isEditing) {
        const response = await axios.put(`/api/students/${currentStudentId}`, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.success) {
          toast.success("Student updated successfully");
          setShowModal(false);
          getFetchData();
        }
      } else {
        const response = await axios.post("/api/students", formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.success) {
          toast.success("Student added successfully");
          setShowModal(false);
          getFetchData();
        }
      }
    } catch (error) {
      toast.error("Error saving student");
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
    setCurrentStep(1); // Reset to the first step
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

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
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
            <h1 className=" text-sm md:text-xl font-bold text-gray-800">KIBABII SCHOOL</h1>
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
             <p>+</p>
             <p className='hidden md:flex'> New</p>
            </button>
          </div>
          <UserAccount />
        </div>

      {/* Multi-Step Modal */}
{showModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-5/6">
      <div className='flex justify-between items-center'>
        <p className='text-lg font-semibold'>{isEditing ? "Edit Student" : "Add New Student"}</p>
        <button
          type="button"
          onClick={() => { setShowModal(false); resetFormData(); }}
          className='bg-gray-500 text-white py-1 px-3 rounded-full'
        >
          X
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="step-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1: Photo */}
            <p className="text-sm text-gray-700 mb-2">PASSPORT</p>
            {formData.photo && (
              <img
                src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : formData.photo}
                alt="Passport Preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
            )}
            <input
              className="block w-full mt-2"
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFormData({ ...formData, photo: e.target.files[0] });
                }
              }}
            />
            <div className="step-2">
            {/* Step 2: Name and Gender */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              placeholder="Gender"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
          <div className="step-3">
            {/* Step 3: Date of Birth and Nationality */}
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              placeholder="Date of Birth"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              placeholder="Nationality"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
          <div className="step-4">
            {/* Step 4: Phone Number and Address */}
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
          <div className="step-5">
            {/* Step 5: Admission Date and Stream */}
            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
              placeholder="Admission Date"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <select
              name="stream"
              value={formData.stream}
              onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream._id} value={stream.name}>
                  {stream.name}
                </option>
              ))}
            </select>
          </div>
          </div>
        )}

        {currentStep === 2 && (
           <div className="step-6 grid grid-cols-2 md:grid-cols-3 gap-3 ">
           {/* Step 6: Guardian Info and Medical History */}
           <input
             type="text"
             name="guardianName"
             value={formData.guardianName}
             onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
             placeholder="Guardian Name"
             className="w-full p-2 border border-gray-300 rounded mb-4"
           />
           <input
             type="text"
             name="guardianRelationship"
             value={formData.guardianRelationship}
             onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
             placeholder="Guardian Relationship"
             className="w-full p-2 border border-gray-300 rounded mb-4"
           />
           <textarea
             name="medicalHistory"
             value={formData.medicalHistory}
             onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
             placeholder="Medical History"
             className="w-full p-2 border border-gray-300 rounded mb-4"
           />
             <div className="step-7">
            {/* Step 7: Fee Status and Scholarships */}
            <select
              name="feeStatus"
              value={formData.feeStatus}
              onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
            <input
              type="text"
              name="scholarships"
              value={formData.scholarships.join(", ")}
              onChange={(e) => setFormData({ ...formData, scholarships: e.target.value.split(", ") })}
              placeholder="Scholarships"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
          <div className="step-3">
            {/* Step 3: Date of Birth and Nationality */}
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              placeholder="Date of Birth"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              placeholder="Nationality"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
         </div>
        )}
        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Previous
            </button>
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500  text-white py-2 px-4 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md"
            >
              {isEditing ? "Update Student" : "Add Student"}
            </button>
          )}
        </div>
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
          <div className=' md:mx-0 grid gri-cols-1 max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto md:mr-0'>
            <table >
              <thead className='bg-slate-800 px-1 h-10 text-slate-700'>
                <tr>
                  <th className='border whitespace-nowrap px-1'>NO</th>
                  <th className='border whitespace-nowrap px-1'>Full Name</th>
                  <th className='border whitespace-nowrap px-1'>ADM</th>
                  <th className='border whitespace-nowrap px-1'>GENDER</th>
                  <th className='border whitespace-nowrap px-1'>DATE OF ADM</th>
                  <th className='border whitespace-nowrap px-1'>STREAM</th>
                  <th className='border whitespace-nowrap px-1'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student._id} className='h-10'>
                    <td className='border px-1'>{index + 1}</td>
                    <td className='border px-1'>{student.name}</td>
                    <td className='border px-1'>{student.regno}</td>
                    <td className='border px-1'>{student.gender}</td>
                    <td className='border px-1'>{formatDate(student.admissionDate)}</td>
                    <td className='border px-1'>{student.stream}</td>
                    <td className='border px-1'>
                      <button
                        onClick={() => handleUpdateClick(student)}
                        className='bg-blue-600 text-white p-1 rounded mr-2'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className='bg-red-600 text-white p-1 rounded'
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
