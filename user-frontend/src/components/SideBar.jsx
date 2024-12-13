import React from 'react'
import { NavLink } from 'react-router-dom'
const SideBar = () => {
  return (
    <div >
      <div className=' min-h-full px-5  bg-gray-200  pr-5'>
           
      <NavLink  to='/select-subject'>
           <div className='list-none hover:cursor-pointer hover:bg-slate-800 hover:text-white  border-b text-lg pt-3'>
               <li className='ml-2' >HOME</li>
            </div>
           </NavLink>
           <NavLink  to='/entermarks'>
           <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='text-sm ml-2 whitespace-nowrap' >LEARNING AREAS</li>
            </div>
           </NavLink>
              
           <NavLink to='/performance'>
           <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2 text-sm whitespace no-wrap' >PERFORMANCE</li>
            </div>
           </NavLink>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2 text-sm whitespace no-wrap' >MESSAGES</li>
            </div>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2 text-sm whitespace no-wrap' >ANALYTICS</li>
            </div>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2 text-sm whitespace no-wrap' >SETTINGS</li>
            </div>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2 text-sm whitespace no-wrap' >PROFILE</li>
            </div>
      </div>
     
    </div>
  )
}

export default SideBar
