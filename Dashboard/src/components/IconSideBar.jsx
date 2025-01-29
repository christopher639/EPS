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
} from "react-icons/fa"; // Importing icons from react-icons
import UserAccount from "./UserAccount";

const navItems = [
  { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
  { to: "/students", icon: <FaUsers />, label: "Students" },
  { label: "Academics", icon: <FaBook /> },
  { to: "/departments", icon: <FaUniversity />, label: "Departments" },
  { to: "/streams", icon: <FaBook />, label: "Streams" },
  { to: "/teachers", icon: <FaChalkboardTeacher />, label: "Teachers" },
  { to: "/learningarea", icon: <FaClipboardList />, label: "Learning Area" },
  { to: "/parents", icon: <FaUsers />, label: "Parents" },
  { to: "/finance", icon: <FaMoneyBillAlt />, label: "Finance" },
  { to: "/users", icon: <FaUsers />, label: "Users" },
  { to: "/analytics", icon: <FaChartLine />, label: "Analytics" },
];

const IconSideBar = () => {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar open/close
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false); // State to manage Academics section

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/close
  };

  const toggleAcademics = () => {
    setIsAcademicsOpen(!isAcademicsOpen); // Toggle the Academics section
  };

  return (
    <div className="bg-gray-800 text-white min-h-full w-20 p-4 ">
      {/* Logo Section (Only visible when sidebar is open) */}
      {isOpen && (
        <div className="ml-2">
          <NavLink to="/dashboard">
            <img
              className="w-8 h-8 object-contain"
              src="KIbabii-Logo.png"
              alt="Logo"
            />
          </NavLink>
        </div>
      )}

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
                  {item.icon}
                  {isAcademicsOpen ? (
                    <FaChevronDown className="text-xl" />
                  ) : (
                    <FaChevronRight className="text-xl" />
                  )}
                </div>
                {/* Render extra links if Academics is clicked */}
                {isAcademicsOpen && isOpen && (
                  <div className=" mt-2">
                    <NavLink to="/assessments">
                      <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-700 rounded-md">
                        <FaFileAlt />
                      </div>
                    </NavLink>
                    <NavLink to="/merged-assessment">
                      <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-700 rounded-md">
                        <FaFileAlt />
                      </div>
                    </NavLink>
                    <NavLink to="/general-report">
                      <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-700 rounded-md">
                        <FaFileAlt />
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
              className="relative flex items-center px-4 py-2 text-white rounded-md mb-2"
              activeClassName="bg-gray-600"
            >
              {/* The label text will appear on hover */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0  transition-opacity">
                {item.label}
              </div>

              {/* Icon */}
              {item.icon}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default IconSideBar;
