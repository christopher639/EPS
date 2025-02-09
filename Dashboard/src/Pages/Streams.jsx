import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import UserAccount from '../components/UserAccount';
import axios from 'axios';
import SideBar from '../components/SideBar';
import { toast, ToastContainer } from 'react-toastify';
import SidebarToggleButton from '../components/SidebarToggleButton';

axios.defaults.baseURL = 'http://localhost:3000';

const Streams = () => {
  const [streams, setStreams] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [selectedStream, setSelectedStream] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddStreamModal, setShowAddStreamModal] = useState(false);
  const [updatedStream, setUpdatedStream] = useState({ name: '', teacher: '' });
  const [newStream, setNewStream] = useState({ name: '', teacher: '' });

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Fetch streams from the API
  useEffect(() => {
    const fetchData = () => {
      axios
        .get('/api/streams')
        .then((response) => setStreams(response.data))
        .catch((err) => console.log(err));
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle navigation to StudentPerStream.jsx
  const handleStreamClick = (streamName) => {
    const year = '2024-2025'; // You can dynamically set the year if needed
    navigate(`/students/${streamName}/${year}`);
  };

  // Handle Delete Stream
  const handleDelete = () => {
    axios
      .delete(`/api/streams/${selectedStream.id}`)
      .then(() => {
        setStreams(streams.filter((stream) => stream.id !== selectedStream.id));
        setShowDeleteModal(false);
        toast.success('Stream deleted successfully!');
      })
      .catch((err) => console.log(err));
  };

  // Handle Update Stream
  const handleUpdate = (id) => {
    const streamToUpdate = streams.find((stream) => stream.id === id);
    setUpdatedStream({
      name: streamToUpdate.name,
      teacher: streamToUpdate.teacher,
    });
    setSelectedStream(streamToUpdate);
    setShowUpdateModal(true);
  };

  // Handle Update Submit
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/streams/${selectedStream.id}`, updatedStream)
      .then((response) => {
        setStreams(
          streams.map((stream) =>
            stream.id === selectedStream.id ? response.data : stream
          )
        );
        setShowUpdateModal(false);
        toast.success('Stream updated successfully!');
      })
      .catch((err) => console.log(err));
  };

  // Handle Add Stream Submit
  const handleAddStreamSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/streams', newStream)
      .then((response) => {
        setStreams([...streams, response.data]);
        setShowAddStreamModal(false);
        toast.success('Stream added successfully!');
        setNewStream({ name: '', teacher: '' });
      })
      .catch((err) => console.log(err));
  };

  // Toggle Sidebar
  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className='flex'>
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? 'w-72' : 'w-16'
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>
      <div className='bg-gray-50 w-full min-h-screen'>
        {/* Header */}
        <div className='flex px-6 py-4 border-b bg-white shadow-md justify-between items-center'>
          <SidebarToggleButton
            toggleSidebar={toggleSideBar}
            isSidebarCollapsed={!sideBar}
          />
          <p className='text-xl font-semibold text-gray-800'>Streams</p>
          <div className='hidden md:flex flex-grow max-w-xs'>
            <input
              type='text'
              placeholder='Search stream'
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>
          <button
            onClick={() => setShowAddStreamModal(true)}
            className='bg-green-700 px-4 py-2 text-white rounded-full hover:bg-green-600 transition duration-300'
          >
            <p className='hidden md:flex'>+ Add Stream</p>
            <p className='md:hidden'>+</p>
          </button>
          <UserAccount />
        </div>

        {/* Body */}
        <div className='grid overflow-y-auto max-h-[90vh] gap-6 px-6 py-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {streams.map((stream, index) => (
            <div
              key={index}
              className='border rounded-lg bg-white shadow-md hover:shadow-xl transition duration-300 cursor-pointer'
              onClick={() => handleStreamClick(stream.name)} // Navigate on click
            >
              <div className='p-4'>
                <p className='font-semibold text-lg text-gray-800'>
                  {stream.name}
                </p>
                <p className='text-sm text-gray-600'>{stream.teacher}</p>
                <p className='text-xs text-gray-500 mt-2'>
                  {new Date(stream.createdAt).toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>
                  {new Date(stream.updatedAt).toLocaleString()}
                </p>

                {/* Action Buttons */}
                <div className='flex space-x-4 mt-4'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      handleUpdate(stream.id);
                    }}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-300'
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      setSelectedStream(stream);
                      setShowDeleteModal(true);
                    }}
                    className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition duration-300'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modals (Delete, Update, Add Stream) */}
        {showDeleteModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
              <h3 className='text-xl font-semibold mb-4'>
                Are you sure you want to delete this stream?
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                This action cannot be undone.
              </p>
              <div className='flex justify-between'>
                <button
                  onClick={handleDelete}
                  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400'
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpdateModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
              <h3 className='text-xl font-semibold mb-4'>Update Stream</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div className='mb-4'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Stream Name
                  </label>
                  <input
                    id='name'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={updatedStream.name}
                    onChange={(e) =>
                      setUpdatedStream({ ...updatedStream, name: e.target.value })
                    }
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='teacher'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Teacher
                  </label>
                  <input
                    id='teacher'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={updatedStream.teacher}
                    onChange={(e) =>
                      setUpdatedStream({ ...updatedStream, teacher: e.target.value })
                    }
                  />
                </div>
                <div className='flex justify-between'>
                  <button
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400'
                  >
                    Update
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowUpdateModal(false)}
                    className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddStreamModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
              <h3 className='text-xl font-semibold mb-4'>Add New Stream</h3>
              <form onSubmit={handleAddStreamSubmit}>
                <div className='mb-4'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Stream Name
                  </label>
                  <input
                    id='name'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={newStream.name}
                    onChange={(e) =>
                      setNewStream({ ...newStream, name: e.target.value })
                    }
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='teacher'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Teacher
                  </label>
                  <input
                    id='teacher'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={newStream.teacher}
                    onChange={(e) =>
                      setNewStream({ ...newStream, teacher: e.target.value })
                    }
                  />
                </div>
                <div className='flex justify-between'>
                  <button
                    type='submit'
                    className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400'
                  >
                    Add Stream
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowAddStreamModal(false)}
                    className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Streams;