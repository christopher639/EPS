import React, { useEffect, useState } from 'react';
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/";

const Admission = () => {
  const [streams, setStream] = useState([]);
  const [formData, setFormData] = useState({
    passport: '',
    name: '',
    dot: '',
    dob: '',
    regno: '',
    gender: '',
    previous: '',
    parentname: '',
    email: '',
    phone: '',
    stream: ''
  });

  const getFetchData = () => {
    axios.get("http://localhost:3000/api/stream")
      .then(streams => setStream(streams.data))
      .catch(err => console.log(err));
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
    try {
      await axios.post("http://localhost:3000/api/students", formData);
      console.log(formData)
      alert("Student admitted successfully");
      // Clear form data after successful submission
      setFormData({
        passport: '',
        name: '',
        dot: '',
        dob: '',
        regno: '',
        gender: '',
        previous: '',
        parentname: '',
        email: '',
        phone: '',
        stream: ''
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Failed to submit the form");
    }
  };

  return (
    <div className='max-h-[80vh] overflow-y-auto'>
      <div className='w-full bg-slate-800 text-white'>
        <p className='p-2 border text-center min-w-auto'> NEW STUDENT ADMISSION FORM </p>
      </div>

      <div className='mt-3 mx-4 md:mx-1 flex flex-col md:flex-row gap-2'>
        
      <div className='w-1/6 '>
     <p className=' pt-3 '> PASSPORT</p>
     <img src="avater.jpeg" alt="" />
    </div>
        <div className='w-full overflow-y-auto flex flex-col min-h-full md:grid px-2 grid-cols-3 gap-5'>
          <div className='min-w-full'>
            <p>STUDENT FULL NAME</p>
            <input 
              className='min-w-full py-2 outline-none border border-slate-500 px-2 rounded' 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
            />
          </div>
          <div className='min-w-full'>
            <p>DATE OF ADM</p>
            <input 
              className='min-w-full py-2 outline-none border border-slate-500 px-2 rounded' 
              type="date" 
              name="dot" 
              value={formData.dot} 
              onChange={handleChange} 
            />
          </div>
          <div className='min-w-full'>
            <p>DATE OF BIRTH</p>
            <input 
              className='py-2 min-w-full outline-none border border-slate-500 rounded' 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange} 
            />
          </div>

          <div className='min-w-full'>
            <p>ADM NO</p>
            <input 
              className='py-2 min-w-full outline-none border border-slate-500 px-2 rounded' 
              type="text" 
              name="regno" 
              value={formData.regno} 
              onChange={handleChange} 
            />
          </div>
          <div className='min-w-full'>
            <p>GENDER</p>
            <select 
              className='min-w-full py-2 border border-slate-500 rounded' 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">MALE</option>
              <option value="Female">FEMALE</option>
            </select>
          </div>
          <div className='min-w-full'>
            <p>PREVIOUS SCHOOL</p>
            <input 
              className='min-w-full py-2 outline-none border border-slate-500 rounded px-2' 
              type="text" 
              name="previous" 
              value={formData.previous} 
              onChange={handleChange} 
            />
          </div>
        </div>
      </div>

      <div className='mx-5 mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:mx-1'>
        <div className='min-w-full'>
          <p>PARENTS/GARDIAN FULL NAME</p>
          <input 
            className='py-2 min-w-full outline-none border border-slate-500 px-2 rounded' 
            type="text" 
            name="parentname" 
            value={formData.parentname} 
            onChange={handleChange} 
          />
        </div>
        <div className='min-w-full'>
          <p>EMAIL</p>
          <input 
            className='py-2 min-w-full outline-none border border-slate-500 px-2 rounded' 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
        </div>
        <div className='min-w-full'>
          <p>PARENTS/GARDIAN PHONE NUMBER</p>
          <input 
            className='py-2 min-w-full outline-none border border-slate-500 px-2 rounded' 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className='flex justify-center mt-5'>
        <div>
          <p>ASSIGN STREAM</p>
          <select 
            className='outline-none py-1 w-full border border-slate-500 rounded' 
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

      <div className='flex justify-center mt-4'>
        <button 
          onClick={handleSubmit} 
          className='py-2 bg-slate-800 text-white shadow-lg min-w-1/2 px-10 rounded'
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Admission;