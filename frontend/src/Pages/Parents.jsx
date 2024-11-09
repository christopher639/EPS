import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "https://eps-backendt.onrender.com";

const Parents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  // Function to fetch data from the API
  const getFetchData = () => {
    setLoading(true); // Set loading to true when fetching data
    axios.get("/api/students")
      .then(response => {
        setStudents(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(err => {
        console.log(err);
        setLoading(false); // Set loading to false in case of an error
      });
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

  // If loading, show the loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Wait, it's loading...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col bg-gray-100 min-w-full'>
      <div className='flex max-h-[72vh] md:max-h-[71vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
        <table className='min-w-full mt-2'>
          <thead className='bg-slate-800 px-1 py-2 text-white'>
            <tr className='py-2'>
              <th className='border whitespace-nowrap'>NO</th>
              <th className='border whitespace-nowrap'>P/G FULL NAME</th>
              <th className='border whitespace-nowrap'>EMAIL</th>
              <th className='border whitespace-nowrap'>PHONE</th>
              <th className='border whitespace-nowrap px-1'>ADM NO</th>
              <td className='border px-4 py-2 text-center'>
                <button onClick={() => alert("Delete functionality not implemented")} className='text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700'>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                    <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                  </svg>
                </button>
              </td>
              <td className='border px-4 py-2 text-center'>
                <button
                  onClick={() => { alert("Update functionality not implemented") }}
                  className='text-white px-2 py-1 rounded-md bg-green-600 hover:bg-green-700'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                    <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                  </svg>
                </button>
              </td>
            </tr>
          </thead>
          <tbody>
            {
              students.map((student, index) => (
                <tr key={index} className='border-b border-gray-200 hover:bg-gray-200'>
                  <td className='border px-4 py-2'>{index + 1}</td>
                  <td className='border px-1 py-2'>{student.parentname}</td>
                  <td className='border px-1 py-2'>{student.email}</td>
                  <td className='border px-1 text-center py-2'>{student.phone}</td>
                  <td className='border px-1 py-2'>{student.regno}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button onClick={() => alert("Delete functionality not implemented")} className='text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700'>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                      </svg>
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => { alert("Update functionality not implemented") }}
                      className='text-white px-2 py-1 rounded-md bg-green-600 hover:bg-green-700'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                        <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
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

export default Parents;
