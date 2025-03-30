import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../components/SideBar";
import SidebarToggleButton from "../components/SidebarToggleButton";
import UserAccount from "../components/UserAccount";
import BASE_URL from "../config";
import MobileNav from "../components/MobileNav";
import { Tooltip } from "react-tooltip";
import { FaPlus } from "react-icons/fa";

axios.defaults.baseURL = "https://eps-dashboard.onrender.com";

const ActionButton = ({ 
  onClick, 
  children, 
  tooltip, 
  color = "blue", 
  isLoading = false,
  className = "",
  ...props 
}) => {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-400",
    red: "bg-red-500 hover:bg-red-400",
    green: "bg-green-500 hover:bg-green-400",
    purple: "bg-purple-500 hover:bg-purple-400",
    gray: "bg-gray-500 hover:bg-gray-400"
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-white rounded transition duration-300 flex items-center justify-center ${colors[color]} ${className}`}
      data-tooltip-id="main-tooltip"
      data-tooltip-content={tooltip}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

const Streams = () => {
  const [streams, setStreams] = useState([]);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [selectedStream, setSelectedStream] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddStreamModal, setShowAddStreamModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [updatedStream, setUpdatedStream] = useState({ name: "", teacher: "" });
  const [newStream, setNewStream] = useState({ name: "", teacher: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({
    delete: false,
    update: false,
    add: false,
    promote: false
  });
  const [promoteData, setPromoteData] = useState({
    currentGrade: "",
    currentStream: "",
    newGrade: "",
    newStream: "",
  });

  const navigate = useNavigate();

  // Fetch streams from the API
  const fetchStreams = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://eps-dashboard.onrender.com/api/streams");
      setStreams(response.data);
      setFilteredStreams(response.data);
    } catch (error) {
      toast.error("Failed to fetch streams");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = streams.filter(
      (stream) =>
        stream.name &&
        stream.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStreams(filtered);
  }, [searchTerm, streams]);

  // Handle navigation to StudentPerStream.jsx
  const handleStreamClick = (streamName) => {
    const year = "2024-2025";
    navigate(`/students/${streamName}/${year}`);
  };

  // Handle Delete Stream
  const handleDelete = async () => {
    if (!selectedStream || !selectedStream._id) {
      toast.error("No stream selected for deletion");
      return;
    }

    setOperationLoading(prev => ({...prev, delete: true}));
    try {
      await axios.delete(`https://eps-dashboard.onrender.com/api/streams/${selectedStream._id}`);
      await fetchStreams();
      setShowDeleteModal(false);
      toast.success("Stream deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete stream");
      console.error(error);
    } finally {
      setOperationLoading(prev => ({...prev, delete: false}));
    }
  };

  // Handle Update Stream
  const handleUpdate = (id) => {
    const streamToUpdate = streams.find((stream) => stream._id === id);
    if (!streamToUpdate) {
      toast.error("Stream not found");
      return;
    }
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
    if (!selectedStream || !selectedStream._id) {
      toast.error("No valid stream selected for update");
      return;
    }

    setOperationLoading(prev => ({...prev, update: true}));
    try {
      await axios.put(
        `https://eps-dashboard.onrender.com/api/streams/${selectedStream._id}`,
        updatedStream
      );
      await fetchStreams();
      setShowUpdateModal(false);
      toast.success("Stream updated successfully!");
    } catch (error) {
      toast.error("Failed to update stream");
      console.error(error);
    } finally {
      setOperationLoading(prev => ({...prev, update: false}));
    }
  };

  // Handle Add Stream Submit
  const handleAddStreamSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(prev => ({...prev, add: true}));
    try {
      await axios.post("https://eps-dashboard.onrender.com/api/streams", newStream);
      await fetchStreams();
      setShowAddStreamModal(false);
      toast.success("Stream added successfully!");
      setNewStream({ name: "", teacher: "" });
    } catch (error) {
      toast.error("Failed to add stream");
      console.error(error);
    } finally {
      setOperationLoading(prev => ({...prev, add: false}));
    }
  };

  // Handle Promote Learners
  const handlePromoteLearners = async () => {
    setOperationLoading(prev => ({...prev, promote: true}));
    try {
      await axios.post("https://eps-dashboard.onrender.com/api/learners/promote", promoteData);
      await fetchStreams();
      toast.success("Learners promoted successfully!");
      setShowPromoteModal(false);
    } catch (error) {
      toast.error("Failed to promote learners");
      console.error(error);
    } finally {
      setOperationLoading(prev => ({...prev, promote: false}));
    }
  };

  // Toggle Sidebar
  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          sideBar ? "w-0 md:w-72" : "w-0"
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>
      
      {/* Main Content */}
      <div className="bg-gray-50 w-full min-h-screen">
        {/* Header */}
        <div className="flex px-6 py-2 border-b bg-white justify-between items-center">
          <MobileNav />
          <div className="hidden md:flex">
            <SidebarToggleButton
              toggleSidebar={toggleSideBar}
              isSidebarCollapsed={!sideBar}
            />
          </div>
          <p className="text-xl font-semibold text-gray-800 hidden md:flex">
            Streams
          </p>
          <div className="hidden md:flex flex-grow max-w-xs">
            <input
              type="text"
              placeholder="Search stream"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <ActionButton
            onClick={() => setShowAddStreamModal(true)}
            tooltip="Add a new stream"
            color="green"
            className="rounded-full"
          >
            <span className="hidden md:inline"><FaPlus/></span>
            <span className="md:hidden">+</span>
          </ActionButton>
          <ActionButton
            onClick={() => setShowPromoteModal(true)}
            tooltip="Promote learners to next grade"
            color="purple"
            className="hidden md:flex rounded-full"
          >
            Promote
          </ActionButton>
          <UserAccount />
        </div>

        {/* Body */}
        <div className="grid overflow-y-auto max-h-[90vh] pb-8 gap-6 px-6 py-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <p className="text-xl font-semibold text-gray-800 md:hidden mx-5">
            Streams
          </p>
          <div className="flex mt-2 justify-between mx-3 md:hidden">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search stream"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <ActionButton
              onClick={() => setShowPromoteModal(true)}
              tooltip="Promote learners to next grade"
              color="purple"
              className="rounded-full"
            >
              Promote
            </ActionButton>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center col-span-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredStreams.length > 0 ? (
            filteredStreams.map((stream, index) => (
              <div
                key={index}
                className="border rounded-lg bg-white hover:bg-slate-100 transition duration-300 cursor-pointer"
                onClick={() => handleStreamClick(stream.name)}
              >
                <div className="p-4">
                  <p className="font-semibold text-lg text-gray-800">
                    {stream.name}
                  </p>
                  <p className="text-sm text-gray-600">{stream.teacher}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(stream.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated: {new Date(stream.updatedAt).toLocaleString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-4">
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(stream._id);
                      }}
                      tooltip="Edit this stream"
                      color="blue"
                    >
                      Update
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStream(stream);
                        setShowDeleteModal(true);
                      }}
                      tooltip="Delete this stream"
                      color="red"
                    >
                      Delete
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No streams found.
            </div>
          )}
        </div>

        {/* Modals */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-4">
                Are you sure you want to delete this stream?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone.
              </p>
              <div className="flex justify-between">
                <ActionButton
                  onClick={handleDelete}
                  tooltip="Confirm deletion"
                  color="red"
                  isLoading={operationLoading.delete}
                >
                  Yes, Delete
                </ActionButton>
                <ActionButton
                  onClick={() => setShowDeleteModal(false)}
                  tooltip="Cancel deletion"
                  color="gray"
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {showUpdateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-4">Update Stream</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stream Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={updatedStream.name}
                    onChange={(e) =>
                      setUpdatedStream({
                        ...updatedStream,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="teacher"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Teacher
                  </label>
                  <input
                    id="teacher"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={updatedStream.teacher}
                    onChange={(e) =>
                      setUpdatedStream({
                        ...updatedStream,
                        teacher: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <ActionButton
                    type="submit"
                    tooltip="Save changes"
                    color="blue"
                    isLoading={operationLoading.update}
                  >
                    Update
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    tooltip="Discard changes"
                    color="gray"
                  >
                    Cancel
                  </ActionButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddStreamModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-4">Add New Stream</h3>
              <form onSubmit={handleAddStreamSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stream Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newStream.name}
                    onChange={(e) =>
                      setNewStream({ ...newStream, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="teacher"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Teacher
                  </label>
                  <input
                    id="teacher"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={newStream.teacher}
                    onChange={(e) =>
                      setNewStream({ ...newStream, teacher: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <ActionButton
                    type="submit"
                    tooltip="Create new stream"
                    color="green"
                    isLoading={operationLoading.add}
                  >
                    Add Stream
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={() => setShowAddStreamModal(false)}
                    tooltip="Cancel creation"
                    color="gray"
                  >
                    Cancel
                  </ActionButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPromoteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-4">Promote Learners</h3>
              <form onSubmit={handlePromoteLearners}>
                <div className="mb-4">
                  <label
                    htmlFor="currentGrade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Grade
                  </label>
                  <input
                    id="currentGrade"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={promoteData.currentGrade}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        currentGrade: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="currentStream"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Stream
                  </label>
                  <input
                    id="currentStream"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={promoteData.currentStream}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        currentStream: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="newGrade"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Grade
                  </label>
                  <input
                    id="newGrade"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={promoteData.newGrade}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        newGrade: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="newStream"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Stream
                  </label>
                  <input
                    id="newStream"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={promoteData.newStream}
                    onChange={(e) =>
                      setPromoteData({
                        ...promoteData,
                        newStream: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <ActionButton
                    type="submit"
                    tooltip="Confirm promotion"
                    color="purple"
                    isLoading={operationLoading.promote}
                  >
                    Promote
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={() => setShowPromoteModal(false)}
                    tooltip="Cancel promotion"
                    color="gray"
                  >
                    Cancel
                  </ActionButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
      <Tooltip id="main-tooltip" effect="solid" />
    </div>
  );
};

export default Streams;