import React, { useState, useEffect } from "react";
import { FaBell, FaTimes, FaUserCircle, FaEnvelope, FaMoneyBillWave, FaReceipt, FaCog } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const UserAccount = () => {
  const [userLinks, setUserLinks] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "New message from John Doe regarding your inquiry.", 
      date: "2023-10-01", 
      read: false,
      type: "message",
      icon: <FaEnvelope className="text-blue-500" />
    },
    { 
      id: 2, 
      message: "Your tuition fee payment of $500 was received.", 
      date: "2023-10-02", 
      read: false,
      type: "payment",
      icon: <FaMoneyBillWave className="text-green-500" />
    },
    { 
      id: 3, 
      message: "New expense approved: Classroom supplies - $120", 
      date: "2023-10-03", 
      read: false,
      type: "expense",
      icon: <FaReceipt className="text-yellow-500" />
    },
    { 
      id: 4, 
      message: "System maintenance scheduled for tomorrow at 2 AM.", 
      date: "2023-10-04", 
      read: false,
      type: "system",
      icon: <FaCog className="text-purple-500" />
    },
    { 
      id: 5, 
      message: "Reminder: Parent-teacher meeting at 10 AM tomorrow.", 
      date: "2023-10-05", 
      read: false,
      type: "message",
      icon: <FaEnvelope className="text-blue-500" />
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const toggleNotificationReadStatus = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, read: !notification.read, readAt: notification.read ? null : new Date() }
          : notification
      )
    );

    if (!notifications.find(notification => notification.id === id)?.read) {
      setTimeout(() => {
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.id !== id)
        );
      }, 3600000);
    }
  };

  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  const unreadCountByType = {
    all: notifications.filter(n => !n.read).length,
    message: notifications.filter(n => !n.read && n.type === "message").length,
    payment: notifications.filter(n => !n.read && n.type === "payment").length,
    expense: notifications.filter(n => !n.read && n.type === "expense").length,
    system: notifications.filter(n => !n.read && n.type === "system").length,
  };

  return (
    <div className="flex justify-between items-center gap-4 px-2">
      {/* Notification Icon */}
      <div className="relative p-2 cursor-pointer" onClick={() => setNotificationsOpen(true)}>
        <div className="relative">
          <FaBell className="text-slate-800 md:text-2xl" />
          {unreadNotificationsCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 md:w-5 md:h-5 flex items-center justify-center">
              {unreadNotificationsCount}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Notification Modal */}
      {notificationsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div 
            className="absolute inset-0 w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full bg-white flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition duration-200"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              {/* Notification Categories */}
              <div className="flex border-b">
                <button
                  className={`flex-1 py-2 text-center text-sm font-medium relative ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab("all")}
                >
                  All
                  {unreadCountByType.all > 0 && (
                    <span className="absolute top-0 right-4 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCountByType.all}
                    </span>
                  )}
                </button>
                <button
                  className={`flex-1 py-2 text-center text-sm font-medium relative ${activeTab === "message" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab("message")}
                >
                  Messages
                  {unreadCountByType.message > 0 && (
                    <span className="absolute top-0 right-4 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCountByType.message}
                    </span>
                  )}
                </button>
                <button
                  className={`flex-1 py-2 text-center text-sm font-medium relative ${activeTab === "payment" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab("payment")}
                >
                  Payments
                  {unreadCountByType.payment > 0 && (
                    <span className="absolute top-0 right-4 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCountByType.payment}
                    </span>
                  )}
                </button>
                <button
                  className={`flex-1 py-2 text-center text-sm font-medium relative ${activeTab === "expense" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab("expense")}
                >
                  Expenses
                  {unreadCountByType.expense > 0 && (
                    <span className="absolute top-0 right-4 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCountByType.expense}
                    </span>
                  )}
                </button>
                <button
                  className={`flex-1 py-2 text-center text-sm font-medium relative ${activeTab === "system" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                  onClick={() => setActiveTab("system")}
                >
                  System
                  {unreadCountByType.system > 0 && (
                    <span className="absolute top-0 right-4 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCountByType.system}
                    </span>
                  )}
                </button>
              </div>

              {/* Scrollable Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No {activeTab === "all" ? "" : activeTab} notifications
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition duration-200 flex items-start ${
                        notification.read ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="mr-3 mt-1">
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        {notification.read && (
                          <p className="text-xs text-gray-500 mt-2">
                            This notification will be deleted in 1 hour.
                          </p>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={notification.read}
                        onChange={() => toggleNotificationReadStatus(notification.id)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 ml-2 mt-1"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              <div className="border-t p-3 bg-gray-50 flex justify-between">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }}
                >
                  Mark all as read
                </button>
                <button
                  className="text-sm text-red-600 hover:text-red-800"
                  onClick={() => {
                    setNotifications([]);
                  }}
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        onMouseEnter={() => setUserLinks(true)}
        onMouseLeave={() => setUserLinks(false)}
      >
        <FaUserCircle className="text-3xl cursor-pointer" />

        {userLinks && (
          <div className="absolute w-48 right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50">
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