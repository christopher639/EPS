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
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUserGraduate } from "react-icons/fa";

axios.defaults.baseURL = "https://eps-dashboard.onrender.com";

const ActionButton = ({ 
  onClick, 
  children, 
  tooltip, 
  color = "blue", 
  isLoading = false,
  className = "",
  icon: Icon,
  ...props 
}) => {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    gray: "bg-gray-500 hover:bg-gray-600"
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-white rounded-lg transition duration-300 flex items-center justify-center gap-2 ${colors[color]} ${className}`}
      data-tooltip-id="main-tooltip"
      data-tooltip-content={tooltip}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? <Icon className="text-sm" /> : null}
      <span className="text-sm">{children}</span>
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
  const [newStream, setNewStream] = useState({ name: "", teacher: "", clase: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clases, setClases] = useState([]);
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
      const response = await axios.get("/api/streams");
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

  // Fetch all clases
  const fetchClases = async () => {
    try {
      const { data } = await axios.get('/api/clase');
      setClases(data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchClases();
  }, []);

  // Handle Delete Stream
  const handleDelete = async () => {
    if (!selectedStream || !selectedStream._id) {
      toast.error("No stream selected for deletion");
      return;
    }

    setOperationLoading(prev => ({...prev, delete: true}));
    try {
      await axios.delete(`/api/streams/${selectedStream._id}`);
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
      clase: streamToUpdate.clase?._id || ""
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
        `/api/streams/${selectedStream._id}`,
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
      await axios.post("/api/streams", newStream);
      await fetchStreams();
      setShowAddStreamModal(false);
      toast.success("Stream added successfully!");
      setNewStream({ name: "", teacher: "", clase: "" });
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
      await axios.post("/api/learners/promote", promoteData);
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
        className={`transition-all duration-300 ease-in-out ${
          sideBar ? "w-0 md:w-64" : "w-0"
        } bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>
      
      {/* Main Content */}
      <div className="bg-gray-50 w-full min-h-screen">
        {/* Header */}
        <header className="flex px-4 py-3 border-b bg-white justify-between items-center sticky top-0 z-10 shadow-sm">
          <MobileNav />
          <div className="hidden md:flex">
            <SidebarToggleButton
              toggleSidebar={toggleSideBar}
              isSidebarCollapsed={!sideBar}
            />
          </div>
          <h1 className="text-lg font-semibold text-gray-800 hidden md:block">
            Streams Management
          </h1>
          <div className="hidden md:flex flex-grow max-w-xs ml-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stream..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-48 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton
              onClick={() => setShowAddStreamModal(true)}
              tooltip="Add a new stream"
              color="green"
              icon={FaPlus}
              className="rounded-lg"
            >
              <span className="hidden md:inline">Add Stream</span>
            </ActionButton>
            <ActionButton
              onClick={() => setShowPromoteModal(true)}
              tooltip="Promote learners to next grade"
              color="purple"
              icon={FaUserGraduate}
              className="rounded-lg hidden md:flex"
            >
              Promote
            </ActionButton>
            <UserAccount />
          </div>
        </header>

        {/* Body */}
        <main className="p-4 md:p-6  overflow-y-auto max-h-[80vh]">
          <div className="md:hidden mb-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-3">Streams</h1>
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              <ActionButton
                onClick={() => setShowPromoteModal(true)}
                tooltip="Promote learners"
                color="purple"
                icon={FaUserGraduate}
                className="rounded-lg"
              >
                <span className="sr-only">Promote</span>
              </ActionButton>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredStreams.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStreams.map((stream) => (
                <div
                  key={stream._id}
                  className="border rounded-lg bg-white hover:bg-gray-50 transition duration-200 cursor-pointer  overflow-hidden"
                  onClick={() => handleStreamClick(stream.name)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-base">
                          {stream.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {stream.clase?.name || "No class assigned"}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {stream.studentCount || 0} students
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Teacher:</span> {stream.teacher || "Not assigned"}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <p>Created: {new Date(stream.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(stream.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(stream._id);
                          }}
                          tooltip="Edit this stream"
                          color="blue"
                          icon={FaEdit}
                          className="px-2 py-1 text-xs"
                        >
                          <span className="sr-only">Edit</span>
                        </ActionButton>
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStream(stream);
                            setShowDeleteModal(true);
                          }}
                          tooltip="Delete this stream"
                          color="red"
                          icon={FaTrash}
                          className="px-2 py-1 text-xs"
                        >
                          <span className="sr-only">Delete</span>
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">No streams found.</p>
              <ActionButton
                onClick={() => setShowAddStreamModal(true)}
                tooltip="Add your first stream"
                color="green"
                className="mt-4"
                icon={FaPlus}
              >
                Add Stream
              </ActionButton>
            </div>
          )}
        </main>

        {/* Modals */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-3">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-medium">"{selectedStream?.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <ActionButton
                  onClick={() => setShowDeleteModal(false)}
                  tooltip="Cancel deletion"
                  color="gray"
                  className="text-sm"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={handleDelete}
                  tooltip="Confirm deletion"
                  color="red"
                  isLoading={operationLoading.delete}
                  className="text-sm"
                >
                  Delete
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {showUpdateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Update Stream</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label htmlFor="update-clase" className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    id="update-clase"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={updatedStream.clase}
                    onChange={(e) => setUpdatedStream({...updatedStream, clase: e.target.value})}
                  >
                    <option value="">Select a class</option>
                    {clases.map(clase => (
                      <option key={clase._id} value={clase._id}>{clase.clasename}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="update-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Stream Name
                  </label>
                  <input
                    id="update-name"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={updatedStream.name}
                    onChange={(e) => setUpdatedStream({...updatedStream, name: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="update-teacher" className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher
                  </label>
                  <input
                    id="update-teacher"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={updatedStream.teacher}
                    onChange={(e) => setUpdatedStream({...updatedStream, teacher: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <ActionButton
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    tooltip="Discard changes"
                    color="gray"
                    className="text-sm"
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    tooltip="Save changes"
                    color="blue"
                    isLoading={operationLoading.update}
                    className="text-sm"
                  >
                    Update
                  </ActionButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddStreamModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Add New Stream</h3>
              <form onSubmit={handleAddStreamSubmit}>
                <div className="mb-4">
                  <label htmlFor="add-clase" className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    id="add-clase"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={newStream.clase}
                    onChange={(e) => setNewStream({...newStream, clase: e.target.value})}
                    required
                  >
                    <option value="">Select a class</option>
                    {clases.map(clase => (
                      <option key={clase._id} value={clase._id}>{clase.clasename}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Stream Name
                  </label>
                  <input
                    id="add-name"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={newStream.name}
                    onChange={(e) => setNewStream({...newStream, name: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="add-teacher" className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher
                  </label>
                  <input
                    id="add-teacher"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={newStream.teacher}
                    onChange={(e) => setNewStream({...newStream, teacher: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <ActionButton
                    type="button"
                    onClick={() => setShowAddStreamModal(false)}
                    tooltip="Cancel creation"
                    color="gray"
                    className="text-sm"
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    tooltip="Create new stream"
                    color="green"
                    isLoading={operationLoading.add}
                    className="text-sm"
                  >
                    Add Stream
                  </ActionButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPromoteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Promote Learners</h3>
              <form onSubmit={handlePromoteLearners}>
                <div className="mb-4">
                  <label htmlFor="currentGrade" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Grade
                  </label>
                  <input
                    id="currentGrade"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={promoteData.currentGrade}
                    onChange={(e) => setPromoteData({...promoteData, currentGrade: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="currentStream" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stream
                  </label>
                  <input
                    id="currentStream"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={promoteData.currentStream}
                    onChange={(e) => setPromoteData({...promoteData, currentStream: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newGrade" className="block text-sm font-medium text-gray-700 mb-1">
                    New Grade
                  </label>
                  <input
                    id="newGrade"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={promoteData.newGrade}
                    onChange={(e) => setPromoteData({...promoteData, newGrade: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newStream" className="block text-sm font-medium text-gray-700 mb-1">
                    New Stream
                  </label>
                  <input
                    id="newStream"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={promoteData.newStream}
                    onChange={(e) => setPromoteData({...promoteData, newStream: e.target.value})}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <ActionButton
                    type="button"
                    onClick={() => setShowPromoteModal(false)}
                    tooltip="Cancel promotion"
                    color="gray"
                    className="text-sm"
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    tooltip="Confirm promotion"
                    color="purple"
                    isLoading={operationLoading.promote}
                    className="text-sm"
                  >
                    Promote
                  </ActionButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Tooltip id="main-tooltip" effect="solid" place="top" className="text-xs" />
    </div>
  );
};

export default Streams;