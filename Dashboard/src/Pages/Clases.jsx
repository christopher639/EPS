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
      <div className='flex flex-col w-full min-h-screen '>
        {/* Header */}
        <div className='flex justify-between items-center border-b shadow-sm md:border-none md:shadow-none p-4 bg-white sticky top-0 z-10'>
          <MobileNav />
          <div className='flex  gap-2'>
            <div className='hidden md:flex'>
              <SidebarToggleButton
                toggleSidebar={toggleSideBar}
                isSidebarCollapsed={!sideBar}
              />
            </div>
           
          </div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold text-gray-800'>Classes</h2>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add New Class
            </button>
          </div>
          <UserAccount />
        </div>

        {/* Main Content Area */}
        <div className='flex-1 overflow-auto p-4'>
        

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-y-auto max-h-[75vh]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clases.map((clase, index) => (
                    <tr key={clase._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{clase.clasename}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clase.claseteacher}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(clase.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(clase)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(clase)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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