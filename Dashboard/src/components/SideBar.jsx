import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUniversity, FaBook, FaUsers, FaChalkboardTeacher, FaClipboardList, FaMoneyBillAlt, FaChartLine, FaUserCircle, FaChevronRight, FaChevronDown, FaFileAlt } from "react-icons/fa"; // Importing icons from react-icons

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
  { to: "/analytics", label: "Analytics", icon: <FaChartLine /> }
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
          if (item.label === "Academics") {
            return (
              <div key={item.label}>
                <div onClick={toggleAcademics} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1 cursor-pointer">
                  {item.icon}
                  <li className="list-none ">{item.label}</li>
                  {/* Show the arrow icon based on whether the section is open or closed */}
                  {isAcademicsOpen ? (
                    <FaChevronDown className="ml-auto" />
                  ) : (
                    <FaChevronRight className="ml-auto" />
                  )}
                </div>
                {/* Render extra links if Academics is clicked */}
                {isAcademicsOpen && (
                  <div className="ml-6">
                    <NavLink to="/assessments">
                      <div className="flex py-1 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
                        <FaFileAlt />
                        <li className="list-none">Assessments</li>
                      </div>
                    </NavLink>
                    <NavLink to="/merged-assessment">
                      <div className="flex py-1 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
                        <FaFileAlt />
                        <li className="list-none ">ALL Assessments</li>
                      </div>
                    </NavLink>
                    <NavLink to="/general-report">
                      <div className="flex py-1 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
                        <FaFileAlt />
                        <li className="list-none ">General Report</li>
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
                <li className="list-none ">{item.label}</li>
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
