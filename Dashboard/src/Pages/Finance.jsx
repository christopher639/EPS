import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import { 
  FaMoneyBillAlt, 
  FaFileInvoiceDollar, 
  FaMoneyCheckAlt, 
  FaBell, 
  FaDownload,
  FaChartLine,
  FaChartBar,
  FaChartPie
} from 'react-icons/fa';
import { 
  MdOutlineAttachMoney,
  MdPendingActions,
  MdOutlineMoneyOff
} from 'react-icons/md';
import SidebarToggleButton from '../components/SidebarToggleButton';
import UserAccount from '../components/UserAccount';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink } from 'react-router-dom';
import BASE_URL from '../config';
import MobileNav from '../components/MobileNav';
import { Tooltip } from 'react-tooltip';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Finance = () => {
  const [sideBar, setSideBar] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [totalFeesPaid, setTotalFeesPaid] = useState(0);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('https://eps-dashboard.onrender.com/api/expenses');
      setExpenses(res.data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
      console.error(error);
    }
    setLoading(false);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://eps-dashboard.onrender.com/api/fees-payments");
      setPayments(res.data.payments);
      setTotalFeesPaid(res.data.totalFeesPaid);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
    fetchPayments();
  }, []);

  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  // Chart data configurations
  const doughnutData = {
    labels: ['Tuition', 'Transport', 'Meals', 'Extracurricular'],
    datasets: [
      {
        data: [300000, 100000, 80000, 20000],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722'],
        hoverOffset: 4,
      },
    ],
  };

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

  return (
    <div className='flex bg-gray-50 min-h-screen'>
      {/* Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex bg-gray-50 flex-col w-full '>
        {/* Header */}
     <div className='bg-white justify-between border-b flex py-[17px]'>
     <div className='hidden h-8 w-1/6 px-4  md:flex'>
              <SidebarToggleButton
                toggleSidebar={toggleSideBar}
                isSidebarCollapsed={!sideBar}
              />
            </div>
        <div className='flex bg-white w-5/6  justify-between   mb-1'>
          <div>
            <MobileNav />
          </div>
         
          <div className='flex items-center gap-2'>
          
            <p className='text-sm hidden md:flex  font-bold text-gray-800'>
              Finance Management
            </p>
          </div>
          <NavLink 
            to="/fees-structures" 
            className='bg-blue-700  px-2 hidden md:flex rounded-full text-white items-center'
            data-tooltip-id="fees-structure-tooltip"
            data-tooltip-content="View fee structures"
          >
            <span className='hidden text-sm md:flex'>Fees Structures</span>
            <span className='flex md:hidden'>
              <FaMoneyBillAlt className='text-lg'/>
            </span>
          </NavLink>
          <UserAccount />
        </div>
     </div>
        
        {/* Mobile Header */}
        <div className='flex justify-between md:hidden mb-4'>
        
          <NavLink 
            to="/fees-structures" 
            className='bg-blue-700 px-2 hidden rounded text-white text-sm py-1 flex items-center'
            data-tooltip-id="mobile-fees-tooltip"
            data-tooltip-content="View fee structures"
          >
            Fees Structures
          </NavLink>
        </div>

        <div className='overflow-y-auto max-h-[87vh] p-1 mx-1 pb-8'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2'>
            {/* Revenue Card */}
            <div 
              className='bg-white p-4 rounded-lg'
              data-tooltip-id="revenue-tooltip"
              data-tooltip-content="Total revenue after expenses"
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm text-gray-600'>Total Revenue</p>
                  <p className='text-lg md:text-xl font-bold text-gray-800'>
                    Ksh {(totalFeesPaid - totalExpense).toLocaleString()}
                  </p>
                </div>
                <MdOutlineAttachMoney className='text-xl md:text-2xl text-green-500' />
              </div>
            </div>

            {/* Fees Collected Card */}
            <NavLink 
              to="/fees-payments"
              className='bg-white p-4 rounded-lg'
              data-tooltip-id="fees-tooltip"
              data-tooltip-content="View collected fees"
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm text-gray-600'>Fees Collected</p>
                  <p className='text-lg md:text-xl font-bold text-gray-800'>
                    Ksh {new Intl.NumberFormat("en-US").format(totalFeesPaid)}
                  </p>
                </div>
                <FaFileInvoiceDollar className='text-xl md:text-2xl text-blue-500' />
              </div>
            </NavLink>

            {/* Expenses Card */}
            <NavLink 
              to="/expenses"
              className='bg-white p-4 rounded-lg relative'
              data-tooltip-id="expenses-tooltip"
              data-tooltip-content="View expense records"
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                  <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm text-gray-600'>Total Expenses</p>
                  <p className='text-lg md:text-xl font-bold text-gray-800'>
                    {loading ? "" : `Ksh ${totalExpense.toLocaleString()}`}
                  </p>
                </div>
                <MdOutlineMoneyOff className='text-xl md:text-2xl text-red-500' />
              </div>
            </NavLink>

            {/* Pending Fees Card */}
            <div 
              className='bg-white p-4 rounded-lg'
              data-tooltip-id="pending-tooltip"
              data-tooltip-content="Pending fee payments"
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs md:text-sm text-gray-600'>Pending Fees</p>
                  <p className='text-lg md:text-xl font-bold text-gray-800'>
                    Ksh 0.00
                  </p>
                </div>
                <MdPendingActions className='text-xl md:text-2xl text-yellow-500' />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8'>
            <div className='bg-white p-4 rounded-lg shadow'>
              <div className="flex justify-between items-center mb-3">
                <h2 className='text-sm md:text-lg font-bold text-gray-800'>Monthly Expenses</h2>
                <button 
                  className="text-xs text-blue-600"
                  data-tooltip-id="expense-chart-tooltip"
                  data-tooltip-content="Monthly expense trends"
                >
                  <FaChartLine className="inline mr-1" /> View
                </button>
              </div>
              <div className="h-64">
                <Line data={lineData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div className='bg-white p-4 rounded-lg shadow'>
              <div className="flex justify-between items-center mb-3">
                <h2 className='text-sm md:text-lg font-bold text-gray-800'>Monthly Fee Collection</h2>
                <button 
                  className="text-xs text-blue-600"
                  data-tooltip-id="fee-chart-tooltip"
                  data-tooltip-content="Monthly fee collection"
                >
                  <FaChartBar className="inline mr-1" /> View
                </button>
              </div>
              <div className="h-64">
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div className='bg-white p-4 rounded-lg shadow lg:col-span-2'>
              <div className="flex justify-between items-center mb-3">
                <h2 className='text-sm md:text-lg font-bold text-gray-800'>Fee Distribution</h2>
                <button 
                  className="text-xs text-blue-600"
                  data-tooltip-id="distribution-tooltip"
                  data-tooltip-content="Fee category distribution"
                >
                  <FaChartPie className="inline mr-1" /> View
                </button>
              </div>
              <div className="h-64">
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h2 className='text-sm md:text-lg font-bold text-gray-800 mb-3'>Send Payment Reminders</h2>
              <button 
                className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm md:text-base'
                data-tooltip-id="reminder-tooltip"
                data-tooltip-content="Send payment reminders to parents"
              >
                <FaBell className='inline-block mr-2' />
                Send Reminders
              </button>
            </div>
            <div className='bg-white p-4 rounded-lg shadow'>
              <h2 className='text-sm md:text-lg font-bold text-gray-800 mb-3'>Generate Reports</h2>
              <button 
                className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm md:text-base'
                data-tooltip-id="report-tooltip"
                data-tooltip-content="Generate financial reports"
              >
                <FaDownload className='inline-block mr-2' />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip id="fees-structure-tooltip" place="bottom" className="text-xs z-50" />
      <Tooltip id="mobile-fees-tooltip" place="bottom" className="text-xs z-50" />
      <Tooltip id="revenue-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="fees-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="expenses-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="pending-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="expense-chart-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="fee-chart-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="distribution-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="reminder-tooltip" place="top" className="text-xs z-50" />
      <Tooltip id="report-tooltip" place="top" className="text-xs z-50" />

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="text-sm"
      />
    </div>
  );
};

export default Finance;