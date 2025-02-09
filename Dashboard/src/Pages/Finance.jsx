import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton'; // Import the Sidebar Toggle Button
import UserAccount from '../components/UserAccount'; // Import the User Account component
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FaFileInvoiceDollar, FaMoneyCheckAlt, FaBell, FaDownload } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Finance = () => {
  const [sideBar, setSideBar] = useState(true); // State to manage sidebar visibility

  const expenses ={
    total:700000
  }

  // Dummy data for demonstration
  const feeData = {
    expectedFees:5000000,
    paidFees: 500000,
    pendingFees: 120000,
    overdueFees: 80000,
    feeCategories: [
      { name: 'Tuition', amount: 300000 },
      { name: 'Transport', amount: 100000 },
      { name: 'Meals', amount: 80000 },
      { name: 'Extracurricular', amount: 20000 },
    ],
    paymentRecords: [
      { id: 1, student: 'John Doe', amount: 5000, date: '2023-10-01', status: 'Paid' },
      { id: 2, student: 'Jane Smith', amount: 7000, date: '2023-10-05', status: 'Pending' },
      { id: 3, student: 'Alice Johnson', amount: 6000, date: '2023-10-10', status: 'Overdue' },
    ],
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: feeData.feeCategories.map((category) => category.name),
    datasets: [
      {
        data: feeData.feeCategories.map((category) => category.amount),
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722'],
        hoverOffset: 4,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Fee Collection (Ksh)',
        data: [40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000],
        backgroundColor: '#4CAF50',
      },
    ],
  };
    // Bar Chart Data
    const lineData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Expense trends (Ksh)',
          data: [90000, 45000, 970000, 55000, 70000, 5000, 7000, 95000, 80000, 86000],
           backgroundColor: '#2196F3',
        borderColor: '#2196F3',
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
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? 'w-72' : 'w-16'
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex bg-gray-50 flex-col w-full p-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <SidebarToggleButton
              toggleSidebar={toggleSideBar}
              isSidebarCollapsed={!sideBar}
            />
            <h1 className='text-sm sm:text-lg md:text-xl lg:text-3xl font-bold text-gray-800'>Finance Management</h1>
          </div>
          <UserAccount />
        </div>

        <div className='overflow-y-auto max-h-[85vh]'>
       <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
           {/* Fee Overview Cards */}
           <div className='grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-8'>
          
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600'>Expected Fees</p>
                <p className='text-xl font-bold text-gray-800'>Ksh {feeData.expectedFees.toLocaleString()}</p>
              </div>
              <FaFileInvoiceDollar className='text-2xl text-blue-500' />
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600'>Total Fees Collected</p>
                <p className='text-xl font-bold text-gray-800'>Ksh {feeData.paidFees.toLocaleString()}</p>
              </div>
              <FaFileInvoiceDollar className='text-2xl text-blue-500' />
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600'>Pending Fees</p>
                <p className='text-xl font-bold text-gray-800'>Ksh {((feeData.expectedFees)-(feeData.paidFees)).toLocaleString()}</p>
              </div>
              <FaMoneyCheckAlt className='text-2xl text-yellow-500' />
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600'>Total Expenses</p>
                <p className='text-xl font-bold text-gray-800'>Ksh {expenses.total.toLocaleString()}</p>
              </div>
              <FaFileInvoiceDollar className='text-2xl text-blue-500' />
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600'>Overdue Fees</p>
                <p className='text-xl font-bold text-gray-800'>Ksh {feeData.overdueFees.toLocaleString()}</p>
              </div>
              <FaBell className='text-2xl text-red-500' />
            </div>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600'>Total Income</p>
                <p className='text-xl font-bold text-gray-800'>Ksh {((feeData.paidFees)-(expenses.total)).toLocaleString()}</p>
              </div>
              <FaBell className='text-2xl text-red-500' />
            </div>
          </div>
           </div>
           <div className='bg-white p-6 rounded-lg mb-8 shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Monthly Fee Collection</h2>
            <Bar data={barData} />
          </div>
       </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Fee Distribution</h2>
            <Doughnut data={doughnutData} />
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Monthly expenses</h2>
             <Line data={lineData} />
          </div>
        </div>

        {/* Payment Records Table */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Payment Records</h2>
          <div className='overflow-x-auto'>
            <table className='w-full table-auto'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Student</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Amount (Ksh)</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {feeData.paymentRecords.map((record) => (
                  <tr key={record.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>{record.student}</td>
                    <td className='px-6 py-4'>{record.amount.toLocaleString()}</td>
                    <td className='px-6 py-4'>{record.date}</td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          record.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Reminders and Reports */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Send Payment Reminders</h2>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'>
              <FaBell className='inline-block mr-2' />
              Send Reminders
            </button>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Generate Financial Reports</h2>
            <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors'>
              <FaDownload className='inline-block mr-2' />
              Download Report
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;