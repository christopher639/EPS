import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import UserAccount from '../components/UserAccount';
import { FaTachometerAlt, FaEnvelope, FaEdit, FaTrash, FaPlus, FaUniversity, FaBook, FaUsers, FaChalkboardTeacher, FaClipboardList, FaMoneyBillAlt, FaChartLine, FaUserCircle, FaChevronRight, FaChevronDown, FaFileAlt, FaLongArrowAltDown, FaArrowAltCircleUp, FaAdjust, FaCartArrowDown, FaArrowRight, FaArrowAltCircleDown, FaMedal, FaBuilding, FaUserGraduate } from "react-icons/fa";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registering Chart.js plugins
ChartJS.register(ArcElement, Tooltip, Legend);

axios.defaults.baseURL = "http://localhost:3000";

const Dashboard = () => {
  const [students, setMarks] = useState([]);
  const [stream, setStream] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [alumniCount, setAlumniCount] = useState(0);

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

  useEffect(() => {
    // Simulate an increasing alumni count
    let count = 0;
    const interval = setInterval(() => {
      if (count < 5457) {
        count += 1;
        setAlumniCount(count);
      } else {
        clearInterval(interval);
      }
    }, 5); // This controls the speed of incrementing
    return () => clearInterval(interval);
  }, []);

  // Doughnut Chart Data
  const doughnutData = {
    labels: ['Students', 'Teachers', 'Streams', 'Departments'],
    datasets: [
      {
        data: [students.length, teachers.length, stream.length, 5],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722'],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-auto overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className='flex justify-between items-center bg-white shadow-sm p-4 border-b'>
        <div className='flex items-center gap-2'>
          <h1 className="text-xl font-bold text-gray-800">KIBABII SCHOOL</h1>
          <p className="text-gray-500">Dashboard</p>
        </div>
        <div className='flex items-center gap-4'>
          <UserAccount />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Students Count */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Students</p>
                <p className="text-3xl font-bold text-gray-800">{students.length}</p>
              </div>
              <FaUsers className="text-4xl text-blue-500" />
            </div>
          </div>

          {/* Teachers Count */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Teachers</p>
                <p className="text-3xl font-bold text-gray-800">{teachers.length}</p>
              </div>
              <FaChalkboardTeacher className="text-4xl text-green-500" />
            </div>
          </div>

          {/* Streams Count */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Streams</p>
                <p className="text-3xl font-bold text-gray-800">{stream.length}</p>
              </div>
              <FaUniversity className="text-4xl text-yellow-500" />
            </div>
          </div>

          {/* Alumni Count */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Alumni</p>
                <p className="text-3xl font-bold text-gray-800">{alumniCount}</p>
              </div>
              <FaUserGraduate className="text-4xl text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          {/* Doughnut Chart */}
          <div className="bg-white rounded-lg shadow-md p-2">
            <h2 className="text-xl font-semibold text-gray-800 ">Distribution Overview</h2>
            <div className="flex justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Analytics Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Total Marks</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-800">0%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Financials</p>
                <p className="text-2xl font-bold text-gray-800">Ksh. 0.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { to: "/students", icon: <FaUsers className="text-xl" />, text: "Students", color: "text-blue-500" },
              { to: "/teachers", icon: <FaChalkboardTeacher className="text-xl" />, text: "Teachers", color: "text-green-500" },
              { to: "/streams", icon: <FaUniversity className="text-xl" />, text: "Streams", color: "text-yellow-500" },
              { to: "/departments", icon: <FaBuilding className="text-xl" />, text: "Departments", color: "text-red-500" },
              { to: "/general-report", icon: <FaChalkboardTeacher className="text-xl" />, text: "General Report", color: "text-purple-500" },
              { to: "/assessments", icon: <FaFileAlt className="text-xl" />, text: "Assessments", color: "text-slate-500" },
              { to: "/finance", icon: <FaMoneyBillAlt className="text-xl" />, text: "Finances", color: "text-green-700" },
              { to: "/users", icon: <FaUserCircle className="text-xl" />, text: "Users", color: "text-fuchsia-800" },
            ].map((link, index) => (
              <NavLink key={index} to={link.to} className={`flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${link.color}`}>
                {link.icon}
                <p className="mt-2 text-sm font-medium">{link.text}</p>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;