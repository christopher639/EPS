import React, { useState, useRef } from "react";
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
  FaHamburger,
  FaBars,
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/learner", label: "Learners", icon: <FaUsers /> },
  { label: "Academics", icon: <FaBook /> },
  { label: "Finance", icon: <FaMoneyBillAlt /> },
  { to: "/departments", label: "Departments", icon: <FaUniversity /> },
   { to: "/clases", label: "Clases", icon: <FaBook /> },
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

  const minSwipeDistance = 50; // Minimum distance to consider it a swipe

  const toggleAcademics = () => setIsAcademicsOpen(!isAcademicsOpen);
  const toggleFinance = () => setIsFinanceOpen(!isFinanceOpen);
  const toggleHR = () => setIsHROpen(!isHROpen);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touchEnd
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
      setIsNavOpen(true); // Open nav on left swipe
    } else if (isRightSwipe && isNavOpen) {
      setIsNavOpen(false); // Close nav on right swipe
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Icon to toggle navigation */}
      <button onClick={toggleNav} className="p-4 focus:outline-none">
        {isNavOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
         <div  className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer"><FaBars/></div>
        )}
      </button>

      {/* Blur backdrop */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-[10px] backdrop-blur-sm z-40"
          onClick={toggleNav}
        ></div>
      )}

      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 h-full rounded-r-2xl w-3/4 bg-blue-800 transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto shadow-lg`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Navigation Links */}
        <div className="flex bg-red-950 py-2 justify-between">
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
        <div className="flex overflow-y-auto mt-1 max-h-[81vh] flex-col px-4">
          {navItems.map((item) => {
            if (item.label === "Academics") {
              return (
                <div key={item.label} className="w-full">
                  <div
                    onClick={toggleAcademics}
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-blue-700 cursor-pointer rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>Academics</span>
                    </div>
                    {isAcademicsOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                  <div
                    className={`pl-8 transition-all bg-yellow-700 duration-500 ease-in-out overflow-hidden ${
                      isAcademicsOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <NavLink
                      to="/addmarks"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileAlt />
                      <span>Upload Marks</span>
                    </NavLink>
                    <NavLink
                      to="/assessments"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileAlt />
                      <span>Assessments</span>
                    </NavLink>
                    <NavLink
                      to="/general-report"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileAlt />
                      <span>General Report</span>
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
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-blue-700 cursor-pointer rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>Finance</span>
                    </div>
                    {isFinanceOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                  <div
                    className={`pl-8 transition-all bg-yellow-700 duration-500 ease-in-out overflow-hidden ${
                      isFinanceOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <NavLink
                      to="/fees-distribution"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileInvoiceDollar />
                      <span>Fees Allocation</span>
                    </NavLink>
                    <NavLink
                      to="/fees-structure"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileInvoiceDollar />
                      <span>Fees Structure</span>
                    </NavLink>
                    <NavLink
                      to="/fees-payments"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileInvoiceDollar />
                      <span>Fees Payments</span>
                    </NavLink>
                    <NavLink
                      to="/expenses"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileInvoiceDollar />
                      <span>Expenses</span>
                    </NavLink>
                    <NavLink
                      to="/finance"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaFileInvoiceDollar />
                      <span>Analytics</span>
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
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-blue-700 cursor-pointer rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>Human Resource</span>
                    </div>
                    {isHROpen ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                  <div
                    className={`pl-8 transition-all bg-yellow-700 duration-500 ease-in-out overflow-hidden ${
                      isHROpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <NavLink
                      to="/teachers"
                      className="flex items-center gap-3 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <FaUserTie />
                      <span>Teachers</span>
                    </NavLink>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                to={item.to}
                key={item.to}
                className="flex items-center gap-3 py-3 px-4 w-full text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                activeClassName="bg-blue-600"
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;