import { useState, useEffect } from 'react'
import axios from 'axios'
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
    try {
      const { data } = await axios.get('https://eps-dashboard.onrender.com/api/clase')
      setClases(data)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClases()
  }, [])

  // Handle create clase
  const handleCreate = async () => {
    try {
      const { data } = await axios.post('https://eps-dashboard.onrender.com/api/clase', newClase)
      setClases([...clases, data.clase])
      setIsCreateOpen(false)
      setNewClase({ clasename: '', claseteacher: '' })
      setSuccess('Class created successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  // Handle update clase
  const handleUpdate = async () => {
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
    }
  }

  // Handle delete clase
  const handleDelete = async () => {
    try {
      await axios.delete(`https://eps-dashboard.onrender.com/api/clase/${currentClase._id}`)
      setClases(clases.filter(clase => clase._id !== currentClase._id))
      setIsDeleteOpen(false)
      setSuccess('Class deleted successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
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
        className={`transition-all duration-700 ease-in-out ${sideBar ? 'w-0 md:w-72' : 'w-0'} bg-gray-800 min-h-screen`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex flex-col bg-white w-full  min-h-screen '>
        {/* Header */}
        <div className='flex justify-between items-center border-b shadow-sm md:border-none md:shadow-none p-4 bg-white sticky top-0 z-10'>
          <MobileNav />
          <div className='flex gap-2'>
            <div className='hidden md:flex'>
              <SidebarToggleButton
                toggleSidebar={toggleSideBar}
                isSidebarCollapsed={!sideBar}
              />
            </div>
            <div className='flex items-center'>
              <h2 className='text-md font-bold text-gray-800  hidden md:flex'>Classes</h2>
            </div>
          </div>
          <div className='flex items-between gap-4'>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 px-3 text-white px-4 py-2 rounded-lg transition"
            >
              Add 
            </button>
            <UserAccount />
          </div>
        </div>

        {/* Main Content Area */}
        <div className='mx-5'>
          {error && (
            <div className="bg-red-100  border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {clases.map((clase) => (
                <div key={clase._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{clase.clasename}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Teacher:</span> {clase.claseteacher || 'Not assigned'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(clase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(clase)}
                      className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(clase)}
                      className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Class Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Class</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newClase.clasename}
                      onChange={(e) => setNewClase({...newClase, clasename: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter class name"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter teacher name"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  onClick={handleCreate}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
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
                      Class Name
                    </label>
                    <input
                      type="text"
                      id="editName"
                      value={currentClase.clasename}
                      onChange={(e) => setCurrentClase({...currentClase, clasename: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  onClick={handleUpdate}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete the class "{currentClase.clasename}"? This action cannot be undone.
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
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
      </div>
    </div>
  )
}

export default Clases