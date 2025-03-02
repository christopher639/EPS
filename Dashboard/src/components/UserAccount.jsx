import React, { useState, useEffect } from "react";
import { FaBell, FaTimes, FaUserCircle } from "react-icons/fa"; // Importing icons from react-icons
import { NavLink, useNavigate } from "react-router-dom"; // For logout functionality

const UserAccount = () => {
  const [userLinks, setUserLinks] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State to hold the username
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your profile has been updated successfully.", date: "2023-10-01", read: false },
    { id: 2, message: "You have a new message from John Doe.", date: "2023-10-02", read: false },
    { id: 3, message: "Your payment was successful.", date: "2023-10-03", read: false },
    { id: 4, message: "Reminder: Meeting at 10 AM tomorrow.", date: "2023-10-04", read: false },
    { id: 5, message: "Your subscription is about to expire.", date: "2023-10-05", read: false },
  ]); // Example notifications with read status

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

  // Mark a notification as read or unread
  const toggleNotificationReadStatus = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read, readAt: notification.read ? null : new Date() }
          : notification
      )
    );

    // If marking as read, set a timeout to delete the notification after 1 hour
    if (!notifications.find((notification) => notification.id === id)?.read) {
      setTimeout(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== id)
        );
      }, 3600000); // 1 hour in milliseconds
    }
  };

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="flex justify-between items-center gap-4 px-2">
      {/* Notification Icon and Modal */}
      <div
        className="relative p-2 cursor-pointer"
        onClick={() => setNotificationsOpen(!notificationsOpen)} // Toggle notifications on click
      >
        <div className="relative">
          <FaBell className="text-slate-800 md:text-2xl" />
          {/* Notification Counter */}
          {unreadNotificationsCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 md:w-5 md:h-5 flex items-center justify-center">
              {unreadNotificationsCount}
            </div>
          )}
        </div>

        {/* Notification Modal */}
        {notificationsOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-80 bg-white shadow-lg rounded-md border border-gray-200">
              <div className="p-4">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition duration-200"
                  >
                    <FaTimes className="text-gray-600" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition duration-200 ${
                        notification.read ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notification.read}
                          onChange={() => toggleNotificationReadStatus(notification.id)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>
                      {notification.read && (
                        <p className="text-xs text-gray-500 mt-2">
                          This notification will be deleted in 1 hour.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Greeting */}
      <div>
        {userName ? (
          <div className="flex gap-1">
            <p>Hi</p>
            <p className="font-bold">{userName}</p>
          </div>
        ) : (
          <p>Guest</p>
        )}
      </div>

      {/* User Icon and Dropdown */}
      <div
        className="relative p-2"
        onMouseEnter={() => setUserLinks(true)} // Show user links on hover
        onMouseLeave={() => setUserLinks(false)} // Hide user links when cursor leaves
      >
        <FaUserCircle className="text-3xl cursor-pointer" />

        {/* User Dropdown with Arrow */}
        {userLinks && (
          <div className="absolute w-48 right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50">
            {/* Arrow */}
            <div className="absolute -top-2 right-3 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
            <div className="py-2">
              <NavLink to="/profile">
                <p className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                  Profile
                </p>
              </NavLink>
              <NavLink to="/settings">
                <p className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                  Settings
                </p>
              </NavLink>
              <NavLink to="/help">
                <p className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">
                  Help & Support
                </p>
              </NavLink>
              <p
                className="cursor-pointer px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition duration-200"
                onClick={handleLogout}
              >
                Log Out
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;