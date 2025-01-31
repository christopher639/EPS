import React,{useState} from 'react'
import InstructorSideBar from '../../components/InstuctorSideBar'
import SidebarToggleButton from '../../components/SidebarToggleButton'
import UserAccount from '../../components/UserAccount'

const InstructorDashboard = () => {
    const [sideBar, setSideBar] = useState(true); // To control the visibility of the sidebar
    const toggleSideBar = () => {
        setSideBar((prev) => !prev); // Toggle sidebar visibility
      };
    
  return (
    <div className='flex'>
        <div>
            {/**InstructorSide bar */}
            <InstructorSideBar/>
        </div>
        <div className='w-full'>
               {/* Header */}
        <div className='flex justify-between items-center bg-white shadow-sm p-4 border-b'>
          <div className='flex items-center gap-3'>
          <SidebarToggleButton toggleSidebar={toggleSideBar} isSidebarCollapsed={!sideBar} />
            <h1 className="text-sm md:text-md lg:text-xl font-bold text-gray-800">KIBABII SCHOOL</h1>
            <p className=" hidden md:flex text-gray-500">Instuctor Dashboard</p>
          </div>
          <div className='flex items-center gap-4'>
            <UserAccount />
          </div>
        </div>
            {/**Main content for side bar */}

        </div>
    </div>
  )
}

export default InstructorDashboard