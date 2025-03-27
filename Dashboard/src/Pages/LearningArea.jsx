import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import UserAccount from '../components/UserAccount';
import 'react-toastify/dist/ReactToastify.css';
import SidebarToggleButton from '../components/SidebarToggleButton';
import SideBar from '../components/SideBar';
import BASE_URL from '../config';
import { ClipLoader } from 'react-spinners'; // Import a spinner component
import MobileNav from '../components/MobileNav';

axios.defaults.baseURL = BASE_URL;

const LearningArea = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [sideBar, setSideBar] = useState(true); // To control the visibility of the sidebar
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for managing the search query
  const [showModal, setShowModal] = useState(false); // For adding/updating learning areas
  const [formData, setFormData] = useState({
    subjectname: '',
    code: '',
    description: '',
    department: '',
    instructor: '',
    status: '',
    language: '',
    duration: 12,
    content: '', // New attribute for content
  });
  const [editingId, setEditingId] = useState(null); // For identifying which learning area is being edited
  const [isCreating, setIsCreating] = useState(false); // State to manage the create button spinner
  const [isUpdating, setIsUpdating] = useState(false); // State to manage the update button spinner
  const [isDeleting, setIsDeleting] = useState(null); // State to manage the delete button spinner

  // Fetch learning areas from the API
  const fetchLearningAreas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/learning-areas');
      setLearningAreas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching learning areas:', error);
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchLearningAreas();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle creating a new learning area
  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // Debugging line

    if (!formData.subjectname || !formData.code || !formData.description || !formData.content) {
      toast.error('Subject Name, Code, Description, and Content are required!');
      return;
    }

    setIsCreating(true); // Start the spinner

    try {
      const response = await axios.post('http://localhost:3000/api/learning-areas', formData);
      console.log("Server response:", response.data); // Debugging line
      toast.success('Learning area created successfully!');
      fetchLearningAreas(); // Refresh the list
      setShowModal(false); // Close the modal
      setFormData({  // Reset form fields after successful creation
        subjectname: '',
        code: '',
        description: '',
        department: '',
        instructor: '',
        status: '',
        language: '',
        duration: 12,
        content: '',
      });
    } catch (error) {
      console.error('Error creating learning area:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error creating learning area.');
    } finally {
      setIsCreating(false); // Stop the spinner
    }
  };

  // Handle updating an existing learning area
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.subjectname || !formData.code || !formData.description || !formData.content) {
      toast.error('Subject Name, Code, Description, and Content are required!');
      return;
    }

    setIsUpdating(true); // Start the spinner

    try {
      await axios.put(`http://localhost:3000/api/learning-areas/${editingId}`, formData);
      toast.success('Learning area updated successfully!');
      fetchLearningAreas(); // Refresh the list
      setShowModal(false); // Close the modal
      setEditingId(null); // Reset editingId
    } catch (error) {
      toast.error('Error updating learning area.');
    } finally {
      setIsUpdating(false); // Stop the spinner
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    setIsDeleting(id); // Start the spinner for the specific delete button

    try {
      await axios.delete(`http://localhost:3000/api/learning-areas/${id}`);
      toast.success('Learning area deleted successfully!');
      fetchLearningAreas(); // Refresh the list
    } catch (error) {
      toast.error('Error deleting learning area.');
    } finally {
      setIsDeleting(null); // Stop the spinner
    }
  };

  // Set the form data for editing
  const handleEdit = (learningArea) => {
    setFormData({
      subjectname: learningArea.subjectname,
      code: learningArea.code,
      description: learningArea.description,
      department: learningArea.department,
      instructor: learningArea.instructor,
      status: learningArea.status,
      language: learningArea.language,
      duration: learningArea.duration,
      content: learningArea.content, // Set the content for editing
    });
    setEditingId(learningArea._id);
    setShowModal(true); // Open modal for editing
  };

  // Handle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
    setFormData({}); // Reset form data when closing
    setEditingId(null); // Reset editing ID when closing
  };

  const toggleSideBar = () => {
    setSideBar((prev) => !prev); // Toggle sidebar visibility
  };

  // Filtered learning areas based on the search query
  const filteredLearningAreas = learningAreas.filter(
    (learningArea) =>
      learningArea.subjectname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      learningArea.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <div
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}
      >
        <SideBar /> {/* Conditionally render based on sidebar state */}
      </div>
      <div className="flex flex-col w-full bg-gray-50">
        <div className="flex justify-between items-center bg-white shadow-sm p-2 border-b">
          <MobileNav />
          <div className='hidden md:flex'>
            <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
          </div>
          <div>
            <p className="text-sm hidden md:text-lg md:text-xl lg:text-2xl font-bold mb-6 md:flex">Learning Areas</p>
          </div>

          {/* Search Input */}
          <div className="mb-2 hidden md:flex  items-center">
            <input
              type="text"
              placeholder="Name or Code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 border border-gray-300 rounded-lg max-w-32"
            />
          </div>

          {/* Button to show modal for adding new learning area */}
          <button
            onClick={() => setShowModal(true)}
            className="mb-2 flex gap-1 px-2 bg-green-600 text-white rounded-full"
          > 
            <p>+</p>
            <p className='hidden md:flex'> Add</p>
          </button>
          <UserAccount />
        </div>

        {/* Grid layout for Learning Areas */}
        <div className="overflow-x-auto overflow-y-auto max-h-[86vh] bg-white rounded-lg p-4">
          {/* Grid container for learning areas */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color="#4A90E2" size={50} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLearningAreas.map((learningArea) => (
                <div key={learningArea._id} className="bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col">
                  {/* Learning Area Info */}
                  <h3 className="font-semibold text-lg mb-2">{learningArea.subjectname}</h3>
                  <p className="text-sm text-gray-700">Code: {learningArea.code}</p>
                  <p className="text-sm text-gray-700">Level: {learningArea.level}</p>
                  <p className="text-sm text-gray-700">Instructor: {learningArea.instructor}</p>
                  <p className="text-sm text-gray-700 mt-2">{learningArea.description}</p>
                  <p className="text-sm text-gray-700 mt-2 font-semibold">Content:</p>
                  <p className="text-sm text-gray-700">{learningArea.content}</p> {/* Display the content */}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(learningArea)}
                      className="bg-blue-600 text-white py-1 px-3 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(learningArea._id)}
                      className="bg-red-600 text-white py-1 px-3 rounded-md"
                      disabled={isDeleting === learningArea._id}
                    >
                      {isDeleting === learningArea._id ? (
                        <ClipLoader color="#ffffff" size={20} />
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for creating or editing a learning area */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full md:w-2/3">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Learning Area' : 'Add New Learning Area'}</h2>
              <form onSubmit={editingId ? handleUpdate : handleCreate}>
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-1 overflow-y-auto max-h-[80vh]">
                  {/* Form fields */}
                  <div>
                    <label className="block text-sm text-gray-700">Subject Name</label>
                    <input
                      type="text"
                      name="subjectname"
                      value={formData.subjectname || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Code</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Level</label>
                    <input
                      type="text"
                      name="level"
                      value={formData.level || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Content</label>
                    <textarea
                      name="content"
                      value={formData.content || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Status</label>
                    <input
                      type="text"
                      name="status"
                      value={formData.status || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Language</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Instructor</label>
                    <input
                      type="text"
                      name="instructor"
                      value={formData.instructor || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Duration (in weeks)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration || 12}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md"
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating || isUpdating ? (
                        <ClipLoader color="#ffffff" size={20} />
                      ) : editingId ? (
                        'Update'
                      ) : (
                        'Create'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default LearningArea;