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

// Icon color mapping for consistent styling
const iconColors = {
  Dashboard: "text-purple-600",
  Learners: "text-blue-600",
  Academics: "text-blue-600",
  Finance: "text-green-600",
  Departments: "text-red-600",
  Classes: "text-indigo-600",
  Streams: "text-indigo-600",
  Teachers: "text-amber-600",
  "Human Resource": "text-amber-600",
  "Learning Areas": "text-violet-600",
  Parents: "text-pink-600",
  Users: "text-teal-600",
  "School Performance": "text-orange-600",
  "Upload Marks": "text-blue-500",
  Assessments: "text-blue-500",
  "Exams Results": "text-blue-500",
  Timetable: "text-blue-500",
  "Fees Allocation": "text-green-500",
  "Fees Structure": "text-green-500",
  "Fees Payments": "text-green-500",
  "Fees Balances": "text-green-500",
  Expenses: "text-green-500",
  "Financial Reports": "text-green-500",
  Staff: "text-amber-500",
  Payroll: "text-amber-500"
};

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
  { to: "/analytics", label: "School Performance", icon: <FaChartLine /> },
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
    <div className="md:hidden">
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
        className={`fixed top-0 left-0 h-full w-4/5 bg-white transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-xl rounded-r-lg`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Logo Section */}
        <div className="p-4 flex rounded-r-lg items-center justify-between border-b border-gray-200">
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
          <button onClick={toggleNav} className="text-gray-500">
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-4 py-2 max-h-[70vh] overflow-y-auto no-scrollbar divide-y divide-gray-100">
          {navItems.map((item) => {
            if (item.label === "Academics") {
              return (
                <React.Fragment key={item.label}>
                  <div className="w-full border-t border-gray-100 first:border-t-0">
                    <div
                      onClick={toggleAcademics}
                      className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={iconColors[item.label]}>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
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
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaFileUpload className={iconColors["Upload Marks"]} />
                        <span>Upload Marks</span>
                      </NavLink>
                      <NavLink
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaFileAlt className={iconColors["Assessments"]} />
                        <span>Assessments</span>
                      </NavLink>
                      <NavLink
                        to="/general-report"
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaFileExport className={iconColors["Exams Results"]} />
                        <span>Exams Results</span>
                      </NavLink>
                      <NavLink
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                        onClick={toggleNav}
                      >
                        <FaCalendarAlt className={iconColors["Timetable"]} />
                        <span>Timetable</span>
                      </NavLink>
                    </div>
                  </div>
                </React.Fragment>
              );
            }

            if (item.label === "Finance") {
              return (
                <React.Fragment key={item.label}>
                  <div className="w-full border-t border-gray-100">
                    <div
                      onClick={toggleFinance}
                      className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={iconColors[item.label]}>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
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
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaMoneyCheckAlt className={iconColors["Fees Allocation"]} />
                        <span>Fees Allocation</span>
                      </NavLink>
                      <NavLink
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaReceipt className={iconColors["Fees Structure"]} />
                        <span>Fees Structure</span>
                      </NavLink>
                      <NavLink
                        to="/fees-payments"
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaCalculator className={iconColors["Fees Payments"]} />
                        <span>Fees Payments</span>
                      </NavLink>
                      <NavLink
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaPiggyBank className={iconColors["Fees Balances"]} />
                        <span>Fees Balances</span>
                      </NavLink>
                      <NavLink
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaFileInvoiceDollar className={iconColors["Expenses"]} />
                        <span>Expenses</span>
                      </NavLink>
                      <NavLink
                        to="/finance"
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                        onClick={toggleNav}
                      >
                        <FaChartBar className={iconColors["Financial Reports"]} />
                        <span>Financial Reports</span>
                      </NavLink>
                    </div>
                  </div>
                </React.Fragment>
              );
            }

            if (item.label === "Human Resource") {
              return (
                <React.Fragment key={item.label}>
                  <div className="w-full border-t border-gray-100">
                    <div
                      onClick={toggleHR}
                      className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={iconColors[item.label]}>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
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
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaUserTie className={iconColors["Teachers"]} />
                        <span>Teachers</span>
                      </NavLink>
                      <NavLink
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg border-b border-gray-100"
                        onClick={toggleNav}
                      >
                        <FaUserCircle className={iconColors["Staff"]} />
                        <span>Staff</span>
                      </NavLink>
                      <NavLink
                        to=""
                        className="flex items-center gap-3 py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                        onClick={toggleNav}
                      >
                        <FaMoneyBillAlt className={iconColors["Payroll"]} />
                        <span>Payroll</span>
                      </NavLink>
                    </div>
                  </div>
                </React.Fragment>
              );
            }

            return (
              <div key={item.to} className="border-t border-gray-100 first:border-t-0">
                <NavLink
                  to={item.to}
                  className="flex items-center gap-3 py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  activeClassName="bg-gray-100"
                  onClick={toggleNav}
                >
                  <span className={iconColors[item.label]}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </div>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div>© 2025 Topaz Computer Systems</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;