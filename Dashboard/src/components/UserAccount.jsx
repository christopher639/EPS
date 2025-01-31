import React, { useState, useEffect } from "react"; 
import { FaBell, FaUserCircle } from "react-icons/fa"; // Importing icons from react-icons
import { useNavigate } from "react-router-dom"; // For logout functionality

const UserAccount = () => {
  const [userLinks, setUserLinks] = useState(false);
  const [userName, setUserName] = useState(""); // State to hold the username
  const navigate = useNavigate(); // Used for navigation

  useEffect(() => {
    // Get the username from localStorage if available
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName); // Set username if found
    }
  }, []);

  const handleLogout = () => {
    // Remove token and username from localStorage to log the user out
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login"); // Redirect to login page
  };


  return (
    <div className="flex justify-between  gap-1">
      <div className="p-1 flex">
        <FaBell className="text-slate-800 text-lg" />
        <p className="text-sm text-red-600">2</p>
      </div>
      <div>
        {/* Display welcome message with the username */}
        {userName ? <div className="flex gap-1"><p>Hi</p> <p  className="font-bold">{userName}</p> </div>: <p>Guest</p>}
      </div>
      <div
        className="relative px-3"
        onMouseEnter={() => setUserLinks(true)} // Show user links on hover
        onMouseLeave={() => setUserLinks(false)} // Hide user links when cursor leaves
      >
        <FaUserCircle className="text-3xl" />
        {/* Show user options when hovering */}
        {userLinks && (
          <div className="absolute w-32 right-0 px-2 bg-white shadow-md rounded-md ">
            <p className="cursor-pointer text-slate-900" onClick={() => navigate("/profile")}>
              Profile
            </p>
            <p
              className="cursor-pointer text-red-500"
              onClick={handleLogout}
            >
              Log out
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
