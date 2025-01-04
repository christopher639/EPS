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
  FaUserCircle,
  FaChevronRight,
  FaChevronDown,
  FaFileAlt,
} from "react-icons/fa"; // Importing icons from react-icons

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/departments", label: "Departments", icon: <FaUniversity /> },
  { label: "Academics", icon: <FaBook /> },
  { to: "/students", label: "Students", icon: <FaUsers /> },
  { to: "/teachers", label: "Teachers", icon: <FaChalkboardTeacher /> },
  { to: "/learningarea", label: "Subjects", icon: <FaClipboardList /> },
  { to: "/parents", label: "Parents", icon: <FaUsers /> },
  { to: "/finance", label: "Finance", icon: <FaMoneyBillAlt /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
  { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
];

const SideBar = () => {
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false); // State to manage Academics link expansion

  // Toggle the visibility of extra links under "ACADEMICS"
  const toggleAcademics = () => {
    setIsAcademicsOpen(!isAcademicsOpen);
  };

  return (
    <div className="hidden md:flex flex-col bg-gray-800 text-white min-h-full w-64 p-4">
      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <NavLink to="/dashboard">
          <img
            className="w-16 h-16 object-contain"
            src="KIbabii-Logo.png"
            alt="Logo"
          />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.label === "Academics") {
            return (
              <div key={item.label}>
                <div
                  onClick={toggleAcademics}
                  className="flex items-center justify-between px-4 py-2 text-white hover:bg-gray-700 cursor-pointer rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isAcademicsOpen ? (
                    <FaChevronDown className="text-xl" />
                  ) : (
                    <FaChevronRight className="text-xl" />
                  )}
                </div>
                {/* Render extra links if Academics is clicked */}
                {isAcademicsOpen && (
                  <div className="ml-6 mt-2">
                    <NavLink to="/assessments">
                      <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-700 rounded-md">
                        <FaFileAlt />
                        <span>Assessments</span>
                      </div>
                    </NavLink>
                    <NavLink to="/merged-assessment">
                      <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-700 rounded-md">
                        <FaFileAlt />
                        <span>Term Assessments</span>
                      </div>
                    </NavLink>
                    <NavLink to="/general-report">
                      <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-700 rounded-md">
                        <FaFileAlt />
                        <span>General Report</span>
                      </div>
                    </NavLink>
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink
              to={item.to}
              key={item.to}
              className="flex items-center px-4 py-2 text-white hover:bg-gray-700 rounded-md mb-2"
              activeClassName="bg-gray-600"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="flex items-center px-4 py-2 text-white hover:bg-gray-700 cursor-pointer rounded-md mt-4">
        <FaUserCircle />
        <span className="ml-2 text-sm">PROFILE</span>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-gray-400 text-xs">
        <p>© 2025 Bundi</p>
      </div>
    </div>
  );
};

export default SideBar;
