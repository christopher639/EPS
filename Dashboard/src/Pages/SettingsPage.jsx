// SettingsPage.jsx
import React from 'react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen overflow-y-auto max-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm">Manage your account settings and preferences</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">johndoe@example.com</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                Change Photo
              </button>
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Dark Mode</p>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <p>Notifications</p>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Two-Factor Authentication</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p>Change Password</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Delete Account</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;