import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import axios from "axios";
import UserAccount from '../components/UserAccount';
import { FaEnvelope,FaEdit,FaTrash,FaPlus,FaPaperPlane } from "react-icons/fa"; 

axios.defaults.baseURL = "http://localhost:3000";

const Users = () => {
  const [userform, setUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false); // Modal visibility
const [selectedUserId, setSelectedUserId] = useState(null);  // For sending to a specific user
const [emailContent, setEmailContent] = useState(""); // Email content (subject, body)

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    profilePicture: "",
    role: "user",
    status: "active",
    address: "",
    dateOfBirth: "",
    preferences: {},
    rolesPermissions: [],
  });

  // State for Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }
  
    const payload = {
      subject: "Important Notification", // Set subject as needed
      text: emailContent, // Use the email content
      html: `<p>${emailContent}</p>`, // Optionally, format the email content in HTML
    };
  
    try {
      if (selectedUserId) {
        // Send to a specific user
        await axios.post(`/api/users/admin/send-email-to-single/${selectedUserId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Email sent to the user!");
      } else {
        // Send to all users
        await axios.post(`/api/users/admin/send-email-to-all`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Email sent to all users!");
      }
      setEmailModalOpen(false); // Close modal after sending
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    }
  };
  

  // Delete user confirmation
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        return;
      }

      await axios.delete(`/api/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      getFetchData(); // Refresh the user list
    } catch (error) {
      toast.error("Permission Denied .Contact System Admin");
    }
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = formData._id ? `/api/users/${formData._id}` : "/api/users";
    const method = formData._id ? "put" : "post";

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }

    axios[method](endpoint, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success("User saved successfully!");
        getFetchData();
        setUserForm(false);
      })
      .catch(() => {
        toast.error("Permission Denied. Contact System Admin");
      });
  };

  const handleUpdate = (user) => {
    setFormData({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: user.role,
      status: user.status,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
    });
    setUserForm(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFetchData = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    axios.get("/api/users/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch users. Please try again.");
        setLoading(false);
      });
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getFetchData();
  }, []);

  return (
    <div className="flex flex-col min-w-full bg-gray-100">
      <ToastContainer />
      <div className="flex justify-between mx-4 py-3">
        <div className='hidden sm:flex' >
          <input
            className="outline-none min-w-full px-4 py-2 text-center border border-gray-300 rounded-md w-1/3"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        
        </div>
        {/* For sending to all users */}
            <button
              onClick={() => {
                setSelectedUserId(null); // No user selected
                setEmailModalOpen(true); // Open email modal
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-md"
            >
              <FaPaperPlane />
            </button>
        <div>
          <button
            onClick={() => setUserForm(true)}
            className="bg-green-700 flex text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <FaPlus className='mt-1'/> <p className='hidden sm:flex'>Add</p>
          </button>
        </div>
        <UserAccount />
      </div>
      <div  className='sm:hidden mx-4 pb-2'>
          <input
            className="outline-none min-w-full px-4 py-2 text-center border border-gray-300 rounded-md w-1/3"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        
        </div>
        {emailModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {selectedUserId ? 'Send Email to User' : 'Send Email to All Users'}
      </h2>
      <form onSubmit={handleEmailSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email Content</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Type your email content here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            rows="5"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setEmailModalOpen(false)}
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {userform && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-5 md:w-2/3 shadow-lg">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
              <h2 className="text-xl font-semibold mb-4">{formData._id ? 'Update User' : 'Add New User'}</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='username'
                  onChange={handleOnChange}
                  value={formData.username}
                  placeholder="Enter username"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='fullName'
                  onChange={handleOnChange}
                  value={formData.fullName}
                  placeholder="Enter full name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='email'
                  onChange={handleOnChange}
                  value={formData.email}
                  placeholder="user@example.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='password'
                  onChange={handleOnChange}
                  value={formData.password}
                  placeholder="Password"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='phoneNumber'
                  onChange={handleOnChange}
                  value={formData.phoneNumber}
                  placeholder="Phone number"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Profile Picture</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='profilePicture'
                  onChange={handleOnChange}
                  value={formData.profilePicture}
                  placeholder="Image URL"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Role</label>
                <select
                  name='role'
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleOnChange}
                  value={formData.role}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  name='status'
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleOnChange}
                  value={formData.status}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='address'
                  onChange={handleOnChange}
                  value={formData.address}
                  placeholder="Enter address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Date of Birth</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  name='dateOfBirth'
                  onChange={handleOnChange}
                  value={formData.dateOfBirth}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setUserForm(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md"
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  {formData._id ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h3 className="text-xl mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto overflow-y-auto  max-h-[86vh] mx-4 ">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border px-4 py-2">Full Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-2">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">{user.fullName}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2">{user.status}</td>
                    <td className="border flex gap-1 px-4 py-2">
                                          {/* For sending to a specific user */}
                      <button
                        onClick={() => {
                          setSelectedUserId(user._id); // Set specific user
                          setEmailModalOpen(true); // Open email modal
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                      >
                        <FaPaperPlane />
                      </button>
                      <button
                        onClick={() => handleUpdate(user)}
                        className="bg-green-700 text-white px-3 py-1 rounded-md mr-2"
                      >
                      <FaEdit/>
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                       <FaTrash/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
