import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUniversity, FaFileAlt, FaBook, FaUsers, FaChalkboardTeacher, FaClipboardList, FaMoneyBillAlt, FaChartLine, FaUserCircle, FaChevronRight, FaChevronDown } from "react-icons/fa"; // Importing icons from react-icons

const navItems = [
  { to: "/dashboard", label: "DASHBOARD", icon: <FaTachometerAlt /> },
  { to: "/departments", label: "DEPARTMENTS", icon: <FaUniversity /> },
  {  label: "ACADEMICS", icon: <FaBook /> },
  { to: "/students", label: "STUDENTS", icon: <FaUsers /> },
  { to: "/teachers", label: "TEACHERS", icon: <FaChalkboardTeacher /> },
  { to: "/learningarea", label: "SUBJECTS", icon: <FaClipboardList /> },
  { to: "/parents", label: "PARENTS", icon: <FaUsers /> },
  { to: "/finance", label: "FINANCE", icon: <FaMoneyBillAlt /> },
  { to: "/users", label: "USERS", icon: <FaUsers /> },
  { to: "/analytics", label: "ANALYTICS", icon: <FaChartLine /> }
];

const SideBar = () => {
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);  // State to manage Academics link expansion

  // Toggle the visibility of extra links under "ACADEMICS"
  const toggleAcademics = () => {
    setIsAcademicsOpen(!isAcademicsOpen);
  };

  return (
    <div className="hidden bg-gray-200 border rounded md:flex flex-col min-h-full bg-gray-100 text-white w-[230px] p-4">
      {/* Logo Section */}
      <div className="flex justify-center">
        <NavLink to='/dashboard'>
          <div className="flex justify-center items-center h-8 w-8 md:w-24 md:h-24">
            <img
              className="w-8 h-8 md:w-[70px] md:h-16 bg-gray-200"
              src="KIbabii-Logo.png"
              alt="Logo"
            />
          </div>
        </NavLink>
      </div>
      
      {/* Navigation Links */}
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-custom">
        {navItems.map((item) => {
          if (item.label === "ACADEMICS") {
            return (
              <div key={item.to}>
                <NavLink to={item.to} onClick={toggleAcademics}>
                  <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
                    {item.icon}
                    <li className="list-none text-sm">{item.label}</li>
                    {/* Show the arrow icon based on whether the section is open or closed */}
                    {isAcademicsOpen ? (
                      <FaChevronDown className="ml-auto" />
                    ) : (
                      <FaChevronRight className="ml-auto" />
                    )}
                  </div>
                </NavLink>
                {/* Render extra links if Academics is clicked */}
                {isAcademicsOpen && (
                  <div className="ml-6">
                    <NavLink to="/streams">
                      <div className="flex py-1 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
                        <FaFileAlt />
                        <li className="list-none text-sm">SINGLE REPORT</li>
                      </div>
                    </NavLink>
                    <NavLink to="/mergedmarks">
                      <div className="flex py-1 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
                        <FaFileAlt />
                        <li className="list-none text-sm">MERGED REPORT</li>
                      </div>
                    </NavLink>
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink to={item.to} key={item.to}>
              <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
                {item.icon}
                <li className="list-none text-sm">{item.label}</li>
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
        <FaUserCircle />
        <li className="list-none text-sm">PROFILE</li>
      </div>

      {/* Footer */}
      <div>
        <p className="text-sm ml-4 whitespace-wrap text-black mt-6">© 2024 Bundi</p>
      </div>
    </div>
  );
};

export default SideBar;
