import React, { useState } from 'react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Software Engineer | Open Source Enthusiast | Lifelong Learner',
    profilePicture: 'https://via.placeholder.com/150',
    socialMedia: {
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
    notificationsEnabled: true,
    darkMode: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const saveChanges = () => {
    setIsEditing(false);
    // Add logic to save changes to the backend
    console.log('Changes saved:', user);
  };

  return (
    <div className="min-h-screen overflow-y-auto max-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm">Manage your profile and preferences</p>
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
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Email"
                    />
                    <textarea
                      name="bio"
                      value={user.bio}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Bio"
                      rows="3"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold">{user.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.bio}</p>
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
                href={user.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fab fa-twitter mr-2"></i>
                Twitter
              </a>
              <a
                href={user.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fab fa-linkedin mr-2"></i>
                LinkedIn
              </a>
              <a
                href={user.socialMedia.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-600"
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
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        darkMode: e.target.checked,
                      }))
                    }
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Posted a new project on GitHub</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Updated profile information</p>
                <p className="text-sm text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;