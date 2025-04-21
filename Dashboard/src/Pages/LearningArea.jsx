import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import UserAccount from '../components/UserAccount';
import 'react-toastify/dist/ReactToastify.css';
import SidebarToggleButton from '../components/SidebarToggleButton';
import SideBar from '../components/SideBar';
import BASE_URL from '../config';
import { ClipLoader } from 'react-spinners';
import MobileNav from '../components/MobileNav';

// Primary color scheme
const primaryColors = {
  primary: '#4F46E5',       // Indigo
  secondary: '#10B981',     // Emerald
  danger: '#EF4444',        // Red
  warning: '#F59E0B',       // Amber
  lightBg: '#F9FAFB',       // Gray-50
  darkBg: '#1F2937',       // Gray-800
  textDark: '#111827',      // Gray-900
  textLight: '#6B7280',     // Gray-500
};

axios.defaults.baseURL = BASE_URL;

const LearningArea = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
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
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchLearningAreas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/learning-areas');
      setLearningAreas(response.data);
    } catch (error) {
      console.error('Error fetching learning areas:', error);
      toast.error('Failed to load learning areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningAreas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.subjectname || !formData.code || !formData.description || !formData.content) {
      toast.error('Please fill all required fields!');
      return;
    }

    setIsCreating(true);
    try {
      await axios.post('/api/learning-areas', formData);
      toast.success('Learning area created successfully!');
      fetchLearningAreas();
      setShowModal(false);
      setFormData({
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
      toast.error(error.response?.data?.message || 'Error creating learning area.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.subjectname || !formData.code || !formData.description || !formData.content) {
      toast.error('Please fill all required fields!');
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(`/api/learning-areas/${editingId}`, formData);
      toast.success('Learning area updated successfully!');
      fetchLearningAreas();
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      toast.error('Error updating learning area.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      await axios.delete(`/api/learning-areas/${id}`);
      toast.success('Learning area deleted successfully!');
      fetchLearningAreas();
    } catch (error) {
      toast.error('Error deleting learning area.');
    } finally {
      setIsDeleting(null);
    }
  };

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
      content: learningArea.content,
    });
    setEditingId(learningArea._id);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({
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
      setEditingId(null);
    }
  };

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  const filteredLearningAreas = learningAreas.filter(
    (learningArea) =>
      learningArea.subjectname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      learningArea.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'}`}
        style={{ backgroundColor: primaryColors.darkBg }}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full" style={{ backgroundColor: primaryColors.lightBg }}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <MobileNav />
              <div className='hidden md:flex'>
                <SidebarToggleButton 
                  toggleSidebar={toggleSideBar} 
                  isSidebarCollapsed={!sideBar} 
                  color={primaryColors.primary}
                />
              </div>
              <h1 className="text-xl font-bold" style={{ color: primaryColors.textDark }}>
                Learning Areas
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center">
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: primaryColors.textLight,
                    focusBorderColor: primaryColors.primary 
                  }}
                />
              </div>

              <button
                onClick={() => setShowModal(true)}
               className=" items-center bg-[rgb(232,240,254)] border border-[rgb(26,115,232)] text-blue-600 px-4 py-2 rounded-full hover:bg-[rgb(221,232,252)] transition-colors text-sm"
                style={{ 
             
                }}
              >
                <span>+</span>
                <span className='hidden md:inline'>Add New</span>
              </button>

              <UserAccount />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color={primaryColors.primary} size={50} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLearningAreas.map((learningArea) => (
                <div 
                  key={learningArea._id} 
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg" style={{ color: primaryColors.textDark }}>
                        {learningArea.subjectname}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full" 
                        style={{ 
                          backgroundColor: learningArea.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                          color: learningArea.status === 'active' ? '#065F46' : '#B91C1C'
                        }}
                      >
                        {learningArea.status || 'inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm" style={{ color: primaryColors.textLight }}>
                        <span className="font-medium" style={{ color: primaryColors.textDark }}>Code:</span> {learningArea.code}
                      </p>
                      <p className="text-sm" style={{ color: primaryColors.textLight }}>
                        <span className="font-medium" style={{ color: primaryColors.textDark }}>Instructor:</span> {learningArea.instructor || 'Not assigned'}
                      </p>
                      <p className="text-sm" style={{ color: primaryColors.textLight }}>
                        <span className="font-medium" style={{ color: primaryColors.textDark }}>Duration:</span> {learningArea.duration} weeks
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm" style={{ color: primaryColors.textDark }}>
                        {learningArea.description}
                      </p>
                    </div>

                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium mb-1" style={{ color: primaryColors.textDark }}>
                        Content:
                      </h4>
                      <p className="text-sm" style={{ color: primaryColors.textLight }}>
                        {learningArea.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                    <button
                      onClick={() => handleEdit(learningArea)}
                     className=" items-center bg-[rgb(232,240,254)] border border-[rgb(26,115,232)] text-blue-600 px-4 py-2 rounded-lg hover:bg-[rgb(221,232,252)] transition-colors text-sm"
                      style={{ 
                      
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(learningArea._id)}
                      className="px-3 py-1 text-sm rounded-md transition-colors duration-200"
                      style={{ 
                        backgroundColor: primaryColors.danger,
                        color: 'white',
                        hoverBg: '#DC2626' // Darker red
                      }}
                      disabled={isDeleting === learningArea._id}
                    >
                      {isDeleting === learningArea._id ? (
                        <ClipLoader color="#ffffff" size={15} />
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
            
            <div 
              className="bg-white rounded-xl my-5 shadow-2xl w-full max-w-3xl "
              style={{ scrollbarWidth: 'thin' }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{ color: primaryColors.textDark }}>
                    {editingId ? 'Edit Learning Area' : 'Create New Learning Area'}
                  </h2>
                  <button
                    onClick={toggleModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={editingId ? handleUpdate : handleCreate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 max-h-[80vh] overflow-y-auto gap-4 mb-6">
                    {/* Required Fields */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Subject Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subjectname"
                        value={formData.subjectname}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                        required
                      />
                    </div>

                    {/* Optional Fields */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Instructor
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                      >
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium" style={{ color: primaryColors.textDark }}>
                        Duration (weeks)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:outline-none"
                        style={{ 
                          borderColor: primaryColors.textLight,
                          focusRingColor: primaryColors.primary
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                      style={{ 
                        backgroundColor: '#E5E7EB',
                        color: primaryColors.textDark,
                        hoverBg: '#D1D5DB'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200"
                      style={{ 
                        backgroundColor: editingId ? primaryColors.primary : primaryColors.secondary,
                        hoverBg: editingId ? '#4338CA' : '#059669'
                      }}
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating || isUpdating ? (
                        <ClipLoader color="#ffffff" size={18} />
                      ) : editingId ? (
                        'Update Learning Area'
                      ) : (
                        'Create Learning Area'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default LearningArea;