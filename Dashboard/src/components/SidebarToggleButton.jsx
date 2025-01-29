import React from "react";
import { FaArrowAltCircleLeft, FaBars, FaTimes } from "react-icons/fa"; // Import the icons

const SidebarToggleButton = ({ toggleSidebar, isSidebarCollapsed }) => {
  return (
    <div
      onClick={toggleSidebar} // This triggers the toggleSidebar function passed from parent
      className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer"
    >
      {isSidebarCollapsed ? <FaBars /> : <FaBars />} {/* Toggle between icons */}
    </div>
  );
};

export default SidebarToggleButton;
