import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import UserAccount from '../components/UserAccount';

axios.defaults.baseURL = "http://localhost:3000";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
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
    axios.get("/api/stream")
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
      console.error("Error deleting student:", error);
      toast.error("Error deleting student. Please try again.");
    }
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update student
        const response = await axios.put(`/api/students/${currentStudentId}`, formData);
        if (response.data.success) {
          toast.success("Student updated successfully");
          setShowModal(false);
          getFetchData();
        }
      } else {
        // Add new student
        const response = await axios.post("/api/students", formData);
        if (response.data.success) {
          toast.success("Student added successfully");
          setShowModal(false);
          getFetchData();
        }
      }
    } catch (error) {
      toast.error("Error saving student");
      console.error(error);
    }
  };

  // Handle update button click
  const handleUpdateClick = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student._id);
    setFormData({
      name: student.name,
      dob: student.dateOfBirth,
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
      dob: "",
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

  return (
    <div className='flex flex-col min-w-full'>
      <div className='px-4 mt-5 flex gap-5'>
        <input
          type="text"
          placeholder="Search by name or regno"
          className="w-full px-3 py-2 mb-4 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <button
            onClick={() => { setShowModal(true); resetFormData(); }}
            className='bg-green-600 p-2 rounded text-white'
          >
            New
          </button>
        </div>
        <UserAccount />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-5/6">
            <div className='py-1'>
              <p className='text-lg font-semibold'>{isEditing ? "Edit Student" : "Add New Student"}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='pt-2 flex flex-col md:flex-row gap-6'>
              <div className='w-20 h-20 relative'>
  <p className='text-sm text-gray-700 mb-2'>PASSPORT</p>
  {/* Image Preview */}
  {formData.photo && (
    <img
      src={URL.createObjectURL(formData.photo)} // Display the selected image
      alt="Passport Preview"
      className='w-20 h-20 rounded-full object-cover border border-gray-300'
    />
  )}
  {/* File Input */}
  <input
    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
    type="file"
    name="photo"
    accept="image/*" // Restrict to image files
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setFormData({ ...formData, photo: e.target.files[0] });
      }
    }}
  />
  {/* Placeholder if no image is selected */}
  {!formData.photo && (
    <div className='w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500'>
      <span>+</span>
    </div>
  )}
</div>

                <div className='w-full flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3'>
                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>STUDENT NAME</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>ADMISSION DATE</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>DATE OF BIRTH</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>ADM NUMBER</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="text"
                      name="regno"
                      value={formData.regno}
                      onChange={(e) => setFormData({ ...formData, regno: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>GENDER</p>
                    <select
                      className='w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      name="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>NATIONALITY</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>PHONE NUMBER</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>ADDRESS</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>GUARDIAN NAME</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    />
                  </div>

                  <div className='min-w-full'>
                    <p className='text-sm text-gray-700'>GUARDIAN RELATIONSHIP</p>
                    <input
                      className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                      type="text"
                      name="guardianRelationship"
                      value={formData.guardianRelationship}
                      onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className='mt-4 lg:grid gap-5 grid-cols-2'>
                <div className='min-w-full'>
                  <p className='text-sm text-gray-700'>MEDICAL HISTORY</p>
                  <input
                    className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                    type="text"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  />
                </div>

                <div className='min-w-full'>
                  <p className='text-sm text-gray-700'>FEE STATUS</p>
                  <select
                    className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                    name="feeStatus"
                    value={formData.feeStatus}
                    onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className='min-w-full'>
                  <p className='text-sm text-gray-700'>SCHOLARSHIPS</p>
                  <input
                    className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                    type="text"
                    name="scholarships"
                    value={formData.scholarships.join(",")}
                    onChange={(e) => setFormData({ ...formData, scholarships: e.target.value.split(",") })}
                    placeholder="Enter scholarships separated by commas"
                  />
                </div>

                <div className='min-w-full'>
                  <p className='text-sm text-gray-700'>STREAM</p>
                  <select
                    className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
                    name="stream"
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  >
                    <option value="">Select Stream</option>
                    {streams.map((stream, index) => (
                      <option key={index} value={stream.name}>{stream.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='mt-6 flex justify-end'>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetFormData(); }}
                  className='bg-gray-500 text-white py-2 px-4 rounded-md mr-2'
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className='bg-green-600 text-white py-2 px-4 rounded-md'
                >
                  {isEditing ? "Update Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className='mx-4 md:mx-0 grid gri-cols-1 max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
          <table className='min-w-full mt-2'>
            <thead className='bg-slate-800 px-1 h-10 text-slate-700'>
              <tr>
                <th className='border whitespace-nowrap px-1'>NO</th>
                <th className='border whitespace-nowrap px-1'>Full Name</th>
                <th className='border whitespace-nowrap px-1'>ADM</th>
                <th className='border whitespace-nowrap px-1'>GENDER</th>
                <th className='border whitespace-nowrap px-1'>DATE OF ADM</th>
                <th className='border whitespace-nowrap px-1'>STREAM</th>
                <th className='border whitespace-nowrap px-1'>DELETE</th>
                <th className='border whitespace-nowrap px-1'>UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className='border hover:bg-gray-200 py-1 border-slate-500 cursor-pointer'
                  onClick={() => navigate(`/student/${student._id}`)}
                >
                  <td className='border py-1 text-center'>{filteredStudents.length - index}</td>
                  <td className='border whitespace-nowrap px-4 py-1'>{student.name}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.regno}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.gender}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{formatDate(student.admissionDate)}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.stream.toUpperCase()}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(student._id); }}
                      className='text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                      </svg>
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpdateClick(student); }}
                      className='text-white px-2 py-1 rounded-md bg-green-600 hover:bg-green-700'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                        <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                      </svg>
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

export default Students;