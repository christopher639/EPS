import { useState, useEffect } from 'react'
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa'
import SideBar from '../components/SideBar'
import SidebarToggleButton from '../components/SidebarToggleButton'
import UserAccount from '../components/UserAccount'
import MobileNav from '../components/MobileNav'

const Clases = () => {
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [sideBar, setSideBar] = useState(true)
  const [operationLoading, setOperationLoading] = useState({
    create: false,
    update: false,
    delete: false
  })

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  // Form states
  const [newClase, setNewClase] = useState({
    clasename: '',
    claseteacher: ''
  })
  
  const [currentClase, setCurrentClase] = useState({
    _id: '',
    clasename: '',
    claseteacher: ''
  })

  // Toggle sidebar visibility
  const toggleSideBar = () => {
    setSideBar((prev) => !prev)
  }

  // Fetch all clases
  const fetchClases = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('https://eps-dashboard.onrender.com/api/clase')
      setClases(data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClases()
  }, [])

  // Handle create clase
  const handleCreate = async () => {
    setOperationLoading({...operationLoading, create: true})
    try {
      const { data } = await axios.post('https://eps-dashboard.onrender.com/api/clase', newClase)
      setClases([...clases, data.clase])
      setIsCreateOpen(false)
      setNewClase({ clasename: '', claseteacher: '' })
      setSuccess('Class created successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setOperationLoading({...operationLoading, create: false})
    }
  }

  // Handle update clase
  const handleUpdate = async () => {
    setOperationLoading({...operationLoading, update: true})
    try {
      const { data } = await axios.put(
        `https://eps-dashboard.onrender.com/api/clase/${currentClase._id}`,
        currentClase
      )
      setClases(clases.map(clase => 
        clase._id === currentClase._id ? data.clase : clase
      ))
      setIsEditOpen(false)
      setSuccess('Class updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setOperationLoading({...operationLoading, update: false})
    }
  }

  // Handle delete clase
  const handleDelete = async () => {
    setOperationLoading({...operationLoading, delete: true})
    try {
      await axios.delete(`https://eps-dashboard.onrender.com/api/clase/${currentClase._id}`)
      setClases(clases.filter(clase => clase._id !== currentClase._id))
      setIsDeleteOpen(false)
      setSuccess('Class deleted successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setOperationLoading({...operationLoading, delete: false})
    }
  }

  // Open edit modal
  const openEditModal = (clase) => {
    setCurrentClase({
      _id: clase._id,
      clasename: clase.clasename,
      claseteacher: clase.claseteacher
    })
    setIsEditOpen(true)
  }

  // Open delete modal
  const openDeleteModal = (clase) => {
    setCurrentClase({
      _id: clase._id,
      clasename: clase.clasename
    })
    setIsDeleteOpen(true)
  }

  return (
    <div className='flex bg-gray-50 min-h-screen'>
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${sideBar ? 'w-0 md:w-64' : 'w-0'} bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex flex-col w-full min-h-screen'>
        {/* Header */}
        <header className='flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 shadow-sm'>
          <div className='flex items-center'>
            <MobileNav />
            <div className='hidden md:flex'>
              <SidebarToggleButton
                toggleSidebar={toggleSideBar}
                isSidebarCollapsed={!sideBar}
              />
            </div>
            <h1 className='text-lg font-semibold text-gray-800 ml-2 hidden md:block'>Classes Management</h1>
          </div>
          
          <div className='flex items-center gap-2'>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition"
              data-tooltip-id="actions-tooltip"
              data-tooltip-content="Add new class"
            >
              <FaPlus className="text-sm" />
              <span className="hidden md:inline">Add Class</span>
            </button>
            <UserAccount />
          </div>
        </header>

        {/* Main Content Area */}
        <main className='p-4 md:p-6'>
          {/* Status Messages */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {clases.length > 0 ? (
                clases.map((clase) => (
                  <div key={clase._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition duration-200">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{clase.clasename}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {clase.claseteacher || 'No teacher assigned'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Created: {new Date(clase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(clase)}
                        className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition flex items-center"
                        data-tooltip-id="actions-tooltip"
                        data-tooltip-content="Edit class"
                      >
                        <FaEdit className="text-sm" />
                        <span className="ml-1 text-sm hidden md:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(clase)}
                        className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition flex items-center"
                        data-tooltip-id="actions-tooltip"
                        data-tooltip-content="Delete class"
                      >
                        <FaTrash className="text-sm" />
                        <span className="ml-1 text-sm hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <div className="text-gray-500 mb-4">No classes found</div>
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Add Your First Class
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Create Class Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Class</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newClase.clasename}
                      onChange={(e) => setNewClase({...newClase, clasename: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="e.g. Grade 1"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher
                    </label>
                    <input
                      type="text"
                      id="teacher"
                      value={newClase.claseteacher}
                      onChange={(e) => setNewClase({...newClase, claseteacher: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  onClick={handleCreate}
                  disabled={operationLoading.create}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {operationLoading.create ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : 'Save'}
                </button>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Class Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Class</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="editName"
                      value={currentClase.clasename}
                      onChange={(e) => setCurrentClase({...currentClase, clasename: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="editTeacher" className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher
                    </label>
                    <input
                      type="text"
                      id="editTeacher"
                      value={currentClase.claseteacher}
                      onChange={(e) => setCurrentClase({...currentClase, claseteacher: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  onClick={handleUpdate}
                  disabled={operationLoading.update}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {operationLoading.update ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : 'Update'}
                </button>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete the class <span className="font-semibold">"{currentClase.clasename}"</span>? This action cannot be undone.
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  onClick={handleDelete}
                  disabled={operationLoading.delete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {operationLoading.delete ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : 'Delete'}
                </button>
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tooltip */}
        <Tooltip id="actions-tooltip" effect="solid" place="top" className="text-xs" />
      </div>
    </div>
  )
}

export default Clases