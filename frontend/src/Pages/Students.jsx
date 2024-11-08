import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = "https://eps-backendt.onrender.com";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  const getFetchData = () => {
    setLoading(true); // Start loading
    axios.get("/api/students")
      .then(response => {
        setStudents(response.data.reverse()); // Reverse to show the last admitted first
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(err => {
        console.log(err);
        setLoading(false); // Stop loading if there's an error
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/delete/${id}`);
      if (response.data.success === "true") {
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

  // Filtered students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.regno.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='flex flex-col min-w-full'>
      <div className='px-4'>
        <input
          type="text"
          placeholder="Search by name or regno"
          className="w-full px-3 py-2 mb-4 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Show loading message while fetching students */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">Wait, it's loading...</p>
        </div>
      ) : (
        <div className='mx-4 md:mx-0 flex max-h-[80vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
          <table className='min-w-full mt-2'>
            <thead className='bg-slate-800 px-1 h-10 text-white'>
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
                <tr key={student._id} className='border hover:bg-gray-200 py-1 border-slate-500'>
                  <td className='border py-1 text-center'>{filteredStudents.length - index}</td>
                  <td className='border whitespace-nowrap px-4 py-1'>{student.name}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.regno}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.gender}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{formatDate(student.dot)}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.stream.toUpperCase()}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>
                    <button onClick={() => handleDelete(student._id)} className='text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white">
                      <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                    </svg>
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => { alert("Not working at the moment") }}
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
