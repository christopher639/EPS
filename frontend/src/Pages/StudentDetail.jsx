import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

axios.defaults.baseURL = "https://eps-admin-frontend.onrender.com";

const StudentDetail = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit student data here
    axios.post("/api/students", formData)
      .then(response => {
        toast.success("Student added successfully");
        setShowModal(false); // Close modal after successful submission
        getFetchData(); // Reload student data
      })
      .catch(error => {
        toast.error("Sending message will be available soon");
      });
  };


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
           onClick={() =>setShowModal(true)}
           className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
         >
           Message
         </button>
       </div>
       </div>
      </div>
      {showModal && (
        <div className="fixed  inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg  max-h-[72vh] md:max-h-[90vh] overflow-y-auto  w-full mx-5  md:w-2/3 ">
            <div className='py-1 '>
              <p className='text-lg font-semibold'>Compose Message any or both   </p>
            </div>
            <form onSubmit={handleSubmit}>
             <div className='flex flex-col gap-5 md:flex-row justify-between'>
              <div className='flex-1'>
                <p>Inbox message</p>
                
                <input className='w-full py-2 px-3 h-32 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500' type="text" />
              </div>
              <div className='flex-1'>
               <p> Email Message</p>
               <input className='w-full py-2 px-3 h-32 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500' type="text" />
                </div>
             </div>

             
              <div className='mt-6 flex justify-end'>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className='bg-gray-500 text-white py-2 px-4 rounded-md mr-2'
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className='bg-green-600 text-white py-2 px-4 rounded-md'
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     <div className="p-4 flex flex-col  flex max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto justify-center">
     <div>
        <img className='w-24 object-cover rounded-full mx-auto' src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" />

    </div>
     <div  className='flex gap-1 md:gap-5 justify-center'>
       <div className='grid  grid-cols-1 md:grid-cols-2 gap-3'>
      <p className='flex justify-between'><strong className=''>STUDENT NAME :</strong><span className='text-yellow-800 ' > {student.name.toUpperCase()}</span></p>
      <p className='flex justify-between'><strong  className=''>ADM :</strong> <span className='text-yellow-800 ' >{student.regno.toUpperCase()}</span></p>
      <p  className='flex justify-between'><strong  className=''>GENDER :</strong><span className='text-yellow-800'> {student.gender.toUpperCase()}</span></p>
      <p  className='flex justify-between' ><strong  className=''>ADMITTED ON :</strong><span className='text-yellow-800 '>  {new Date(student.dot).toLocaleDateString('en-GB')}</span></p>
      <p  className='flex justify-between ' ><strong  className=''>DATE OF BIRTH :</strong><span className='text-yellow-800'>  {new Date(student.dob).toLocaleDateString('en-GB')}</span></p>
      <p  className='flex justify-between '><strong  className=''>CLASS STREAM :</strong><span className='text-yellow-800'> {student.stream.toUpperCase()}</span></p>
      <p  className='flex justify-between'><strong  className=''>PARENT/G  NAME :</strong> <span className='text-yellow-800 '>{student.parentname.toUpperCase()}</span></p>
      <p  className='flex justify-between '><strong  className=''>PARENT/G PHONE :</strong><span  className='text-yellow-800 '> +254{student.phone}</span></p>
      <p  className='flex justify-between sm:text-sm lg:text-lg'><strong  className=''>PARENT/G  EMAIL :</strong><span  className='text-yellow-800 '> {student.email}</span></p>
      <p  className='flex justify-between'><strong  className=''>PREVIOUS SCHOOL :</strong> <span  className='text-yellow-800  '>{student.previous.toUpperCase()}</span></p>

      {/* Add more fields as necessary */}
       </div>
     </div>
    </div>
   </div>
  );
};

export default StudentDetail;
