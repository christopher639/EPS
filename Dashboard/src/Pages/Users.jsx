import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

const Users = () => {
  const [userform, setUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    profilePicture: "",
    role: "user", // Default role
    status: "active", // Default status
    address: "",
    dateOfBirth: "",
    preferences: {},
    rolesPermissions: [],
  });

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      toast.success("User deleted successfully!"); // Success toast
      setUserForm(false);
      getFetchData();
    } catch (error) {
      toast.error("Error deleting user. Please try again."); // Error toast
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = formData._id ? `/api/users/${formData._id}` : "/api/users";
    const method = formData._id ? "put" : "post";

    axios[method](endpoint, formData)
      .then(() => {
        toast.success("User saved successfully!"); // Success toast
        getFetchData();
        setUserForm(false);
      })
      .catch(() => {
        toast.error("Error saving user. Please try again."); // Error toast
      });
  };

  const getFetchData = () => {
    setLoading(true); // Set loading to true before starting data fetch
    axios.get("/admin/users")
      .then((res) => {
        setUsers(res.data); // Assuming the data is in res.data
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Set loading to false even in case of error
      });
  };

  useEffect(() => {
    getFetchData();
  }, []);

  const handleUpdate = (user) => {
    // Prepopulate formData with the user's existing data
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

  return (
    <div className='flex flex-col min-w-full bg-gray-100'>
      <ToastContainer />
      <div className='flex justify-between mx-4 py-3'>
        <div className='flex gap-2'>
          <input
            className='outline-none px-4 py-2 text-center border border-gray-300 rounded-md w-1/3'
            type="text"
            placeholder='Search'
          />
          <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
            Search
          </button>
        </div>
        <div>
          <button
            onClick={() => setUserForm(true)}
            className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
          >
            New
          </button>
        </div>
      </div>

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

      {/* Display a "Wait, it's loading..." message if loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">Wait, it's loading...</p>
        </div>
      )}

      {!loading && (
        <div className='flex max-h-[85vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
          <table className='min-w-full mt-4'>
            <thead className='bg-gray-800 text-slate-800'>
              <tr>
                <th className='border px-4 py-2'>NO</th>
                <th className='border px-4 py-2'>Full Name</th>
                <th className='border px-4 py-2'>Email</th>
                <th className='border px-4 py-2'>Phone Number</th>
                <th className='border px-4 py-2'>Update</th>
                <th className='border px-4 py-2'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr className='border whitespace-nowrap h-10 py-3 border-slate-500' key={user._id}>
                  <td className='border px-4 py-2'>{index + 1}</td>
                  <td className='border px-4 py-2'>{user.fullName}</td>
                  <td className='border px-4 py-2'>{user.email}</td>
                  <td className='border px-4 py-2'>{user.phoneNumber}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button onClick={() => handleDelete(user._id)} className='text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700'>
                      Delete
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button onClick={() => handleUpdate(user)} className='text-white px-2 py-1 rounded-md bg-green-600 hover:bg-green-700'>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
