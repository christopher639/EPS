import React, { useState } from "react";
import lion from '../assets/lion.jpg';
import { NavLink } from "react-router-dom";
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
  FaUserFriends,
  FaFileInvoiceDollar,
  FaSchool,
  FaUserTie,
  FaTimes,
  FaBars,
  FaFileUpload,
  FaFileExport,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaReceipt,
  FaCalculator,
  FaPiggyBank,
  FaChartBar,
  FaUserCircle
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/learner", label: "Learners", icon: <FaUsers /> },
  { label: "Academics", icon: <FaBook /> },
  { label: "Finance", icon: <FaMoneyBillAlt /> },
  { to: "/departments", label: "Departments", icon: <FaUniversity /> },
  { to: "/clases", label: "Classes", icon: <FaBook /> },
  { to: "/streams", label: "Streams", icon: <FaSchool /> },
  { to: "/teachers", label: "Teachers", icon: <FaChalkboardTeacher /> },
  { label: "Human Resource", icon: <FaUserTie /> },
  { to: "/learningarea", label: "Learning Areas", icon: <FaClipboardList /> },
  { to: "/parents", label: "Parents", icon: <FaUserFriends /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
  { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
];

const MobileNav = () => {
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isHROpen, setIsHROpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const toggleAcademics = () => setIsAcademicsOpen(!isAcademicsOpen);
  const toggleFinance = () => setIsFinanceOpen(!isFinanceOpen);
  const toggleHR = () => setIsHROpen(!isHROpen);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && !isNavOpen) {
      setIsNavOpen(true);
    } else if (isRightSwipe && isNavOpen) {
      setIsNavOpen(false);
    }
  };

  return (
    <div className="md:hidden ">
      {/* Hamburger Icon */}
      <button onClick={toggleNav} className="p-2 focus:outline-none">
        {isNavOpen ? (
          <FaTimes className="w-6 h-6 text-gray-800" />
        ) : (
          <div className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer">
            <FaBars />
          </div>
        )}
      </button>

      {/* Blur backdrop */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={toggleNav}
        ></div>
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 bg-white transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50  shadow-xl rounded-r-lg`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Logo Section */}
        <div className="p-4  flex rounded-r-lg items-center justify-between border-b border-gray-700">
          <NavLink to="/dashboard" className="flex items-center" onClick={toggleNav}>
            <img
              className="w-12 h-12 bg-white rounded-full object-contain border-2 border-gray-200"
              src={lion}
              alt="Logo"
            />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-black tracking-wider">SAMGE</h1>
              <p className="text-xs text-black">BOARDING SCHOOL</p>
            </div>
          </NavLink>
          <button onClick={toggleNav} className="text-white">
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-4 py-2 max-h-[85vh] overflow-y-auto scrollbar-custom">
          {navItems.map((item) => {
            if (item.label === "Academics") {
              return (
                <div key={item.label} className="w-full">
                  <div
                    onClick={toggleAcademics}
                    className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500">{item.icon}</span>
                      <span className="font-medium">Academics</span>
                    </div>
                    {isAcademicsOpen ? (
                      <FaChevronDown className="text-gray-500" />
                    ) : (
                      <FaChevronRight className="text-gray-500" />
                    )}
                  </div>
                  <div
                    className={`pl-12 transition-all duration-300 overflow-hidden ${
                      isAcademicsOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <NavLink
                      to="/addmarks"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaFileUpload className="text-blue-400" />
                      <span>Upload Marks</span>
                    </NavLink>
                    <NavLink
                      to="/assessments"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaFileAlt className="text-blue-400" />
                      <span>Assessments</span>
                    </NavLink>
                    <NavLink
                      to="/general-report"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaFileExport className="text-blue-400" />
                      <span>General Report</span>
                    </NavLink>
                    <NavLink
                      to="/exam-results"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaClipboardList className="text-blue-400" />
                      <span>Exam Results</span>
                    </NavLink>
                    <NavLink
                      to="/timetable"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaCalendarAlt className="text-blue-400" />
                      <span>Timetable</span>
                    </NavLink>
                  </div>
                </div>
              );
            }

            if (item.label === "Finance") {
              return (
                <div key={item.label} className="w-full">
                  <div
                    onClick={toggleFinance}
                    className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">{item.icon}</span>
                      <span className="font-medium">Finance</span>
                    </div>
                    {isFinanceOpen ? (
                      <FaChevronDown className="text-gray-500" />
                    ) : (
                      <FaChevronRight className="text-gray-500" />
                    )}
                  </div>
                  <div
                    className={`pl-12 transition-all duration-300 overflow-hidden ${
                      isFinanceOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <NavLink
                      to="/fees-distribution"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaMoneyCheckAlt className="text-green-400" />
                      <span>Fees Allocation</span>
                    </NavLink>
                    <NavLink
                      to="/fees-structure"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaReceipt className="text-green-400" />
                      <span>Fees Structure</span>
                    </NavLink>
                    <NavLink
                      to="/fees-payments"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaCalculator className="text-green-400" />
                      <span>Fees Payments</span>
                    </NavLink>
                    <NavLink
                      to="/fees-balances"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaPiggyBank className="text-green-400" />
                      <span>Fees Balances</span>
                    </NavLink>
                    <NavLink
                      to="/expenses"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaFileInvoiceDollar className="text-green-400" />
                      <span>Expenses</span>
                    </NavLink>
                    <NavLink
                      to="/financial-reports"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaChartBar className="text-green-400" />
                      <span>Financial Reports</span>
                    </NavLink>
                  </div>
                </div>
              );
            }

            if (item.label === "Human Resource") {
              return (
                <div key={item.label} className="w-full">
                  <div
                    onClick={toggleHR}
                    className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-500">{item.icon}</span>
                      <span className="font-medium">Human Resource</span>
                    </div>
                    {isHROpen ? (
                      <FaChevronDown className="text-gray-500" />
                    ) : (
                      <FaChevronRight className="text-gray-500" />
                    )}
                  </div>
                  <div
                    className={`pl-12 transition-all duration-300 overflow-hidden ${
                      isHROpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <NavLink
                      to="/teachers"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaUserTie className="text-yellow-400" />
                      <span>Teachers</span>
                    </NavLink>
                    <NavLink
                      to="/staff"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaUserCircle className="text-yellow-400" />
                      <span>Staff</span>
                    </NavLink>
                    <NavLink
                      to="/payroll"
                      className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg"
                      onClick={toggleNav}
                    >
                      <FaMoneyBillAlt className="text-yellow-400" />
                      <span>Payroll</span>
                    </NavLink>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                to={item.to}
                key={item.to}
                className="flex items-center gap-3 py-3 px-4 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                activeClassName="bg-gray-200"
                onClick={toggleNav}
              >
                <span className={
                  item.label === "Dashboard" ? "text-purple-500" :
                  item.label === "Learners" ? "text-blue-500" :
                  item.label === "Departments" ? "text-red-500" :
                  item.label === "Classes" ? "text-blue-500" :
                  item.label === "Streams" ? "text-indigo-500" :
                  item.label === "Teachers" ? "text-yellow-500" :
                  item.label === "Learning Areas" ? "text-indigo-500" :
                  item.label === "Parents" ? "text-pink-500" :
                  item.label === "Users" ? "text-teal-500" :
                  item.label === "Analytics" ? "text-orange-500" : "text-gray-500"
                }>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-xl text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;