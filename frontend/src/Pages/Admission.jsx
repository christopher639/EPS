import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

axios.defaults.baseURL = "https://eps-backend.onrender.com";

const Admission = () => {
  const [streams, setStream] = useState([]);
  const [formData, setFormData] = useState({
    passport: '',
    name: '',
    dot: '',
    dob: '',
    regno: '', // Now editable by the user
    gender: '',
    previous: '',
    parentname: '',
    email: '',
    phone: '',
    stream: ''
  });

  // Fetch streams from the backend
  const getFetchData = () => {
    axios.get("/api/stream")
      .then(response => setStream(response.data))
      .catch(err => console.error("Failed to fetch streams:", err));
  };

  useEffect(() => {
    getFetchData();
  }, []);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate regno is not empty
    if (!formData.regno) {
      toast.error("Admission number (regno) is required.");
      return;
    }

    try {
      const response = await axios.post("/api/students", formData);

      if (response.data.success) {
        toast.success(response.data.message || "Student admitted successfully");

        // Reset the form for the next entry
        setFormData({
          passport: '',
          name: '',
          dot: '',
          dob: '',
          regno: '',  // Keep regno empty for the next entry
          gender: '',
          previous: '',
          parentname: '',
          email: '',
          phone: '',
          stream: ''
        });
      } else {
        toast.error(response.data.message || "Failed to admit student");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Failed to submit the form");
    }
  };

  return (
    <div className='max-h-[75vh] md:max-h-[80vh] overflow-y-auto mx-5 overflow-x-hidden bg-gray-100'>
   <div className='  bg-slate-800 text-white py-2 text-center'>
        <p className='text-xl  font-semibold'>NEW STUDENT ADMISSION FORM</p>
      </div>
      <div className='mt-4 md:mx-8 flex flex-col md:flex-row gap-6'>
        
        <div className='md:w-1/3'>
          <p className='text-sm text-gray-700 mb-2'>PASSPORT</p>
          <img className='w-24 h-24 object-cover rounded-full mx-auto' src="avater.jpeg" alt="Avatar" />
        </div>

        <div className='w-full flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
          <div className='min-w-full'>
            <p className='text-sm text-gray-700'>STUDENT NAME</p>
            <input
              className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className='min-w-full'>
            <p className='text-sm text-gray-700'>DATE OF ADMISSION</p>
            <input
              className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
              type="date"
              name="dot"
              value={formData.dot}
              onChange={handleChange}
            />
          </div>

          <div className='min-w-full'>
            <p className='text-sm text-gray-700'>DATE OF BIRTH</p>
            <input
              className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className='min-w-full'>
            <p className='text-sm text-gray-700'>ADM NUMBER</p>
            <input
              className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
              type="text"
              name="regno"
              value={formData.regno}
              onChange={handleChange}  // Let user input regno
            />
          </div>

          <div className='min-w-full'>
            <p className='text-sm text-gray-700'>GENDER</p>
            <select
              className='w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className='min-w-full'>
            <p className='text-sm text-gray-700'>PREVIOUS SCHOOL</p>
            <input
              className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
              type="text"
              name="previous"
              value={formData.previous}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className=' mt-4'>
        <div className='min-w-full'>
          <p className='text-sm text-gray-700'>PARENT/GUARDIAN FULL NAME</p>
          <input
            className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
            type="text"
            name="parentname"
            value={formData.parentname}
            onChange={handleChange}
          />
        </div>

        <div className='min-w-full mt-4'>
          <p className='text-sm text-gray-700'>EMAIL</p>
          <input
            className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className='min-w-full mt-4'>
          <p className='text-sm text-gray-700'>PARENT/GUARDIAN PHONE NUMBER</p>
          <input
            className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className=' mt-6'>
        <div>
          <p className='text-sm text-gray-700'>ASSIGN STREAM</p>
          <select
            className='w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500'
            name="stream"
            value={formData.stream}
            onChange={handleChange}
          >
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option key={stream._id} value={stream.name}>{stream.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex justify-center mt-6'>
        <button
          onClick={handleSubmit}
          className='py-3 px-12 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Admission;
