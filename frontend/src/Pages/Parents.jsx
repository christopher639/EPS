import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = "https://eps-backend.onrender.com";

const Parents = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

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

  useEffect(() => {
    getFetchData();
  }, []);

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
        toast.success("Student and parents deleted successfully");
        setStudents((prevStudents) => prevStudents.filter(student => student._id !== id));
      } else {
        toast.error("Failed to delete student.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student. Please try again.");
    }
  };

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">Wait, it's loading...</p>
        </div>
      ) : (
        <div className='mx-4 md:mx-0 flex max-h-[72vh] md:max-h-[76vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
          <table className='min-w-full mt-2'>
            <thead className='bg-slate-800 px-1 h-10 text-white'>
              <tr>
              <th className='border whitespace-nowrap'>NO</th>
              <th className='border whitespace-nowrap'>P/G FULL NAME</th>
              <th className='border whitespace-nowrap'>EMAIL</th>
              <th className='border whitespace-nowrap'>PHONE</th>
              <th className='border whitespace-nowrap px-1'>ADM NO</th>
              <td className='border px-4 py-2 text-center'>
                <button onClick={() => alert("Delete functionality not implemented")} className='text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700'>
                  {/* SVG code */}
                  DEL
                </button>
              </td>
              <td className='border px-4 py-2 text-center'>
                <button
                  onClick={() => { alert("Update functionality not implemented") }}
                  className='text-white px-2 py-1 rounded-md bg-green-600 hover:bg-green-700'
                >
                  {/* SVG code */}
                  PUT
                </button>
              </td>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className='border hover:bg-gray-200 py-1 border-slate-500 cursor-pointer'
                  onClick={() => navigate(`/student/${student._id}`)} // Navigate on row click
                >
                  <td className='border py-1 text-center'>{filteredStudents.length - index}</td>
                  <td className='border whitespace-nowrap px-4 py-1'>{student.name}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.email}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.phone}</td>
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>{student.regno}</td>
                
                  <td className='border whitespace-nowrap px-4 py-1 text-center'>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(student._id); }}
                      className='text-white p-4 rounded-md bg-red-600 hover:bg-red-700'
                    >
                      {/* Delete icon */}
                      
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={(e) => { e.stopPropagation(); alert("Not working at the moment"); }}
                      className='text-white  p-4 rounded-md bg-green-600  hover:bg-green-700'
                    >
                      {/* Update icon */}
                     
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

export default Parents;
