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
  { to: "/students", label: "Students", icon: <FaUsers /> },
  { label: "Academics", icon: <FaBook /> },
  { to: "/departments", label: "Departments", icon: <FaUniversity /> },
  { to: "/streams", label: "Streams", icon: <FaBook /> },
  { to: "/teachers", label: "Teachers", icon: <FaChalkboardTeacher /> },
  { to: "/learningarea", label: "Learning Areas", icon: <FaClipboardList /> },
  { to: "/parents", label: "Parents", icon: <FaUsers /> },
  { to: "/finance", label: "Finance", icon: <FaMoneyBillAlt /> },
  { to: "/users", label: "Users", icon: <FaUsers /> },
  { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
];

const SideBar = ({ isSidebarCollapsed, toggleSidebar }) => {
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
      className={`transition-all    duration-700 bg-blue-800 min-h-screen md:flex flex-col ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } `}
    >
      {/* Logo Section */}
      <div className="flex  bg-red-950 py-2  justify-between mb-2">
        <NavLink to="/dashboard" className="flex justify-between">
       <div className="flex justify-between  gap-5  ">
     <div>
     <img
            className="w-16 bg-white  rounded-full h-16 object-contain"
          src={lion} alt="Logo"
          />
     </div>
          <div  className="mt-2">
            <p className="text-white flex gap-4 font-bold text-2xl">
              <p>S</p>
              <p>A</p>
              <p>M</p>
              <p>G</p>
              <p>E</p>
            </p>
            
           <div className="flex">
            <p className="  flex gap-1 text-[12px] text-white">
                  <p>B</p>
                  <p>O</p>
                  <p>R</p>
                  <p>D</p>
                  <p>I</p>
                  <p>N</p>
                  <p>G</p>
            </p>
             <p className=" pl-3 flex gap-1 text-[12px] text-white">
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
      <div className="flex-1   max-h-[80vh]  flex flex-col">
        {navItems.map((item) => {
          if (item.label === "Academics") {
            return (
              <div
                key={item.label}
                onClick={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  onClick={toggleAcademics}
                  className="flex items-center justify-between  py-2 px-5  text-white hover:bg-gray-700 cursor-pointer rounded-md"
                >
                  {item.icon}
                  {!isSidebarCollapsed && (
                    <span className="">Academics</span>
                  )}
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
                  <NavLink to="/assessments">
                    <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                      <FaFileAlt className="text-white text-2xl" />
                      {!isSidebarCollapsed && <span className="pl-4">Assessments</span>}
                    </div>
                  </NavLink>
                  <NavLink to="/merged-assessment">
                    <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                      <FaFileAlt className="text-white text-2xl" />
                      {!isSidebarCollapsed && <span className="pl-4">Merged Assessment</span>}
                    </div>
                  </NavLink>
                  <NavLink to="/general-report">
                    <div className="flex items-center gap-2 py-1 px-4 text-white hover:bg-gray-900 rounded-md">
                      <FaFileAlt className="text-white text-2xl" />
                      {!isSidebarCollapsed && <span className="pl-4">General Report</span>}
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
              {!isSidebarCollapsed && <span className="ml-8">{item.label}</span>}
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

export default SideBar;
