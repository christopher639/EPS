import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '../components/SideBar';
import SidebarToggleButton from '../components/SidebarToggleButton';
import UserAccount from '../components/UserAccount';
import BASE_URL from '../config';
axios.defaults.baseURL = BASE_URL;

const Streams = () => {
  const [streams, setStreams] = useState([]);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [selectedStream, setSelectedStream] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddStreamModal, setShowAddStreamModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [updatedStream, setUpdatedStream] = useState({ name: '', teacher: '' });
  const [newStream, setNewStream] = useState({ name: '', teacher: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promoteData, setPromoteData] = useState({
    currentGrade: '',
    currentStream: '',
    newGrade: '',
    newStream: '',
  });

  const navigate = useNavigate();

  // Fetch streams from the API
  useEffect(() => {
    const fetchStreams = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://eps-dashboard.onrender.com/api/streams');
        setStreams(response.data);
        setFilteredStreams(response.data);
      } catch (error) {
        toast.error('Failed to fetch streams');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStreams();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = streams.filter((stream) =>
      stream.name && stream.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStreams(filtered);
  }, [searchTerm, streams]);

  // Handle navigation to StudentPerStream.jsx
  const handleStreamClick = (streamName) => {
    const year = '2024-2025'; // You can dynamically set the year if needed
    navigate(`/students/${streamName}/${year}`);
  };

  // Handle Delete Stream
  const handleDelete = async () => {
    try {
      await axios.delete(`https://eps-dashboard.onrender.com/api/streams/${selectedStream.id}`);
      setStreams(streams.filter((stream) => stream.id !== selectedStream.id));
      setShowDeleteModal(false);
      toast.success('Stream deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete stream');
    }
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
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://eps-dashboard.onrender.com/api/streams/${selectedStream.id}`,
        updatedStream
      );
      setStreams(
        streams.map((stream) =>
          stream.id === selectedStream.id ? response.data : stream
        )
      );
      setShowUpdateModal(false);
      toast.success('Stream updated successfully!');
    } catch (error) {
      toast.error('Failed to update stream');
    }
  };

  // Handle Add Stream Submit
  const handleAddStreamSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://eps-dashboard.onrender.com/api/streams', newStream);
      setStreams([...streams, response.data]);
      setShowAddStreamModal(false);
      toast.success('Stream added successfully!');
      setNewStream({ name: '', teacher: '' }); // Reset the form
    } catch (error) {
      toast.error('Failed to add stream');
    }
  };

  // Handle Promote Learners
  const handlePromoteLearners = async () => {
    try {
      await axios.post('https://eps-dashboard.onrender.com/api/learners/promote', promoteData);
      toast.success('Learners promoted successfully!');
      setShowPromoteModal(false);
    } catch (error) {
      toast.error('Failed to promote learners');
    }
  };

  // Toggle Sidebar
  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? 'w-0 md:w-72' : 'w-0'
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='bg-gray-50 w-full min-h-screen'>
        {/* Header */}
        <div className='flex px-6 py-4 border-b bg-white  justify-between items-center'>
          <SidebarToggleButton
            toggleSidebar={toggleSideBar}
            isSidebarCollapsed={!sideBar}
          />
          <p className='text-xl font-semibold text-gray-800'>Streams</p>
          <div className='hidden md:flex flex-grow max-w-xs'>
            <input
              type='text'
              placeholder='Search stream'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>
          <button
            onClick={() => setShowAddStreamModal(true)}
            className='bg-green-700 px-4 py-2 text-white rounded-full hover:bg-green-600 transition duration-300'
          >
            <p className='hidden md:flex'>+ Add Stream</p>
            <p className='md:hidden'>+</p>
          </button>
          <button
            onClick={() => setShowPromoteModal(true)}
            className='bg-purple-700 hidden md:flex px-4 py-2 text-white rounded-full hover:bg-purple-600 transition duration-300'
          >
            Promote 
          </button>
          <UserAccount />
        </div>
        <div className=' flex mt-2 justify-between  mx-3  md:hidden'>
        <div className=' flex-grow max-w-xs'>
            <input
              type='text'
              placeholder='Search stream'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            />
          </div>
        <button
            onClick={() => setShowPromoteModal(true)}
            className='bg-purple-700 px-4 py-2 text-white rounded-full hover:bg-purple-600 transition duration-300'
          >
            Promote Learners
          </button>
        </div>

        {/* Body */}
        <div className='grid overflow-y-auto max-h-[90vh] gap-6 px-6 py-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {isLoading ? (
            <div className='flex justify-center items-center col-span-full'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
            </div>
          ) : filteredStreams.length > 0 ? (
            filteredStreams.map((stream, index) => (
              <div
                key={index}
                className='border rounded-lg bg-white hover:bg-slate-100 transition duration-300 cursor-pointer'
                onClick={() => handleStreamClick(stream.name)}
              >
                <div className='p-4'>
                  <p className='font-semibold text-lg text-gray-800'>
                    {stream.name}
                  </p>
                  <p className='text-sm text-gray-600'>{stream.teacher}</p>
                  <p className='text-xs text-gray-500 mt-2'>
                    Created: {new Date(stream.createdAt).toLocaleString()}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Updated: {new Date(stream.updatedAt).toLocaleString()}
                  </p>

                  {/* Action Buttons */}
                  <div className='flex space-x-4 mt-4'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(stream.id);
                      }}
                      className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition duration-300'
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
            ))
          ) : (
            <div className='col-span-full text-center text-gray-600'>
              No streams found.
            </div>
          )}
        </div>

        {/* Modals */}
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

        {showPromoteModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
              <h3 className='text-xl font-semibold mb-4'>Promote Learners</h3>
              <form onSubmit={handlePromoteLearners}>
                <div className='mb-4'>
                  <label
                    htmlFor='currentGrade'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Current Grade
                  </label>
                  <input
                    id='currentGrade'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={promoteData.currentGrade}
                    onChange={(e) =>
                      setPromoteData({ ...promoteData, currentGrade: e.target.value })
                    }
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='currentStream'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Current Stream
                  </label>
                  <input
                    id='currentStream'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={promoteData.currentStream}
                    onChange={(e) =>
                      setPromoteData({ ...promoteData, currentStream: e.target.value })
                    }
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='newGrade'
                    className='block text-sm font-medium text-gray-700'
                  >
                    New Grade
                  </label>
                  <input
                    id='newGrade'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={promoteData.newGrade}
                    onChange={(e) =>
                      setPromoteData({ ...promoteData, newGrade: e.target.value })
                    }
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='newStream'
                    className='block text-sm font-medium text-gray-700'
                  >
                    New Stream
                  </label>
                  <input
                    id='newStream'
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded'
                    value={promoteData.newStream}
                    onChange={(e) =>
                      setPromoteData({ ...promoteData, newStream: e.target.value })
                    }
                  />
                </div>
                <div className='flex justify-between'>
                  <button
                    type='submit'
                    className='bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-400'
                  >
                    Promote
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowPromoteModal(false)}
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