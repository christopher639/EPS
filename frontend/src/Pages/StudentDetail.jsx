import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

axios.defaults.baseURL = "https://eps-backend.onrender.com";

const StudentDetail = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`https://eps-backend.onrender.com/api/students/${id}`);
        setStudent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  if (loading) {
    return <div className='flex  mx-32 justify-center'><div>Loading...</div></div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
   <div>
       <div className='flex justify-center mx-4 mt-4'>
       <div className='flex w-full justify-between'>
       <div className='flex  gap-2'>
         
         <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
           Print
         </button>
       </div>
       <div>
         <button
           onClick={() => setUserForm(true)}
           className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
         >
           Message
         </button>
       </div>
       </div>
      </div>

     <div className="p-4 flex flex-col  flex max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto justify-center">
     <div>
        <img className='w-24 object-cover rounded-full mx-auto' src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" />

    </div>
     <div  className='flex gap-1 md:gap-5 justify-center'>
       <div className='grid  grid-cols-1 md:grid-cols-2 gap-5'>
      <p><strong>Full Name:</strong><span className='text-yellow-800' > {student.name.toUpperCase()}</span></p>
      <p><strong>ADM:</strong> <span className='text-yellow-800'>{student.regno.toUpperCase()}</span></p>
      <p><strong>Gender:</strong><span className='text-yellow-800'> {student.gender.toUpperCase()}</span></p>
      <p ><strong>DOA:</strong><span className='text-yellow-800'>  {new Date(student.dot).toLocaleDateString('en-GB')}</span></p>
      <p><strong>Stream:</strong><span className='text-yellow-800'> {student.stream.toUpperCase()}</span></p>
      <p><strong>P/G Name:</strong> <span className='text-yellow-800'>{student.parentname.toUpperCase()}</span></p>
      <p><strong>P/G Phone:</strong><span  className='text-yellow-800'> +254{student.phone}</span></p>
      <p><strong>P/G Email:</strong><span  className='text-yellow-800'> {student.email}</span></p>
      <p><strong>Previous School:</strong> <span  className='text-yellow-800'>{student.previous.toUpperCase()}</span></p>

      {/* Add more fields as necessary */}
       </div>
     </div>
    </div>
   </div>
  );
};

export default StudentDetail;
