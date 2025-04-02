import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { FaBars, FaEnvelope, FaEdit, FaTrash, FaPlus, FaPaperPlane } from "react-icons/fa";
import UserAccount from '../components/UserAccount';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton';
import 'react-toastify/dist/ReactToastify.css';
import PendingUsersModal from './PendingUsersModal';
import MobileNav from '../components/MobileNav';
import { Tooltip } from 'react-tooltip';

const Users = () => {
  const [userform, setUserForm] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsEmailSending(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      setIsEmailSending(false);
      return;
    }

    const payload = {
      subject: "Important Notification",
      text: emailContent,
      html: `<p>${emailContent}</p>`,
    };

    try {
      if (selectedUserId) {
        await axios.post(`https://eps-dashboard.onrender.com/api/users/admin/send-email-to-single/${selectedUserId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Email sent to the user!");
      } else {
        await axios.post(`https://eps-dashboard.onrender.com/api/users/admin/send-email-to-all`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Email sent to all users!");
      }
      setEmailModalOpen(false);
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsEmailSending(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        setIsDeleting(false);
        return;
      }

      await axios.delete(`https://eps-dashboard.onrender.com/api/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      getFetchData();
    } catch (error) {
      toast.error("Permission Denied. Contact System Admin");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint = formData._id ? `https://eps-dashboard.onrender.com/api/users/${formData._id}` : "/api/users";
    const method = formData._id ? "put" : "post";

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      setIsSubmitting(false);
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
      })
      .finally(() => {
        setIsSubmitting(false);
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

    axios.get("https://eps-dashboard.onrender.com/api/users/admin/approved-users", {
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

  const toggleSideBar = () => {
    setSideBar(prev => !prev);
  };

  return (
    <div className='flex w-full'>
      {/** Sidebar */}
      <div className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}>
        <SideBar />
      </div>

      {/** Main content */}
      <div className="flex w-full flex-col min-h-screen bg-gray-100">
        <ToastContainer />
        <div className="flex justify-between py-[19px] items-center p-2 bg-white border-b">
          <MobileNav/>
         <div className='hidden md:flex'>
         <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
         </div>
          <div className="hidden sm:flex">
            <input
              className="outline-none px-3 py-1 text-sm border border-gray-300 rounded-md w-64"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={() => {
              setSelectedUserId(null);
              setEmailModalOpen(true);
            }}
            className="bg-blue-500 hidden md:flex items-center text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            data-tooltip-id="email-tooltip"
            data-tooltip-content="Email All Users"
            disabled={isEmailSending}
          >
            {isEmailSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-1" /> <span className="text-sm">Email All</span>
              </>
            )}
          </button>
          <div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-purple-600 hidden md:flex items-center text-white px-3 py-1 rounded text-sm"
              data-tooltip-id="pending-tooltip"
              data-tooltip-content="View Pending Users"
            >
              <span>Pending Users</span>
            </button>
            <PendingUsersModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          </div>
          <div>
            <button
              onClick={() => setUserForm(true)}
              className="bg-green-600 flex items-center text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
              data-tooltip-id="add-tooltip"
              data-tooltip-content="Add New User"
            >
              <FaPlus className="mr-1" /> <span>Add</span>
            </button>
          </div>
          <UserAccount />
        </div>
        <div className="sm:hidden flex justify-between p-2">
          <input
            className="outline-none max-w-40 px-3 py-1 text-sm border border-gray-300 rounded-md"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            onClick={() => {
              setSelectedUserId(null);
              setEmailModalOpen(true);
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
            disabled={isEmailSending}
          >
            {isEmailSending ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FaPaperPlane />
            )}
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-purple-600 text-white px-2 py-1 rounded text-sm"
          >
            Pending
          </button>
        </div>

        {emailModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full shadow-lg">
              <h2 className="text-lg font-semibold mb-3">
                {selectedUserId ? 'Send Email to User' : 'Send Email to All Users'}
              </h2>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-3">
                  <label className="block text-xs font-medium">Email Content</label>
                  <textarea
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                    placeholder="Type your email content here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows="5"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEmailModalOpen(false)}
                    className="px-3 py-1 text-sm bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
                    disabled={isEmailSending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center min-w-[100px]"
                    disabled={isEmailSending}
                  >
                    {isEmailSending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending
                      </>
                    ) : 'Send Email'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {userform && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg max-h-[72vh] md:max-h-[90vh] overflow-y-auto w-full mx-3 md:w-2/3 shadow-lg">
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
                <h2 className="text-lg font-semibold mb-2 col-span-full">{formData._id ? 'Update User' : 'Add New User'}</h2>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Username</label>
                  <input
                    type="text"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='username'
                    onChange={handleOnChange}
                    value={formData.username}
                    placeholder="Enter username"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='fullName'
                    onChange={handleOnChange}
                    value={formData.fullName}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='email'
                    onChange={handleOnChange}
                    value={formData.email}
                    placeholder="user@example.com"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Password</label>
                  <input
                    type="password"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='password'
                    onChange={handleOnChange}
                    value={formData.password}
                    placeholder="Password"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Phone Number</label>
                  <input
                    type="text"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='phoneNumber'
                    onChange={handleOnChange}
                    value={formData.phoneNumber}
                    placeholder="Phone number"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Profile Picture</label>
                  <input
                    type="text"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='profilePicture'
                    onChange={handleOnChange}
                    value={formData.profilePicture}
                    placeholder="Image URL"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Role</label>
                  <select
                    name='role'
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    onChange={handleOnChange}
                    value={formData.role}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Status</label>
                  <select
                    name='status'
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    onChange={handleOnChange}
                    value={formData.status}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Address</label>
                  <input
                    type="text"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='address'
                    onChange={handleOnChange}
                    value={formData.address}
                    placeholder="Enter address"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full p-1 text-sm border border-gray-300 rounded-md"
                    name='dateOfBirth'
                    onChange={handleOnChange}
                    value={formData.dateOfBirth}
                  />
                </div>

                <div className="flex justify-end gap-2 col-span-full mt-2">
                  <button
                    onClick={() => setUserForm(false)}
                    className="px-3 py-1 text-sm bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center min-w-[100px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {formData._id ? 'Updating...' : 'Adding...'}
                      </>
                    ) : formData._id ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg w-80 shadow-lg">
              <h3 className="text-lg mb-3">Are you sure you want to delete this user?</h3>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-3 py-1 text-sm bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px]"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
     <div  className="bg-white mx-2 md:mx-2 mt-1  mx-0 grid gri-cols-1 pb-4 md:pb-6 max-h-screen md:max-h-[90vh] pb-20 md:pb-5 overflow-y-auto overflow-x-auto rounded-lg p-2 sm:p-4"  >

   
        <div className='p-2 grid grid-cols-1 pb-3 max-h-[80vh] overflow-y-auto w-full overflow-x-auto'>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <table className="w-full table-auto px-1  text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-3 text-sm">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 border-none transition-colors">
                      <td className="px-4 whitespace-nowrap py-2">{user.fullName}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full 
                          ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                            user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-1">
                        <button
                          onClick={() => {
                            setSelectedUserId(user._id);
                            setEmailModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                          data-tooltip-id="email-tooltip"
                          data-tooltip-content="Email User"
                        >
                          <FaPaperPlane className="mr-1" /> <span className="text-xs">Email</span>
                        </button>
                        <button
                          onClick={() => handleUpdate(user)}
                          className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center"
                          data-tooltip-id="edit-tooltip"
                          data-tooltip-content="Edit User"
                        >
                          <FaEdit className="mr-1" /> <span className="text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center"
                          data-tooltip-id="delete-tooltip"
                          data-tooltip-content="Delete User"
                        >
                          <FaTrash className="mr-1" /> <span className="text-xs">Delete</span>
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
        {/* Tooltips */}
        <Tooltip id="email-tooltip" place="top" effect="solid" />
        <Tooltip id="edit-tooltip" place="top" effect="solid" />
        <Tooltip id="delete-tooltip" place="top" effect="solid" />
        <Tooltip id="add-tooltip" place="top" effect="solid" />
        <Tooltip id="pending-tooltip" place="top" effect="solid" />
      </div>
    </div>
  );
};

export default Users;