import React from 'react';
import { FiUser, FiLock, FiBell, FiMoon, FiTrash2, FiSave } from 'react-icons/fi';

const SettingsPage = () => {
  return (
    <div className="max-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Account Settings</h1>
              <p className="text-blue-100 mt-1">Manage your profile and preferences</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white/20">
                <FiSave className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center mb-6">
              <FiUser className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <button className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-200 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      defaultValue="John" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue="Doe" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    defaultValue="johndoe@example.com" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea 
                    rows={3}
                    defaultValue="Product designer and developer based in New York."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center mb-6">
              <FiBell className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center">
                  <FiMoon className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Dark Mode</p>
                    <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center">
                  <FiBell className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Notifications</p>
                    <p className="text-sm text-gray-500">Enable or disable notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center mb-6">
              <FiLock className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex-1 mb-3 md:mb-0">
                  <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium whitespace-nowrap">
                  Enable 2FA
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex-1 mb-3 md:mb-0">
                  <p className="font-medium text-gray-800">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password regularly</p>
                </div>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition duration-200 text-sm font-medium border border-blue-600 whitespace-nowrap">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg border border-red-100 p-6 shadow-xs">
            <div className="flex items-center mb-6">
              <FiTrash2 className="w-5 h-5 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Danger Zone</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 hover:bg-red-50 rounded-lg transition">
                <div className="flex-1 mb-3 md:mb-0">
                  <p className="font-medium text-gray-800">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium whitespace-nowrap">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;