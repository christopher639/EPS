import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import SideBar from "../components/SideBar";
import UserAccount from '../components/UserAccount';
import SidebarToggleButton from '../components/SidebarToggleButton';
import MobileNav from '../components/MobileNav';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    teachingSubjects: [],
    department: "",
    tscNumber: "",
    employeeNumber: "",
    salary: "",
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bankName: ""
    }
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://eps-dashboard.onrender.com/api/teachers");
      setTeachers(response.data.data.reverse());
    } catch (error) {
      toast.error("Failed to fetch teachers");
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    
    try {
      await axios.delete(`https://eps-dashboard.onrender.com/api/teachers/${id}`);
      toast.success("Teacher deleted successfully");
      setTeachers(prev => prev.filter(teacher => teacher._id !== id));
    } catch (error) {
      toast.error("Failed to delete teacher");
      console.error("Error deleting teacher:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isUpdating) {
        await axios.put(`https://eps-dashboard.onrender.com/api/teachers/${formData._id}`, formData);
        toast.success("Teacher updated successfully");
      } else {
        await axios.post("https://eps-dashboard.onrender.com/api/teachers", formData);
        toast.success("Teacher added successfully");
      }
      setShowModal(false);
      fetchTeachers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error submitting teacher:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateClick = (teacher) => {
    setIsUpdating(true);
    setFormData({
      ...teacher,
      teachingSubjects: [...teacher.teachingSubjects] // Ensure array is copied
    });
    setShowModal(true);
  };

  const handleAddClick = () => {
    setIsUpdating(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      teachingSubjects: [],
      department: "",
      tscNumber: "",
      employeeNumber: "",
      salary: "",
      bankAccount: {
        accountName: "",
        accountNumber: "",
        bankName: ""
      }
    });
    setShowModal(true);
  };

  const toggleSideBar = () => setSideBar(prev => !prev);

  const filteredTeachers = teachers.filter(teacher => 
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (teacher.tscNumber && teacher.tscNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${sideBar ? 'w-0 md:w-64' : 'w-0'} bg-gray-800`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white py-[19px] shadow-sm'>
          <div className='px-4  flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <MobileNav />
              <div className='hidden md:block'>
                <SidebarToggleButton 
                  toggleSidebar={toggleSideBar} 
                  isSidebarCollapsed={!sideBar} 
                />
              </div>
              <h1 className='text-xl font-semibold text-gray-800'>Teachers Management</h1>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <input
                  type="text"
                  placeholder="Search teachers..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FaPlus className="text-sm" />
                <span className="hidden md:inline">Add Teacher</span>
              </button>

              <UserAccount />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className='flex-1 overflow-y-auto p-4'>
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Teachers Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher, index) => (
                        <tr key={teacher._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teachers.length - index}</td>
                          <td 
                            className="px-6 py-4 whitespace-nowrap cursor-pointer"
                            // onClick={() => navigate(`/teachers/${teacher._id}`)}
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {teacher.firstName} {teacher.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.employeeNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateClick(teacher); }}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(teacher._id); }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No teachers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

    {/* Add/Edit Teacher Modal */}
{showModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          {isUpdating ? 'Edit Teacher Details' : 'Add New Teacher'}
        </h2>
        <button 
          onClick={() => setShowModal(false)}
          className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100">Personal Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100">Professional Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Languages">Languages</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-100"
                  value={formData.employeeNumber}
                  onChange={(e) => setFormData({...formData, employeeNumber: e.target.value})}
                  required
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TSC Number (if applicable)</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.tscNumber}
                  onChange={(e) => setFormData({...formData, tscNumber: e.target.value})}
                />
              </div>
            </div>

            {/* Teaching Subjects Card */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
              <h4 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100 mb-4">Teaching Subjects</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma separated)</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.teachingSubjects.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData, 
                    teachingSubjects: e.target.value.split(',').map(item => item.trim())
                  })}
                  placeholder="Mathematics, Physics, Chemistry"
                  required
                />
              </div>
            </div>

            {/* Salary Information Card */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100 mb-4">Salary Information</h4>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1 text-gray-500">KSh</span>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bank Information Card */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
              <h4 className="text-lg font-medium text-blue-600 border-b pb-2 border-blue-100">Bank Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.bankAccount.bankName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankAccount: {
                        ...formData.bankAccount,
                        bankName: e.target.value
                      }
                    })}
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="Equity Bank">Equity Bank</option>
                    <option value="KCB Bank">KCB Bank</option>
                    <option value="Co-operative Bank">Co-operative Bank</option>
                    <option value="Standard Chartered">Standard Chartered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.bankAccount.accountName}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankAccount: {
                        ...formData.bankAccount,
                        accountName: e.target.value
                      }
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.bankAccount.accountNumber}
                    onChange={(e) => setFormData({
                      ...formData, 
                      bankAccount: {
                        ...formData.bankAccount,
                        accountNumber: e.target.value
                      }
                    })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="inline-flex justify-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : isUpdating ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Teachers;