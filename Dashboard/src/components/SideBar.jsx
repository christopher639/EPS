import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import lion from '../assets/lion.jpg';
import {
  FaTachometerAlt,
  FaUniversity,
  FaBook,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaMoneyBillAlt,
  FaChartLine,
  FaFileAlt,
  FaChevronRight,
  FaChevronDown,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaFileUpload,
  FaFileInvoice,
  FaFileExport,
  FaMoneyCheckAlt,
  FaReceipt,
  FaCalculator,
  FaPiggyBank,
  FaChartBar,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaMoneyCheck
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt className="text-purple-500" /> },
  { label: "Academics", icon: <FaBook className="text-blue-500" /> },
  { label: "Finance", icon: <FaMoneyBillAlt className="text-green-500" /> },
  { to: "/departments", label: "Departments", icon: <FaUniversity className="text-red-500" /> },
  { to: "/clases", label: "Classes", icon: <FaBook className="text-blue-500" /> },
  { label: "Human Resource", icon: <FaChalkboardTeacher className="text-yellow-500" /> },
  { to: "/learningarea", label: "Learning Areas", icon: <FaClipboardList className="text-indigo-500" /> },
  { to: "/parents", label: "Parents", icon: <FaUsers className="text-pink-500" /> },
  { to: "/users", label: "Users", icon: <FaUsers className="text-teal-500" /> },
  { to: "/analytics", label: "School Performace", icon: <FaChartLine className="text-orange-500" /> },
];

const SideBar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isHROpen, setIsHROpen] = useState(false);
  
  const userName = localStorage.getItem("userName") || "Admin";

  const toggleAcademics = () => setIsAcademicsOpen(!isAcademicsOpen);
  const toggleFinance = () => setIsFinanceOpen(!isFinanceOpen);
  const toggleHR = () => setIsHROpen(!isHROpen);

  return (
    <div
      className={`hidden md:flex border-r border-3 flex-col bg-white h-screen transition-all duration-300 shadow-lg ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 bg-white border-b flex items-center justify-center">
        <NavLink to="/dashboard" className="flex items-center">
          <img
            className="w-12 h-12 bg-white rounded-full object-contain border-2 border-gray-200"
            src={lion}
            alt="Logo"
          />
          {!isSidebarCollapsed && (
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-800 tracking-wider">SAMGE</h1>
              <p className="text-xs text-gray-500">BOARDING SCHOOL</p>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links with ultra-thin scrollbar */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-custom">
        {navItems.map((item) => {
          if (item.label === "Academics") {
            return (
              <div key={item.label}>
                <div
                  onClick={toggleAcademics}
                  className="flex items-center py-3 px-4 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span>{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3 text-sm font-medium text-gray-700">Academics</span>
                      <span className="ml-auto text-gray-400">
                        {isAcademicsOpen ? (
                          <FaChevronDown className="text-xs" />
                        ) : (
                          <FaChevronRight className="text-xs" />
                        )}
                      </span>
                    </>
                  )}
                </div>
                <div
                  className={`bg-gray-50 transition-all duration-300 overflow-hidden ${
                    isAcademicsOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <NavLink 
                    to="/addmarks" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-blue-50"
                  >
                    <FaFileUpload className="text-blue-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Upload Marks</span>}
                  </NavLink>
                  <NavLink 
                    to="" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-blue-50"
                  >
                    <FaFileInvoice className="text-blue-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Assessments</span>}
                  </NavLink>
  
                  <NavLink 
                    to="/general-report" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-blue-50"
                  >
                    <FaClipboardList className="text-blue-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Exam Results</span>}
                  </NavLink>
                  <NavLink 
                    to="/" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-blue-50"
                  >
                    <FaCalendarAlt className="text-blue-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Timetable</span>}
                  </NavLink>
                </div>
              </div>
            );
          }

          if (item.label === "Finance") {
            return (
              <div key={item.label}>
                <div
                  onClick={toggleFinance}
                  className="flex items-center py-3 px-4 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span>{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3 text-sm font-medium text-gray-700">Finance</span>
                      <span className="ml-auto text-gray-400">
                        {isFinanceOpen ? (
                          <FaChevronDown className="text-xs" />
                        ) : (
                          <FaChevronRight className="text-xs" />
                        )}
                      </span>
                    </>
                  )}
                </div>
                <div
                  className={`bg-gray-50 transition-all duration-300 overflow-hidden ${
                    isFinanceOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <NavLink 
                    to="" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-green-50"
                  >
                    <FaMoneyCheckAlt className="text-green-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Fees Allocation</span>}
                  </NavLink>
                  <NavLink 
                    to="" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-green-50"
                  >
                    <FaReceipt className="text-green-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Fees Structure</span>}
                  </NavLink>
                  <NavLink 
                    to="/fees-payments" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-green-50"
                  >
                    <FaCalculator className="text-green-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Fees Payments</span>}
                  </NavLink>
                  <NavLink 
                    to="" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-green-50"
                  >
                    <FaPiggyBank className="text-green-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Fees Balances</span>}
                  </NavLink>
                  <NavLink 
                    to="" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-green-50"
                  >
                    <FaMoneyBillWave className="text-green-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Expenses</span>}
                  </NavLink>
                  <NavLink 
                    to="/finance" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-green-50"
                  >
                    <FaChartBar className="text-green-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Financial Reports</span>}
                  </NavLink>
                </div>
              </div>
            );
          }

          if (item.label === "Human Resource") {
            return (
              <div key={item.label}>
                <div
                  onClick={toggleHR}
                  className="flex items-center py-3 px-4 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span>{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3 text-sm font-medium text-gray-700">HR</span>
                      <span className="ml-auto text-gray-400">
                        {isHROpen ? (
                          <FaChevronDown className="text-xs" />
                        ) : (
                          <FaChevronRight className="text-xs" />
                        )}
                      </span>
                    </>
                  )}
                </div>
                <div
                  className={`bg-gray-50 transition-all duration-300 overflow-hidden ${
                    isHROpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <NavLink 
                    to="/teachers" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-yellow-50"
                  >
                    <FaChalkboardTeacher className="text-yellow-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Teachers</span>}
                  </NavLink>
                  <NavLink 
                    to="" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-yellow-50"
                  >
                    <FaUserTie className="text-yellow-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Staff</span>}
                  </NavLink>
                  <NavLink 
                    to="" 
                    className="flex items-center py-2 px-6 text-sm hover:bg-gray-100 transition-colors"
                    activeClassName="bg-yellow-50"
                  >
                    <FaMoneyCheck className="text-yellow-400" />
                    {!isSidebarCollapsed && <span className="ml-3 text-gray-600">Payroll</span>}
                  </NavLink>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              to={item.to}
              key={item.to}
              className="flex items-center py-3 px-4 hover:bg-gray-100 transition-colors"
              activeClassName="bg-blue-50"
            >
              <span>{item.icon}</span>
              {!isSidebarCollapsed && <span className="ml-3 text-sm font-medium text-gray-700">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Simple User Profile Footer */}
      <div className="mt-auto border-t border-gray-200 bg-white p-3">
        <div className="flex items-center justify-center">
          <FaUserCircle className="text-xl text-gray-500" />
          {!isSidebarCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{userName}</p>
            </div>
          )}
        </div>
        
        {/* Copyright */}
        <div className="text-center pt-2 text-xs text-gray-400">
          © 2025 Topaz Computer Systems
        </div>
      </div>
    </div>
  );
};

export default SideBar;