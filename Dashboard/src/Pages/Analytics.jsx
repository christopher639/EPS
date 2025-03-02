import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton'; 
import UserAccount from '../components/UserAccount'; 
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import MobileNav from '../components/MobileNav';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const Analytics = () => {
  const [sideBar, setSideBar] = useState(true); 

  // Dummy data for demonstration
  const studentPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Grades',
        data: [75, 78, 80, 82, 85, 88],
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const attendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: [92, 94, 93, 95, 96, 97],
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const feeCollectionData = {
    labels: ['Tuition', 'Transport', 'Meals', 'Extracurricular'],
    datasets: [
      {
        data: [300000, 100000, 80000, 20000],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722'],
      },
    ],
  };

  const teacherPerformanceData = {
    labels: ['Mr. Smith', 'Ms. Johnson', 'Mr. Brown', 'Ms. Davis'],
    datasets: [
      {
        label: 'Student Feedback Score',
        data: [4.5, 4.7, 4.6, 4.8],
        backgroundColor: '#FF9800',
      },
    ],
  };

  const admissionTrendsData = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Admissions',
        data: [120, 150, 180, 200],
        backgroundColor: '#9C27B0',
        borderColor: '#9C27B0',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Toggle sidebar visibility
  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className='flex bg-gray-50 min-h-screen'>
      {/* Sidebar */}
      <div
        className={`transition-width duration-300 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex w-full bg-gray-50 flex-col flex-grow p-5'>
        {/* Header */}
        <div className='flex  border-b shadow-sm items-center mb-8'>
          <MobileNav/>
          <div className='flex hidden md:flex items-center gap-3'>
            <SidebarToggleButton
              toggleSidebar={toggleSideBar}
              isSidebarCollapsed={!sideBar}
            />
            <h1 className='text-3xl font-bold text-gray-800 '>Analytics Dashboard</h1>
          </div>
          <UserAccount />
        </div>

        {/* Graphs in a 2-column grid */}
        <div className='grid   md:grid-cols-2 gap-8 overflow-y-auto max-h-[80vh]'>
          {/* Student Performance Analytics */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Student Performance Trends</h2>
            <Bar data={studentPerformanceData} />
          </div>
          {/* Attendance Analytics */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Attendance Trends</h2>
            <Line data={attendanceData} />
          </div>
          {/* Fee Collection Analytics */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Fee Distribution</h2>
            <Pie data={feeCollectionData} />
          </div>
          {/* Teacher Performance Analytics */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Teacher Performance</h2>
            <Bar data={teacherPerformanceData} />
          </div>
          {/* Admission Trends */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Admission Trends</h2>
            <Line data={admissionTrendsData} />
          </div>
          {/* Customizable Reports */}
          <div className='bg-white p-6 rounded-lg shadow-md col-span-2'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Generate Custom Reports</h2>
            <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
