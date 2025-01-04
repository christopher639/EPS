import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import UserAccount from '../components/UserAccount';
import { FaTachometerAlt, FaUniversity, FaBook, FaUsers, FaChalkboardTeacher, FaClipboardList, FaMoneyBillAlt, FaChartLine, FaUserCircle, FaChevronRight, FaChevronDown, FaFileAlt, FaLongArrowAltDown, FaArrowAltCircleUp,FaAdjust, FaCartArrowDown, FaArrowRight, FaArrowAltCircleDown, FaMedal, FaBuilding, FaUserGraduate } from "react-icons/fa"; 

axios.defaults.baseURL = "http://localhost:3000";

const Dashboard = () => {
  const [students, setMarks] = useState([]);
  const [stream, setStream] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [menu,setMenu] = useState(false)
  
  useEffect(() => {
    const fetchData = () => {
      axios.get("/api/students")
        .then(students => setMarks(students.data))
        .catch(err => console.log(err));
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getFetchData = () => {
      axios.get("/api/teachers")
        .then(response => setTeachers(response.data))
        .catch(err => console.log(err));
    };
    getFetchData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      axios.get("/api/streams")
        .then(stream => setStream(stream.data))
        .catch(err => console.log(err));
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-auto overflow-y-auto max-h-[90vh] bg-gray-50">
     <div className='flex justify-between gap-5'>
     <div className='w-3/4 flex justify-start px-5'>
    <p className="text:text-sm md:text-lg flex gap-2  lg:text-xl font-semibold text-center text-slate-800 p-1 mb-3">
      <p className='hidden sm:flex'>KIBABII SCHOOL</p>
      <p> DASHBOARD</p>
    </p>
     </div>
     <div className='w-1/4 pt-2 flex justify-end'>
    
     <UserAccount/>
     </div>
     </div>
      <div>
        <div className='p-5'>
          {/* Main Dashboard Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Students Count */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold">STUDENTS</p>
                <FaUsers className="text-2xl text-blue-500" />
              </div>
              <p className="text-green-600 text-3xl font-bold">{students.length}</p>
            </div>

            {/* Teachers Count */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold"> TEACHERS</p>
                <FaChalkboardTeacher className="text-2xl text-green-500" />
              </div>
              <p className="text-green-600 text-3xl font-bold">{teachers.length}</p>
            </div>

            {/* Streams Count */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold"> STREAMS</p>
                <FaUniversity className="text-2xl text-yellow-500" />
              </div>
              <p className="text-green-600 text-3xl font-bold">{stream.length}</p>
            </div>
            
            {/* School Mean */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold">SCHOOL MEAN</p>
                <FaMedal className="text-2xl text-yellow-500" />
              </div>
              <div className='flex gap-2'>
                <p className="text-green-600 text-3xl font-bold">5.4</p>
                <div className='flex mt-3 gap-2'>
                  <FaArrowAltCircleDown className='text-sm text-red-800'/>
                  <p className='text-sm text-red-800'>Dropping</p>
                </div>
              </div>
            </div>

            {/* Total Employees */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold">Employees</p>
                <FaBuilding className="text-2xl text-orange-500" />
              </div>
              <p className="text-green-600 text-3xl font-bold">0</p>
            </div>

            {/* Departments Count */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold">Departments</p>
                <FaBuilding className="text-2xl text-purple-500" />
              </div>
              <p className="text-green-600 text-3xl font-bold">{stream.length}</p>
            </div>

            {/* Learning Areas */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold">Learning Areas</p>
                <FaBook className="text-2xl text-blue-500" />
              </div>
              <p className="text-green-600 text-3xl font-bold">12</p>
            </div>

            {/* Alumni Count */}
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-5">
              <div className="flex justify-between w-full mb-3">
                <p className="text-gray-800 font-semibold">Alumni</p>
                <FaUserGraduate className="text-2xl text-indigo-500" />
              </div>
              <p className="text-green-600 text-3xl font-bold">5457</p>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
              <button className="text-blue-500 font-medium">
                <FaChevronRight />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Total Marks Analytics */}
              <div className="bg-white shadow-lg rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-800">Total Marks</p>
                  <FaChartLine className="text-2xl text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-700">0</p>
              </div>

              {/* Attendance Rate Analytics */}
              <div className="bg-white shadow-lg rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-800">Attendance Rate</p>
                  <FaClipboardList className="text-2xl text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-700">0%</p>
              </div>

              {/* Financials Analytics */}
              <div className="bg-white shadow-lg rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-800">Financials</p>
                  <FaMoneyBillAlt className="text-2xl text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-700">0</p>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mt-8 pb-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Quick Links</h2>
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {/* Quick Links with Icons */}
              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/students" className="text-blue-500 font-semibold">
                  <FaUsers className="text-xl" /> Students
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/teachers" className="text-green-500 font-semibold">
                  <FaChalkboardTeacher className="text-xl text-green-500" /> Teachers
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/streams" className="text-yellow-500 font-semibold">
                  <FaUniversity className="text-xl text-yellow-500" /> Streams
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/departments" className="text-red-500 font-semibold">
                  <FaBuilding className="text-xl text-red-500" /> Departments
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/general-report" className="text-purple-500 font-semibold">
                  <FaChalkboardTeacher className="text-xl text-purple-500" /> General Exam Report
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/assessments" className="text-slate-500 font-semibold">
                  <FaFileAlt className="text-xl text-slate-500" /> Assessments Reports
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/finance" className="text-green-700 font-semibold">
                  <FaMoneyBillAlt className="text-xl" /> Finances
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/users" className="text-fuchsia-800 font-semibold">
                  <FaUserCircle className="text-xl text-fuchsia-800" /> Users
                </NavLink>
              </div>

              <div className="bg-white border rounded-lg p-5 flex justify-center items-center">
                <NavLink to="/analytics" className="text-stone-950 font-semibold">
                  <FaChartLine className="text-xl text-stone-950" /> Analytics
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
