import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "https://eps-backend.onrender.com";

const  Parents = () => {
  const [students, setStudents] = useState([]);

  const getFetchData = () => {
    axios.get("https://eps-backend.onrender.com/api/students")
      .then(response => setStudents(response.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getFetchData();
  }, []);

  // Function to format date as "DD/MM/YYYY"
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
      <div className='flex max-h-[87vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
        <table className='min-w-full mt-2'>
          <thead className='bg-slate-800 px-1 text-white'>
            <tr>
              <th className='border whitespace-nowrap px-1'>NO</th>
              <th className='border whitespace-nowrap px-1'>P/G FULL NAME</th>
              <th className='border whitespace-nowrap px-1'>EMAIL</th>
              <th className='border whitespace-nowrap px-1'>PHONE</th>
              <th className='border whitespace-nowrap px-1'>STUDENT NMAE </th>
              <th className='border whitespace-nowrap px-1'>ADM NO</th>
              
            </tr>
          </thead>
          <tbody>
            {
              students.map((student, index) => (
            <tr key={index} className='border  py-3 border-slate-500'>
            <td className='pr-2 whitespace-nowrap border border-slate-500'>{index + 1}</td>
             <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.parentname}</td>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.email}</td>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.phone}</td>
                  <td className='pr-2 whitespace-nowrap border text-center border-slate-500'>{student.name}</td>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.regno}</td>
                 
                 
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Parents;
