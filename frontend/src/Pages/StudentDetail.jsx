import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

axios.defaults.baseURL = "https://eps-backendt.onrender.com";

const StudentDetail = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`https://eps-backendt.onrender.com/api/students/${id}`);
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
    return <div>Loading...</div>;
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
     <div className="p-4 flex  mt-10 justify-center">
     <div>
       <div className='grid grid-cols-2 gap-5'>
        <div>
        <img className='w-24 object-cover rounded-full mx-auto' src="avater.jpeg" alt="Avatar" />
        </div>
      <p><strong>Full Name:</strong> {student.name}</p>
      <p><strong>ADM:</strong> {student.regno}</p>
      <p><strong>Gender:</strong> {student.gender}</p>
      <p><strong>DOA:</strong> {new Date(student.dot).toLocaleDateString('en-GB')}</p>
      <p><strong>Stream:</strong> {student.stream}</p>
      <p><strong>P/G Name:</strong> {student.parentname}</p>
      <p><strong>P/G Phone:</strong> {student.phone}</p>
      <p><strong>P/G Email:</strong> {student.email}</p>
      <p><strong>Previous School:</strong> {student.previous}</p>

      {/* Add more fields as necessary */}
       </div>
     </div>
    </div>
   </div>
  );
};

export default StudentDetail;
