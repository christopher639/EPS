import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To extract URL parameters
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaBars } from 'react-icons/fa'; // Import the hamburger icon for sidebar toggle
import UserAccount from '../components/UserAccount';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton';
import BASE_URL from '../config';
axios.defaults.baseURL = BASE_URL;

const StudentPerStream = () => {
  const { streamName, year } = useParams(); // Extract streamName and year from URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sideBar, setSideBar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch students for the selected stream and year
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`/api/students/${streamName}/${year}`);
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('This Stream is Empty.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, [streamName, year]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle sidebar visibility
  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className='flex w-full'>
      {/** Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? 'w-72' : 'w-16'
        } bg-gray-800 min-h-screen`}
      >
        <SideBar /> {/* Conditionally render based on sidebar state */}
      </div>

      {/** Main content */}
      <div className='flex w-full flex-col min-h-screen bg-gray-100'>
        <ToastContainer />
        <div className='flex justify-between items-center p-4 bg-white shadow-sm'>
          <SidebarToggleButton
            toggleSidebar={toggleSideBar}
            isSidebarCollapsed={!sideBar}
          />
          <div className='hidden sm:flex'>
            <input
              className='outline-none px-4 py-2 border border-gray-300 rounded-md w-64'
              type='text'
              placeholder='Search students'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <UserAccount />
        </div>

        {/** Mobile search bar */}
        <div className='sm:hidden p-4'>
          <input
            className='outline-none px-4 py-2 border border-gray-300 rounded-md w-full'
            type='text'
            placeholder='Search students'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/** Table */}
        <div className='p-3 grid grid-cols-1 pb-4 max-h-[92vh] overflow-y-auto w-full overflow-x-auto'>
          {loading ? (
            <p>Loading students...</p>
          ) : (
            <table className='w-full table-auto px-2 border shadow-lg'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Gender
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Registration Number
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Admission Date
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan='5' className='text-center py-4'>
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4'>{student.name}</td>
                      <td className='px-6 py-4'>{student.email}</td>
                      <td className='px-6 py-4'>{student.gender}</td>
                      <td className='px-6 py-4'>{student.regno}</td>
                      <td className='px-6 py-4'>
                        {new Date(student.admissionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPerStream;