import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LearningArea = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [loading, setLoading] = useState(true);
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
    studentsEnrolled: [],
  });
  const [editingId, setEditingId] = useState(null); // For identifying which learning area is being edited

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
    if (!formData.subjectname || !formData.code || !formData.description) {
      toast.error('Subject Name, Code, and Description are required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/learning-areas', formData);
      toast.success('Learning area created successfully!');
      fetchLearningAreas(); // Refresh the list
      setShowModal(false); // Close the modal
    } catch (error) {
      toast.error('Error creating learning area.');
    }
  };

  // Handle updating an existing learning area
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.subjectname || !formData.code || !formData.description) {
      toast.error('Subject Name, Code, and Description are required!');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/learning-areas/${editingId}`, formData);
      toast.success('Learning area updated successfully!');
      fetchLearningAreas(); // Refresh the list
      setShowModal(false); // Close the modal
      setEditingId(null); // Reset editingId
    } catch (error) {
      toast.error('Error updating learning area.');
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/learning-areas/${id}`);
      toast.success('Learning area deleted successfully!');
      fetchLearningAreas(); // Refresh the list
    } catch (error) {
      toast.error('Error deleting learning area.');
    }
  };

  // Set the form data for editing
  const handleEdit = (learningArea) => {
    setFormData({
      subjectname: learningArea.subjectname,
      code: learningArea.code,
      description: learningArea.description,
      department: learningArea.department,
      instructor: learningArea.instructor._id,
      status: learningArea.status,
      language: learningArea.language,
      duration: learningArea.duration,
      studentsEnrolled: learningArea.studentsEnrolled,
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

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Learning Areas</h1>

      {/* Button to show modal for adding new learning area */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 p-2 bg-green-600 text-white rounded-md"
      >
        Add New Learning Area
      </button>

      {/* Table of Learning Areas */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subject Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Code</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Instructor</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">No. of Students Enrolled</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student Registration Numbers</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {learningAreas.map((learningArea) => (
              <tr key={learningArea._id}>
                <td className="px-4 py-2">{learningArea.subjectname}</td>
                <td className="px-4 py-2">{learningArea.code}</td>
                <td className="px-4 py-2">{learningArea.description}</td>
                <td className="px-4 py-2">{learningArea.instructor?.email}</td>
                <td className="px-4 py-2">{learningArea.studentsEnrolled.length}</td>
                <td className="px-4 py-2">
                  {learningArea.studentsEnrolled.map((student) => (
                    <div key={student._id}>{student.regno}</div> // Display each student's registration number
                  ))}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(learningArea)}
                    className="bg-blue-600 text-white py-1 px-3 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(learningArea._id)}
                    className="bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating or editing a learning area */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full md:w-2/3">
            <h2 className="text-lg font-semibold">{editingId ? 'Edit Learning Area' : 'Add New Learning Area'}</h2>
            <form onSubmit={editingId ? handleUpdate : handleCreate}>
              <div className="space-y-4  grid grid-cols-3">
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
                  <label className="block text-sm text-gray-700">Duration (in weeks)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration || 12}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default LearningArea;
