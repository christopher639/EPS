import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import lion from '../assets/lion.jpg'; // Import the lion image
import SidebarToggleButton from '../components/SidebarToggleButton';
import UserAccount from '../components/UserAccount';
import { FaUsers, FaChalkboardTeacher, FaUniversity, FaUserGraduate, FaMoneyBillAlt, FaBuilding, FaUserCircle } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import SideBar from '../components/SideBar';
// import BASE_URL from '../config';
// axios.defaults.baseURL = BASE_URL;
// Registering Chart.js plugins
ChartJS.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {
  const [students, setMarks] = useState([]);
  const [stream, setStream] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [leaners, setLearners] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [totalLeaners, setTotalLeaners] = useState(0); // Total number of learners
  const [learnersPerPage, setLearnersPerPage] = useState(10); // Learners per page
  const [alumniCount, setAlumniCount] = useState(0);
  const [sideBar, setSideBar] = useState(true); // To control the visibility of the sidebar

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('https://eps-dashboard.onrender.com/api/students')
        .then((students) => setMarks(students.data))
        .catch((err) => console.log(err));
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('https://eps-dashboard.onrender.com/api/learners')
        .then((leaners) => setLearners(leaners.data))
        .catch((err) => console.log(err));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getFetchData = () => {
      axios
        .get('/api/teachers')
        .then((response) => setTeachers(response.data))
        .catch((err) => console.log(err));
    };
    getFetchData();
  }, []);

  // Fetch all learners with pagination
  const fetchLearners = async () => {
    try {
      const response = await axios.get(`https://eps-dashboard.onrender.com/api/learners?page=${currentPage}&limit=${learnersPerPage}`);
      setLearners(response.data.learners); // Set learners data
      setTotalPages(response.data.totalPages); // Set total pages
      setTotalLeaners(response.data.totalLearners); // Set total learners
    } catch (error) {
      console.error("Failed to fetch learners:", error);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [currentPage, learnersPerPage]); // Fetch learners when page or learnersPerPage changes

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('https://eps-dashboard.onrender.com/api/streams')
        .then((stream) => setStream(stream.data))
        .catch((err) => console.log(err));
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAlumniCount(students.length);
  }, [students]);

  // Doughnut Chart Data
  const doughnutData = {
    labels: ['Leaners', 'Teachers', 'Streams', 'Departments'],
    datasets: [
      {
        data: [totalLeaners, teachers.length, stream.length, 5],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722'],
        hoverOffset: 4,
      },
    ],
  };

  // Doughnut Chart Options
  const doughnutOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        position: 'bottom',
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    cutout: '50%', // Ensures space in the center for the image
  };

  // Custom plugin to draw the lion image at the center of the Doughnut chart
  const lionImagePlugin = {
    id: 'lionImagePlugin',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const { width, height } = chart;
      const cutoutPercentage = 60; // Matches the cutout percentage in options
      const centerX = width / 2;
      const centerY = height / 2.12;

      // Calculate the radius of the doughnut's inner circle
      const innerRadius = (Math.min(width, height) / 2) * (cutoutPercentage / 100);

      // Ensure the image is properly loaded
      if (!chart.customImage) {
        chart.customImage = new Image();
        chart.customImage.src = lion; // Use the imported image
        chart.customImage.onload = () => {
          chart.draw(); // Redraw chart once the image loads
        };
        return;
      }

      // Draw the image at the center of the chart
      ctx.save();
      const imgSize = innerRadius * 1.5; // Adjust the size to fit the available space
      ctx.drawImage(
        chart.customImage,
        centerX - imgSize / 2,
        centerY - imgSize / 2,
        imgSize,
        imgSize
      );
      ctx.restore();
    },
  };

  // Register the custom plugin
  ChartJS.register(lionImagePlugin);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? 'w-0 md:w-72' : 'w-0'
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='w-full'>
        {/* Header */}
        <div className='flex justify-between items-center bg-white shadow-sm p-4 border-b'>
          <div className='flex items-center gap-3'>
            <SidebarToggleButton
              toggleSidebar={toggleSideBar}
              isSidebarCollapsed={!sideBar}
            />
            <h1 className='text-sm md:text-md lg:text-xl font-bold text-gray-800'>
              SAMGE SCHOOL
            </h1>
            <p className=' hidden md:flex text-gray-500'> Admin Dashboard</p>
          </div>
          <div className='flex items-center gap-4'>
            <UserAccount />
          </div>
        </div>
        {/* Main Content */}
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-auto overflow-y-auto max-h-[90vh] p-6 '>
          {/* Stats Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4'>
            {/* Learners Count */}
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <NavLink to='/learner'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600 font-medium'>Learners</p>
                    <p className='text-3xl font-bold text-gray-800'>{totalLeaners}</p>
                  </div>
                  <FaUsers className='text-4xl text-blue-500' />
                </div>
              </NavLink>
            </div>

            {/* Teachers Count */}
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <NavLink to='/teachers'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600 font-medium'>Teachers</p>
                    <p className='text-3xl font-bold text-gray-800'>{teachers.length}</p>
                  </div>
                  <FaChalkboardTeacher className='text-4xl text-green-500' />
                </div>
              </NavLink>
            </div>

            {/* Streams Count */}
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <NavLink to='/streams'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600 font-medium'>Streams</p>
                    <p className='text-3xl font-bold text-gray-800'>{stream.length}</p>
                  </div>
                  <FaUniversity className='text-4xl text-yellow-500' />
                </div>
              </NavLink>
            </div>

            {/* Alumni Count */}
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-gray-600 font-medium'>Alumni</p>
                  <p className='text-3xl font-bold text-gray-800'>{alumniCount}</p>
                </div>
                <FaUserGraduate className='text-4xl text-indigo-500' />
              </div>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4'>
            {/* Doughnut Chart */}
            <div className='bg-white rounded-lg shadow-md p-2'>
              <h2 className='text-xl font-semibold text-gray-800 '>Distribution Overview</h2>
              <div className='flex justify-center relative'>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>

            {/* Analytics Section */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>Analytics</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-600'>Total Marks</p>
                  <p className='text-2xl font-bold text-gray-800'>0</p>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-600'>Attendance Rate</p>
                  <p className='text-2xl font-bold text-gray-800'>0%</p>
                </div>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-600'>Financials</p>
                  <p className='text-2xl font-bold text-gray-800'>Ksh. 0.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div id='quick-links' className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Quick Links</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
              {[
                { to: '/learner', icon: <FaUsers className='text-xl' />, text: 'Leaners' },
                { to: '/teachers', icon: <FaChalkboardTeacher className='text-xl' />, text: 'Teachers' },
                { to: '/streams', icon: <FaUniversity className='text-xl' />, text: 'Streams' },
                { to: '/departments', icon: <FaBuilding className='text-xl' />, text: 'Departments' },
                { to: '/finance', icon: <FaMoneyBillAlt className='text-xl' />, text: 'Finances' },
                { to: '/users', icon: <FaUserCircle className='text-xl' />, text: 'Users' },
              ].map((link, index) => (
                <NavLink
                  key={index}
                  to={link.to}
                  className='flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
                >
                  {link.icon}
                  <p className='mt-2 text-sm font-medium'>{link.text}</p>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;