import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUniversity, FaBook, FaUsers, FaChalkboardTeacher, FaClipboardList, FaMoneyBillAlt, FaChartLine, FaUserCircle } from "react-icons/fa"; // Importing icons from react-icons

const navItems = [
  { to: "/dashboard", label: "DASHBOARD", icon: <FaTachometerAlt /> },
  { to: "/departments", label: "DEPARTMENTS", icon: <FaUniversity /> },
  { to: "/streams", label: "ACADEMICS", icon: <FaBook /> },
  { to: "/students", label: "STUDENTS", icon: <FaUsers /> },
  { to: "/teachers", label: "TEACHERS", icon: <FaChalkboardTeacher /> },
  { to: "/learningarea", label: "SUBJECTS", icon: <FaClipboardList /> },
  { to: "/parents", label: "PARENTS", icon: <FaUsers /> },
  { to: "/finance", label: "FINANCE", icon: <FaMoneyBillAlt /> },
  { to: "/users", label: "USERS", icon: <FaUsers /> },
  { to: "/analytics", label: "ANALYTICS", icon: <FaChartLine /> }
];

const SideBar = () => {
  return (
    <div className="hidden bg-gray-200 border rounded md:flex flex-col min-h-full bg-gray-100 text-white w-50 p-4">
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
      {navItems.map((item) => (
        <NavLink to={item.to} key={item.to}>
          <div className="flex  rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
            {item.icon}
            <li className="list-none text-sm">{item.label}</li>
          </div>
        </NavLink>
      ))}
      
      {/* Profile Section */}
      <div className="flex  rounded py-2 text-black  hover:bg-gray-800 hover:text-white w-full px-3 py-1 gap-1">
        <FaUserCircle />
        <li className="list-none text-sm ">PROFILE</li>
      </div>

      {/* Footer */}
      <div>
        <p className="text-sm ml-4 whitespace-wrap text-black mt-6">© 2024 Bundi</p>
      </div>
    </div>
  );
};

export default SideBar;
