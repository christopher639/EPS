import React, { useState } from "react";
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
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/learner", label: "Learners", icon: <FaUsers /> },
  { label: "Academics", icon: <FaBook /> },
  { label: "Finance", icon: <FaMoneyBillAlt /> },
  { to: "/departments", label: "Departments", icon: <FaUniversity /> },
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

  const toggleAcademics = () => setIsAcademicsOpen(!isAcademicsOpen);
  const toggleFinance = () => setIsFinanceOpen(!isFinanceOpen);
  const toggleHR = () => setIsHROpen(!isHROpen);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="md:hidden">
      {/* Hamburger Icon to toggle navigation */}
      <button onClick={toggleNav} className="p-4 focus:outline-none">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Mobile Navigation */}
      <div
        className={`fixed top-[94px] left-0 h-full w-64 bg-blue-800 transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto shadow-lg`}
      >
        {/* Close Button */}
        {/* <button onClick={toggleNav} className="self-end p-4 text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button> */}

        {/* Navigation Links */}
        <div className="flex  flex-col px-4">
          {navItems.map((item) => {
            if (item.label === "Academics") {
              return (
                <div key={item.label} className="w-full">
                  <div
                    onClick={toggleAcademics}
                    className="flex  items-center justify-between py-3 px-4 text-white hover:bg-blue-700 cursor-pointer rounded-lg transition-colors duration-200"
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