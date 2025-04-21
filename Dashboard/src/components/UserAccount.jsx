import React, { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaTimes,
  FaUserCircle,
  FaEnvelope,
  FaMoneyBillWave,
  FaReceipt,
  FaCog,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const UserAccount = () => {
  const [userLinks, setUserLinks] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New message from John Doe",
      date: "2023-10-01",
      read: false,
      type: "message",
      icon: <FaEnvelope className="text-blue-500 text-xs" />,
    },
    {
      id: 2,
      message: "Payment received $500",
      date: "2023-10-02",
      read: false,
      type: "payment",
      icon: <FaMoneyBillWave className="text-green-500 text-xs" />,
    },
    {
      id: 3,
      message: "Expense approved $120",
      date: "2023-10-03",
      read: false,
      type: "expense",
      icon: <FaReceipt className="text-yellow-500 text-xs" />,
    },
    {
      id: 4,
      message: "System maintenance",
      date: "2023-10-04",
      read: false,
      type: "system",
      icon: <FaCog className="text-purple-500 text-xs" />,
    },
  ]);

  const navigate = useNavigate();
  const userLinkRef = useRef(null);

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
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="flex justify-between items-center gap-2 p-2 relative">
      {/* Notification Icon */}
      <div
        className="relative p-1 cursor-pointer"
        onClick={() => setNotificationsOpen(true)}
      >
        <FaBell className="text-slate-800 text-lg" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>

      {/* User Icon */}
      <div
        className="relative p-1 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setUserLinks(true);
        }}
      >
        <FaUserCircle className="text-slate-800 text-lg" />
        {/* User Links Modal */}
        {userLinks && (
          <div
            ref={userLinkRef}
            className="absolute top-full right-0 mt-2 w-40 bg-white shadow-md border border-gray-200 rounded z-50"
            onMouseLeave={() => setUserLinks(false)}
          >
            <NavLink
              to="/profile"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
            >
              <FaUser /> Profile
            </NavLink>
            <NavLink
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm"
            >
              <FaCog /> Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm w-full text-left text-red-600"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Notification Drawer */}
      <div className={`fixed inset-0 z-50 ${notificationsOpen ? "block" : "hidden"}`}>
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setNotificationsOpen(false)}
        />
        <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl rounded-l-lg overflow-hidden transition-transform duration-700 ease-in-out transform">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600 text-sm" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b text-xs">
              {["all", "message", "payment"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 text-center ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-xs">
                  No notifications
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 flex items-start border-b text-xs ${
                      n.read ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="mr-2">{n.icon}</div>
                    <div className="flex-1">
                      <p className="truncate">{n.message}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{n.date}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={n.read}
                      onChange={() => toggleNotificationReadStatus(n.id)}
                      className="h-3 w-3 text-blue-600 rounded flex-shrink-0"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-2 bg-gray-50 flex justify-between text-xs">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() =>
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                }
              >
                Mark all read
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => setNotifications([])}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Username Label */}
      <div className="text-xs">
        {userName ? (
          <span className="font-semibold">{userName.split(" ")[0]}</span>
        ) : (
          <span>Guest</span>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
