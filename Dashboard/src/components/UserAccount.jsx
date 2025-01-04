import React, { useState } from 'react'
import {
    FaTachometerAlt,
    FaUniversity,
    FaBook,
    FaUsers,
    FaChalkboardTeacher,
    FaClipboardList,
    FaMoneyBillAlt,
    FaChartLine,
    FaUserCircle,
    FaChevronRight,
    FaChevronDown,
    FaFileAlt,
    FaBell,
    FaDotCircle,
  } from "react-icons/fa"; // Importing icons from react-icons
const UserAccount = () => {
  const [userLinks,setUserLinks] = useState(false)
  return (
    <div className='flex gap-3'>
        <div className='p-1 flex'>
            <FaBell className='text-slate-800 text-lg'/>
            <p className='text-sm text-red-600 '>2</p>
        </div>
        <div>
             <p>Welcome  Bundi</p>
        </div>
        <div className='px-3'>
            <FaUserCircle  onClick={()=>setUserLinks(true)} className='text-3xl '/>
        </div>
        {
        
        }
    </div>
  )
}

export default UserAccount