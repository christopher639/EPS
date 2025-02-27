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
} from "react-icons/fa"; // Importing icons from react-icons

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/learner", label: "Leaners", icon: <FaUsers /> },
  { label: "Academics", icon: <FaBook /> },
  { label: "Finance", icon: <FaMoneyBillAlt /> },
  { to: "/departments", label: "Departments", icon: <FaUniversity /> },
  { to: "/streams", label: "Streams", icon: <FaBook /> },
  { to: "/teachers", label: "Teachers", icon: <FaChalkboardTeacher /> },
  { label: "Human Resource", icon: <FaChalkboardTeacher /> },
  { to: "/learningarea", label: "Learning Areas", icon: <FaClipboardList /> },
  { to: "/parents", label: "Parents", icon: <FaUsers /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
  { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
];

const SideBar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false); // State to manage Academics section
  const [isFinanceOpen, setIsFinanceOpen] = useState(false); // State to manage Finance section
  const [isHROpen, setIsHROpen] = useState(false); // State to manage HR section

  const toggleAcademics = () => {
    setIsAcademicsOpen(!isAcademicsOpen); // Toggle Academics section
  };

  const toggleFinance = () => {
    setIsFinanceOpen(!isFinanceOpen); // Toggle Finance section
  };

  const toggleHR = () => {
    setIsHROpen(!isHROpen); // Toggle HR section
  };

  return (
    <div
      className={`transition-all   duration-700 bg-blue-800 min-h-screen md:flex flex-col ${isSidebarCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo Section */}
      <div className="flex bg-red-950 py-2 justify-between ">
        <NavLink to="/dashboard" className="flex justify-between">
          <div className="flex justify-between gap-5">
            <div>
              <img
                className="w-16 bg-white rounded-full h-16 object-contain"
                src={lion}
                alt="Logo"
              />
            </div>
            <div className="mt-2">
              <p className="text-white flex gap-4 font-bold text-2xl">
                <p>S</p>
                <p>A</p>
                <p>M</p>
                <p>G</p>
                <p>E</p>
              </p>
              <div className="flex">
                <p className="flex gap-1 text-[12px] text-white">
                  <p>B</p>
                  <p>O</p>
                  <p>R</p>
                  <p>D</p>
                  <p>I</p>
                  <p>N</p>
                  <p>G</p>
                </p>
                <p className="pl-1 flex gap-1 text-[12px] text-white">
                  <p>S</p>
                  <p>C</p>
                  <p>H</p>
                  <p>O</p>
                  <p>O</p>
                  <p>L</p>
                </p>
              </div>
            </div>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto max-h-[88vh] flex flex-col">
        {navItems.map((item) => {
          if (item.label === "Academics") {
            return (
              <div className="" key={item.label}>
                <div
                  onClick={toggleAcademics}
                  className="flex items-center justify-start gap-7 py-2 px-5 text-white hover:bg-gray-700 cursor-pointer rounded-md"
                >
                  {item.icon}
                  {!isSidebarCollapsed && <span>Academics</span>}
                  {isAcademicsOpen ? <FaChevronDown className="text-xl" /> : <FaChevronRight className="text-xl" />}
                </div>
                <div
                  className={`bg-yellow-700 transition-all duration-500 ease-in-out overflow-hidden ${isAcademicsOpen ? "max-h-96" : "max-h-0"}`}
                >
                    <NavLink to="/addmarks" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Upload Marks</span>}
                  </NavLink>
                  <NavLink to="/assessments" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Assessments</span>}
                  </NavLink>
                  <NavLink to="/merged-assessment" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Merged Assessment</span>}
                  </NavLink>
                  <NavLink to="/general-report" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">General Report</span>}
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
                  className="flex items-center justify-start gap-7 py-2 px-5 text-white hover:bg-gray-700 cursor-pointer rounded-md"
                >
                  {item.icon}
                  {!isSidebarCollapsed && <span>Financials</span>}
                  {isFinanceOpen ? <FaChevronDown className="text-xl" /> : <FaChevronRight className="text-xl" />}
                </div>
                <div
                  className={`bg-yellow-700 transition-all duration-500 ease-in-out overflow-hidden ${isFinanceOpen ? "max-h-96" : "max-h-0"}`}
                >
                  <NavLink to="/fees-distribution" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Fees Allocation</span>}
                  </NavLink>
                  <NavLink to="/fees-structure" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Fees Structure</span>}
                  </NavLink>
                  <NavLink to="/fees-payments" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Fees Payments</span>}
                  </NavLink>
                  <NavLink to="/learner" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Fees Balances</span>}
                  </NavLink>
                  <NavLink to="/expenses" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Expenses</span>}
                  </NavLink>
                  <NavLink to="/finance" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Analytics</span>}
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
                  className="flex items-center justify-start gap-7 py-1 px-5 text-white hover:bg-gray-700 cursor-pointer rounded-md"
                >
                  {item.icon}
                  {!isSidebarCollapsed && <span>H R</span>}
                  {isHROpen ? <FaChevronDown className="text-xl" /> : <FaChevronRight className="text-xl" />}
                </div>
                <div
                  className={`bg-yellow-700 transition-all duration-500 ease-in-out overflow-hidden ${isHROpen ? "max-h-96" : "max-h-0"}`}
                >
                  <NavLink to="/teachers" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Teachers</span>}
                  </NavLink>
                  <NavLink to="/director" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Director</span>}
                  </NavLink>
                  <NavLink to="/record-keeping" className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                    <FaFileAlt className="text-white text-2xl" />
                    {!isSidebarCollapsed && <span className="pl-4">Record Keeping</span>}
                  </NavLink>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              to={item.to}
              key={item.to}
              className="flex px-2 items-center pr-8 py-1 hover:bg-yellow-700 text-white mb-2"
              activeClassName="bg-gray-600"
            >
              <div className="text-white px-2 text-2xl">{item.icon}</div>
              {!isSidebarCollapsed && <span className="ml-4">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs bottom-0">
          <p>© 2025 Bundi</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
