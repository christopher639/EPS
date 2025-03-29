import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: 'none',
    profilePicture: 'https://via.placeholder.com/150',
    socialMedia: {
      x: 'https://x.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
    
    },
    notificationsEnabled: true,
    darkMode: false,
    role: ''
  });

  useEffect(() => {
    // Load user data from localStorage when component mounts
    const userData = {
      name: localStorage.getItem('userName') || '',
      email: localStorage.getItem('email') || '',
      role: localStorage.getItem('role') || '',
      darkMode: localStorage.getItem('theme') === 'dark'
    };
    
    setUser(prev => ({
      ...prev,
      ...userData
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const saveChanges = () => {
    setIsEditing(false);
    // Save changes to localStorage
    localStorage.setItem('userName', user.name);
    localStorage.setItem('email', user.email);
    localStorage.setItem('theme', user.darkMode ? 'dark' : 'light');
    console.log('Changes saved:', user);
  };

  return (
    <div className={`min-h-screen overflow-y-auto max-h-screen p-6 ${user.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden ${user.darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm">Manage your profile and preferences</p>
          {user.role === 'admin' && (
            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-yellow-500 text-black rounded">
              ADMIN
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Profile Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <>
                  <div className='flex  gap-3'>
                  <label htmlFor="Username">UserName</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${user.darkMode ? 'bg-gray-600 border-gray-500' : ''}`}
                      placeholder="Full Name"
                    />
                  </div>
                   <div className='flex gap-3'>
                   <label htmlFor="">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${user.darkMode ? 'bg-gray-600 border-gray-500' : ''}`}
                      placeholder="Email"
                    />
                   </div>
                    <textarea
                      name="bio"
                      value={user.bio}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${user.darkMode ? 'bg-gray-600 border-gray-500' : ''}`}
                      placeholder="Bio"
                      rows="3"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold">{user.name}</p>
                    <p className={user.darkMode ? "text-gray-300" : "text-gray-600"}>{user.email}</p>
                    <p className={user.darkMode ? "text-gray-300" : "text-gray-600"}>{user.bio}</p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4">
              {isEditing ? (
                <button
                  onClick={saveChanges}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={toggleEditing}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            <div className="space-y-2">
              <a
                href={user.socialMedia.x}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center ${user.darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
              >
                <i className="fab fa-x mr-2"></i>
                x
              </a>
              <a
                href={user.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center ${user.darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
              >
                <i className="fab fa-linkedin mr-2"></i>
                LinkedIn
              </a>
              <a
                href={user.socialMedia.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center ${user.darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
              >
                <i className="fab fa-github mr-2"></i>
                GitHub
              </a>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Change Password</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p>Delete Account</p>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Enable Notifications</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.notificationsEnabled}
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        notificationsEnabled: e.target.checked,
                      }))
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <p>Dark Mode</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.darkMode}
                    onChange={(e) => {
                      const darkMode = e.target.checked;
                      setUser((prev) => ({
                        ...prev,
                        darkMode,
                      }));
                      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${user.darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                <p className={user.darkMode ? "text-gray-200" : "text-gray-600"}>Logged in to your account</p>
                <p className={`text-sm ${user.darkMode ? "text-gray-400" : "text-gray-400"}`}>Just now</p>
              </div>
              <div className={`p-4 rounded-lg ${user.darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                <p className={user.darkMode ? "text-gray-200" : "text-gray-600"}>Updated profile preferences</p>
                <p className={`text-sm ${user.darkMode ? "text-gray-400" : "text-gray-400"}`}>Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;