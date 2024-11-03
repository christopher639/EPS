import React from 'react'
import { NavLink } from 'react-router-dom'


const SideBar = () => {
   
  return (
    <div >
      <div className=' min-h-full   pr-5'>
           
      <NavLink  to='/select-subject'>
           <div className='list-none hover:cursor-pointer hover:bg-slate-800 hover:text-white  border-b text-lg pt-3'>
               <li className='ml-2' >HOME</li>
            </div>
           </NavLink>
           <NavLink  to='/entermarks'>
           <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2' >LEARNING AREAS</li>
            </div>
           </NavLink>
              
           <NavLink to='/performance'>
           <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2' >PERFORMANCE</li>
            </div>
           </NavLink>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2' >MESSAGES</li>
            </div>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2' >ANALYTICS</li>
            </div>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2' >SETTINGS</li>
            </div>
            <div className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
               <li className='ml-2' >PROFILE</li>
            </div>
      </div>
     
    </div>
  )
}

export default SideBar
