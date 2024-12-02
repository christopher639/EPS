import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import axios from "axios";
axios.defaults.baseURL = "https://eps-backendvtwo.onrender.com";

const Users = () => {
  const [userform, setUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/delete/" + id);
      toast.success("User deleted successfully!"); // Success toast
      setUserForm(false);
      getFetchData();
    } catch (error) {
      toast.error("Error deleting user. Please try again."); // Error toast
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/create", formData)
      .then(() => {
        toast.success("User added successfully!"); // Success toast
        getFetchData();
        setUserForm(false);
      })
      .catch(() => {
        toast.error("Error adding user. Please try again."); // Error toast
      });
  };

  const getFetchData = () => {
    setLoading(true); // Set loading to true before starting data fetch
    axios.get("/users")
      .then(users => {
        setUsers(users.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(err => {
        console.log(err);
        setLoading(false); // Set loading to false even in case of error
      });
  };

  useEffect(() => {
    getFetchData();
  }, []);

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

      {userform  && (
      
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <form onSubmit={handleSubmit}  className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Stream Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
           name='name'
              onChange={handleOnChange}
            placeholder="Enter user name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">email</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
              name='email'
            onChange={handleOnChange}
            placeholder="user@gazmil.com"
          />
        </div>
            <div className="mb-4">
          <label className="block text-sm font-medium">email</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
              name='mobile'
            onChange={handleOnChange}
            placeholder="745678765"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setUserForm(false)}
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
          >
            Cancel
          </button>
          <button type='submit'
          
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  
  )}

      {/* Display a "Wait, it's loading..." message if loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">Wait, it's loading...</p>
        </div>
      )}

      {!loading && (
        <div className='flex max-h-[72vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
          <table className='min-w-full mt-4'>
            <thead className='bg-gray-800 text-white'>
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
              {users.map((user,index) => (
               <tr className='border whitespace-nowrap h-10 py-3 border-slate-500' key={user._id}>
                   <td className='border px-4 py-2'>{index + 1}</td>
                  <td className='border px-4 py-2'>{user.name}</td>
                  <td className='border px-4 py-2'>{user.email}</td>
                  <td className='border px-4 py-2'>{user.mobile}</td>
                  <td className='border px-4 py-2 text-center'>
                    <button onClick={() => handleDelete(user._id)} className='text-white px-2 py-1 rounded-md bg-red-600 hover:bg-red-700'>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="http://www.w3.org/2000/svg" width="20px" fill="white">
                        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                      </svg>
                    </button>
                  </td>
                  <td className='border px-4 py-2 text-center'>
                    <button
                      onClick={() => { alert("Not working at the moment") }}
                      className='text-white px-2 py-1 rounded-md bg-green-600 hover:bg-green-700'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="http://www.w3.org/2000/svg" width="20px" fill="white">
                        <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                      </svg>
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

export default Users
