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

const navItems = [
  { to: "", label: "Dashboard", icon: <FaTachometerAlt /> },
  { label: "Academics", icon: <FaBook /> },
  { to: "/", label: "Lessons", icon: <FaUniversity /> },
  { to: "/", label: "Assignments", icon: <FaBook /> },
  { to: "/", label: "Finance", icon: <FaChalkboardTeacher /> },
  { to: "/", label: "LMS", icon: <FaClipboardList /> },
  { to: "/", label: "Time Table", icon: <FaUsers /> },
  { to: "/", label: "Notices", icon: <FaMoneyBillAlt /> },
  { to: "/", label: "News", icon: <FaUsers /> },
  { to: "/", label: "Analytics", icon: <FaChartLine /> },
];

const StudentSideBar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false); // State to manage Academics section

  const toggleAcademics = () => {
    setIsAcademicsOpen(!isAcademicsOpen); // Toggle Academics section
  };

  // On mouse enter, open the Academics section, on mouse leave, close it
  const handleMouseEnter = () => {
    setIsAcademicsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsAcademicsOpen(false);
  };

  return (
    <div
      className={`transition-all  duration-700 bg-gray-900 min-h-screen md:flex flex-col ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } `}
    >
      {/* Logo Section */}
      <div className="flex  justify-center mb-2">
        <NavLink to="">
          <img
            className="w-20 h-20 object-contain"
            src="KIbabii-Logo.png"
            alt="Logo"
          />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1   max-h-[80vh]  flex flex-col">
        {navItems.map((item) => {
          if (item.label === "Academics") {
            return (
              <div
                key={item.label}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  onClick={toggleAcademics}
                  className="flex items-center justify-between  py-2 px-5  text-white hover:bg-gray-700 cursor-pointer rounded-md"
                >
                  {item.icon}
                  {!isSidebarCollapsed && <span className="">Academics</span>}
                  {isAcademicsOpen ? (
                    <FaChevronDown className="text-xl" />
                  ) : (
                    <FaChevronRight className="text-xl" />
                  )}
                </div>
                {/* Render extra links if Academics is clicked */}
                <div
                  className={`mt-2 bg-yellow-700 hover:p-2 transition-all duration-500 ease-in-out overflow-hidden ${
                    isAcademicsOpen ? "max-h-96" : "max-h-0"
                  }`} // Apply max-height and transition to create a smooth opening/closing
                >
                  <NavLink to="">
                    <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                      <FaFileAlt className="text-white text-2xl" />
                      {!isSidebarCollapsed && (
                        <span className="pl-4">Notes</span>
                      )}
                    </div>
                  </NavLink>
                  <NavLink to="">
                    <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                      <FaFileAlt className="text-white text-2xl" />
                      {!isSidebarCollapsed && (
                        <span className="pl-4">Lessons</span>
                      )}
                    </div>
                  </NavLink>
                  <NavLink to="">
                    <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                      <FaFileAlt className="text-white text-2xl" />
                      {!isSidebarCollapsed && (
                        <span className="pl-4">Assignments</span>
                      )}
                    </div>
                  </NavLink>
                  <NavLink to="">
                    <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                      <FaFileAlt className="text-white text-2xl" />
                      {!isSidebarCollapsed && (
                        <span className="pl-4">Performance</span>
                      )}
                    </div>
                  </NavLink>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              to={item.to}
              key={item.to}
              className=" flex px-2 items-center pr-8  py-1 hover:bg-yellow-700  text-white  mb-2"
              activeClassName="bg-gray-600"
            >
              <div className="text-white px-2  text-2xl">{item.icon}</div>
              {!isSidebarCollapsed && (
                <span className="ml-8">{item.label}</span>
              )}
            </NavLink>
          );
        })}

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs bottom-0 ">
          <p>© 2025 Bundi</p>
        </div>
      </div>
    </div>
  );
};

export default StudentSideBar;
