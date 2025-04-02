import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import lion from '../assets/lion.jpg';
import SidebarToggleButton from '../components/SidebarToggleButton';
import UserAccount from '../components/UserAccount';
import { FaUsers, FaChalkboardTeacher, FaUniversity, FaUserGraduate, FaMoneyBillAlt, FaBuilding, FaUserCircle, FaBook, FaClipboard, FaSchool } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import SideBar from '../components/SideBar';
import MobileNav from '../components/MobileNav';

ChartJS.register(ArcElement, Tooltip, Legend);

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const Dashboard = () => {
  const [students, setMarks] = useState([]);
  const [totalFeesPaid, setTotalFeesPaid] = useState(0);
  const [stream, setStream] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [clases, setClases] = useState([]);
  const [leaners, setLearners] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeaners, setTotalLeaners] = useState(0);
  const [learnersPerPage, setLearnersPerPage] = useState(10);
  const [alumniCount, setAlumniCount] = useState(0);
  const [sideBar, setSideBar] = useState(true);
  const [loadingLearners, setLoadingLearners] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStreams, setLoadingStreams] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

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
      setLoadingLearners(true);
      axios
        .get('https://eps-dashboard.onrender.com/api/learners')
        .then((leaners) => {
          setLearners(leaners.data);
          setLoadingLearners(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingLearners(false);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getFetchData = () => {
      setLoadingTeachers(true);
      axios
        .get('https://eps-dashboard.onrender.com/api/teachers')
        .then((response) => {
          setTeachers(response.data);
          setLoadingTeachers(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingTeachers(false);
        });
    };
    getFetchData();
  }, []);

  const fetchClases = async () => {
    setLoadingClasses(true);
    try {
      const { data } = await axios.get('https://eps-dashboard.onrender.com/api/clase');
      setClases(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchLearners = async () => {
    try {
      setLoadingLearners(true);
      const response = await axios.get(`https://eps-dashboard.onrender.com/api/learners?page=${currentPage}&limit=${learnersPerPage}`);
      setLearners(response.data.learners);
      setTotalPages(response.data.totalPages);
      setTotalLeaners(response.data.totalLearners);
      setLoadingLearners(false);
    } catch (error) {
      console.error("Failed to fetch learners:", error);
      setLoadingLearners(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, [currentPage, learnersPerPage]);

  useEffect(() => {
    const fetchData = () => {
      setLoadingStreams(true);
      axios
        .get('https://eps-dashboard.onrender.com/api/streams')
        .then((stream) => {
          setStream(stream.data);
          setLoadingStreams(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingStreams(false);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setAlumniCount(students.length);
  }, [students]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("https://eps-dashboard.onrender.com/api/fees-payments");
      setTotalFeesPaid(res.data.totalFeesPaid);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const doughnutData = {
    labels: ['Streams', 'Teachers', 'Leaners', 'Departments'],
    datasets: [
      {
        data: [stream.length, teachers.length, totalLeaners, 5],
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
      legend: {
        position: 'bottom',
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    cutout: '50%',
  };

  const lionImagePlugin = {
    id: 'lionImagePlugin',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const { width, height } = chart;
      const cutoutPercentage = 60;
      const centerX = width / 2;
      const centerY = height / 2.12;
      const innerRadius = (Math.min(width, height) / 2) * (cutoutPercentage / 100);
      if (!chart.customImage) {
        chart.customImage = new Image();
        chart.customImage.src = lion;
        chart.customImage.onload = () => {
          chart.draw();
        };
        return;
      }
      ctx.save();
      const imgSize = innerRadius * 1.5;
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

  ChartJS.register(lionImagePlugin);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='w-full'>
        {/* Header */}
        <div className='flex justify-between items-center p-[19px] bg-white  p-2 border-b'>
          <div className='flex items-center gap-3'>
            <div>
              <MobileNav />
            </div>
            <div className='hidden md:flex'>
              <SidebarToggleButton
                toggleSidebar={toggleSideBar}
                isSidebarCollapsed={!sideBar}  
              />
            </div>
            <h1 className='text-sm text-red-900 font-bold md:flex md:text-md lg:text-xl font-bold text-gray-800'>
              <img src="lion.jpg" alt="" className="h-[54px] md:hidden" />
            </h1>
            <p className='hidden md:flex text-gray-500'> Admin Dashboard</p>
          </div>
          <div className='flex items-center gap-4'>
            <UserAccount />
          </div>
        </div>

        {/* Main Content */}
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-auto overflow-y-auto max-h-[90vh] p-2'>
          {/* Stats Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4'>
            {/* Learners Count */}
            <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow'>
              <NavLink to='/learner'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600 font-medium'>Learners</p>
                    {loadingLearners ? <Spinner /> : <p className='text-3xl font-bold text-gray-800'>{totalLeaners.toLocaleString()}</p>}
                  </div>
                  <FaUsers className='text-4xl text-blue-500' />
                </div>
              </NavLink>
            </div>

            {/* Teachers Count */}
            <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow'>
              <NavLink to='/teachers'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600 font-medium'>Teachers</p>
                    {loadingTeachers ? <Spinner /> : <p className='text-3xl font-bold text-gray-800'>{teachers.length}</p>}
                  </div>
                  <FaChalkboardTeacher className='text-4xl text-green-500' />
                </div>
              </NavLink>
            </div>

            {/* Streams Count */}
            <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow'>
              <NavLink to='/streams'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600 font-medium'>Streams</p>
                    {loadingStreams ? <Spinner /> : <p className='text-3xl font-bold text-gray-800'>{stream.length}</p>}
                  </div>
                  <FaSchool className='text-4xl text-yellow-500' />
                </div>
              </NavLink>
            </div>

            {/* Classes Count */}
            <div className='bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow'>
              <NavLink to='/classes'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600 font-medium'>Classes</p>
                    {loadingClasses ? <Spinner /> : <p className='text-3xl font-bold text-gray-800'>{clases.length}</p>}
                  </div>
                  <FaUniversity className='text-4xl text-purple-500' />
                </div>
              </NavLink>
            </div>
          </div>

          {/* Charts and Analytics */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4'>
            {/* Doughnut Chart */}
            <div className='bg-white rounded-lg shadow-sm p-2'>
              <h2 className='text-xl font-semibold text-gray-800'>Distribution Overview</h2>
              <div className='flex justify-center relative'>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>

            {/* Analytics Section */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
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
                <NavLink to="/fees-payments">
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <p className='text-gray-600'>Financials</p>
                    <p className='text-2xl font-bold text-gray-800'>Ksh {new Intl.NumberFormat("en-US").format(totalFeesPaid)}</p>
                  </div>
                </NavLink>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-600'>Alumni</p>
                  <p className='text-2xl font-bold text-gray-800'>{alumniCount}</p>
                </div>
              </div>
            </div>
          </div>

        {/* Expanded Quick Links */}
<div className='bg-white rounded-lg mb-8 shadow-sm p-6'>
  <h2 className='text-xl font-semibold text-gray-800 mb-4'>Quick Links</h2>
  <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
    {[
      // Streams - Green (#4CAF50)
      { to: '/streams', icon: <FaSchool className='text-xl' style={{ color: '#4CAF50' }} />, text: 'Streams' },
      
      // Teachers - Orange (#FF9800)
      { to: '/teachers', icon: <FaChalkboardTeacher className='text-xl' style={{ color: '#FF9800' }} />, text: 'Teachers' },
      
      // Learners - Blue (#2196F3)
      { to: '/learner', icon: <FaUsers className='text-xl' style={{ color: '#2196F3' }} />, text: 'Learners' },
      
      // Departments - Red (#FF5722)
      { to: '', icon: <FaBuilding className='text-xl' style={{ color: '#FF5722' }} />, text: 'Departments' },
      
      // Classes - Purple (added to match stats grid)
      { to: '/clases', icon: <FaUniversity className='text-xl' style={{ color: '#9C27B0' }} />, text: 'Classes' },
      
      // Finance - Teal (new color)
      { to: '/finance', icon: <FaMoneyBillAlt className='text-xl' style={{ color: '#009688' }} />, text: 'Finances' },
      
      // Users - Deep Purple
      { to: '/users', icon: <FaUserCircle className='text-xl' style={{ color: '#673AB7' }} />, text: 'Users' },
      
      // Learning Areas - Light Blue
      { to: "/learningarea", icon: <FaBook className='text-xl' style={{ color: '#03A9F4' }} />, text: "Learning Areas" },
      
      // Assessments - Amber
      { to: "", icon: <FaClipboard className='text-xl' style={{ color: '#FFC107' }} />, text: "Assessments" },
      
    
      
      // Timetable - Indigo
      { to: "", icon: <FaClipboard className='text-xl' style={{ color: '#3F51B5' }} />, text: "Timetable" },
      
      // Fee Structure - Brown
      { to: "/fees-structure", icon: <FaMoneyBillAlt className='text-xl' style={{ color: '#795548' }} />, text: "Fee Structure" },
      
      // Exam Results - Pink
      { to: "/general-report", icon: <FaClipboard className='text-xl' style={{ color: '#E91E63' }} />, text: "Exam Results" },
      
      // Parents - Cyan
      { to: "", icon: <FaUserCircle className='text-xl' style={{ color: '#00BCD4' }} />, text: "Parents" },
      
      // Staff - Lime
      { to: "", icon: <FaUserCircle className='text-xl' style={{ color: '#CDDC39' }} />, text: "Staff" }
    ].map((link, index) => (
      <NavLink
        key={index}
        to={link.to}
        className='flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
      >
        {link.icon}
        <p className='mt-2 text-sm font-medium text-center'>{link.text}</p>
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