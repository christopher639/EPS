import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "https://eps-backend.onrender.com";

const Students = () => {
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
              <th className='border whitespace-nowrap px-1'>Full Name</th>
              <th className='border whitespace-nowrap px-1'>ADM</th>
              <th className='border whitespace-nowrap px-1'>GENDER</th>
              <th className='border whitespace-nowrap px-1'>DATE OF ADM</th>
              <th className='border whitespace-nowrap px-1'>STREAM</th>
              <th className='border whitespace-nowrap px-1'>UPDATE</th>
              <th className='border whitespace-nowrap px-1'>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {
              students.map((student, index) => (
                <tr key={index} className='border  py-3 border-slate-500'>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{index + 1}</td>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.name}</td>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.regno}</td>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.gender}</td>
                  <td className='pr-2 whitespace-nowrap border text-center border-slate-500'>{formatDate(student.dot)}</td>
                  <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.stream}</td>
                  <td className='border whitespace-nowrap border-slate-500 text-center'>
                    <button className='text-white px-1 rounded-sm cursor-pointer'>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323">
                        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
                      </svg>
                    </button>
                  </td>
                  <td className='border border-slate-500 text-center'>
                    <button onClick={() => alert("Not working at the moment")} className='text-white px-1 rounded-sm cursor-pointer'>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#75FB4C">
                        <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
