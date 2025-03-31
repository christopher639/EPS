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
      message: "New message from John Doe", 
      date: "2023-10-01", 
      read: false,
      type: "message",
      icon: <FaEnvelope className="text-blue-500 text-xs" />
    },
    { 
      id: 2, 
      message: "Payment received $500", 
      date: "2023-10-02", 
      read: false,
      type: "payment",
      icon: <FaMoneyBillWave className="text-green-500 text-xs" />
    },
    { 
      id: 3, 
      message: "Expense approved $120", 
      date: "2023-10-03", 
      read: false,
      type: "expense",
      icon: <FaReceipt className="text-yellow-500 text-xs" />
    },
    { 
      id: 4, 
      message: "System maintenance", 
      date: "2023-10-04", 
      read: false,
      type: "system",
      icon: <FaCog className="text-purple-500 text-xs" />
    },
    { 
      id: 1, 
      message: "New message from John Doe", 
      date: "2023-10-01", 
      read: false,
      type: "message",
      icon: <FaEnvelope className="text-blue-500 text-xs" />
    },
    { 
      id: 2, 
      message: "Payment received $500", 
      date: "2023-10-02", 
      read: false,
      type: "payment",
      icon: <FaMoneyBillWave className="text-green-500 text-xs" />
    },
    { 
      id: 3, 
      message: "Expense approved $120", 
      date: "2023-10-03", 
      read: false,
      type: "expense",
      icon: <FaReceipt className="text-yellow-500 text-xs" />
    },
    { 
      id: 4, 
      message: "System maintenance", 
      date: "2023-10-04", 
      read: false,
      type: "system",
      icon: <FaCog className="text-purple-500 text-xs" />
    },
    { 
      id: 1, 
      message: "New message from John Doe", 
      date: "2023-10-01", 
      read: false,
      type: "message",
      icon: <FaEnvelope className="text-blue-500 text-xs" />
    },
    { 
      id: 2, 
      message: "Payment received $500", 
      date: "2023-10-02", 
      read: false,
      type: "payment",
      icon: <FaMoneyBillWave className="text-green-500 text-xs" />
    },
    { 
      id: 3, 
      message: "Expense approved $120", 
      date: "2023-10-03", 
      read: false,
      type: "expense",
      icon: <FaReceipt className="text-yellow-500 text-xs" />
    },
    { 
      id: 4, 
      message: "System maintenance", 
      date: "2023-10-04", 
      read: false,
      type: "system",
      icon: <FaCog className="text-purple-500 text-xs" />
    },
    { 
      id: 1, 
      message: "New message from John Doe", 
      date: "2023-10-01", 
      read: false,
      type: "message",
      icon: <FaEnvelope className="text-blue-500 text-xs" />
    },
    { 
      id: 2, 
      message: "Payment received $500", 
      date: "2023-10-02", 
      read: false,
      type: "payment",
      icon: <FaMoneyBillWave className="text-green-500 text-xs" />
    },
    { 
      id: 3, 
      message: "Expense approved $120", 
      date: "2023-10-03", 
      read: false,
      type: "expense",
      icon: <FaReceipt className="text-yellow-500 text-xs" />
    },
    { 
      id: 4, 
      message: "System maintenance", 
      date: "2023-10-04", 
      read: false,
      type: "system",
      icon: <FaCog className="text-purple-500 text-xs" />
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
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
  };

  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  return (
    <div className="flex justify-between items-center gap-2 p-2">
      {/* Notification Icon */}
      <div className="relative p-1 cursor-pointer" onClick={() => setNotificationsOpen(true)}>
        <div className="relative">
          <FaBell className="text-slate-800 text-lg" />
          {unreadNotificationsCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center">
              {unreadNotificationsCount}
            </div>
          )}
        </div>
      </div>

      {/* Notification Drawer */}
      <div className={`fixed inset-0 z-50 ${notificationsOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-700 ${notificationsOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setNotificationsOpen(false)}
        />
        
        {/* Drawer Content */}
        <div 
          className={`absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl transition-transform duration-700 ease-in-out transform ${notificationsOpen ? 'translate-x-0' : 'translate-x-full'} rounded-l-lg overflow-hidden`}
        >
          <div className="flex flex-col h-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600 text-sm" />
              </button>
            </div>

            {/* Notification Categories */}
            <div className="flex border-b text-xs">
              <button
                className={`flex-1 py-2 text-center ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
              <button
                className={`flex-1 py-2 text-center ${activeTab === "message" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("message")}
              >
                Messages
              </button>
              <button
                className={`flex-1 py-2 text-center ${activeTab === "payment" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("payment")}
              >
                Payments
              </button>
            </div>

            {/* Scrollable Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-xs">
                  No notifications
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 flex items-start ${notification.read ? "bg-gray-50" : "bg-white"} border-b border-gray-100`}
                  >
                    <div className="mr-2">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{notification.message}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{notification.date}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notification.read}
                      onChange={() => toggleNotificationReadStatus(notification.id)}
                      className="h-3 w-3 text-blue-600 rounded flex-shrink-0"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t p-2 bg-gray-50 flex justify-between text-xs">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
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

      {/* User Info */}
      <div className="text-xs">
        {userName ? (
          <div>
            <span className="font-semibold">{userName.split(' ')[0]}</span>
          </div>
        ) : (
          <span>Guest</span>
        )}
      </div>

      {/* User Icon */}
      <div className="relative">
        <FaUserCircle 
          className="text-xl cursor-pointer" 
          onClick={() => setUserLinks(!userLinks)}
        />
        
        {userLinks && (
          <div className="absolute right-0 mt-1 bg-white shadow-md rounded-sm border border-gray-200 z-50 w-32">
            <div className="py-1 text-xs">
              <NavLink to="/profile">
                <div className="px-2 py-1 hover:bg-gray-100">Profile</div>
              </NavLink>
              <NavLink to="/settings">
                <div className="px-2 py-1 hover:bg-gray-100">Settings</div>
              </NavLink>
              <div 
                className="px-2 py-1 text-red-500 hover:bg-red-50"
                onClick={handleLogout}
              >
                Log Out
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;