import React from 'react'
import {useState } from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
const [mobileBar,setMobileBar] = useState(false)

  return (
    <div className='flex max-h-[80vh] overflow-y-auto justify-between p-2 '>

            <div className='ml-3 gap-4 flex flex-row'>
            {
                  mobileBar &&(
                    <div className="fixed md:hidden w-1/2 inset-0 bg-black bg-opacity-50 backdrop-blur-[0px] flex  ">
                     <div className='bg-white w-full border-r border-slate-500'>
                     <div className='pl-4 flex flex-col gap-5'>
                        <div className='border-b flex   gap-2  py-5'>
                          <div>
                          <img className='w-10 h-10 ' src="kibabiilogo.jpeg" alt="" />
                          </div>
                    
                        <div className='flex  w-full mr-1  justify-between'>
                        <p className='text-lg pt-2'>KIBABII SCHOOL</p>
                          <p className=' mt-2 bg-green-800 h-6 rounded-full cursor-pointer '>
                            <svg  onClick={()=>setMobileBar(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z"/></svg>
                         </p>
                  
                        </div>
                          </div>
        <div className=' min-h-full    overflow-y-auto '>
           
           <NavLink  to='/select-subject'>
                <div  onClick={()=>setMobileBar(false)}  className='list-none hover:cursor-pointer hover:bg-slate-800 hover:text-white  border-b text-lg py-4'>
                    <li className='ml-2' >HOME</li>
                 </div>
                </NavLink>
                <NavLink  to='/entermarks'>
                <div  onClick={()=>setMobileBar(false)}  className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
                    <li className='ml-2' >LEARNING AREAS</li>
                 </div>
                </NavLink>
                   
                <NavLink to='/performance'>
                <div  onClick={()=>setMobileBar(false)} className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
                    <li className='ml-2' >PERFORMANCE</li>
                 </div>
                </NavLink>
                 <div  onClick={()=>setMobileBar(false)} className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
                    <li className='ml-2' >MESSAGES</li>
                 </div>
                 <div  onClick={()=>setMobileBar(false)} className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
                    <li className='ml-2' >ANALYTICS</li>
                 </div>
                 <div  onClick={()=>setMobileBar(false)} className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
                    <li className='ml-2' >SETTINGS</li>
                 </div>
                 <div  onClick={()=>setMobileBar(false)} className='list-none  hover:bg-slate-800 hover:text-white  hover:cursor-pointer border-b text-lg pt-3'>
                    <li className='ml-2' >PROFILE</li>
                 </div>
           </div>
                     </div>
                     </div>
                    </div>
                  )
                }
                    <img className='w-12 h-12' src="kibabiilogo.jpeg" alt="Description of image" />
                    <div>
                    <button onClick={()=>setMobileBar(true)}  >
                    <svg  className='mt-3 md:hidden' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                    </button>
                  </div>
                  <div className=''>
                    <p className='mt-2  md:text-2xl'>KIBABII SCHOOL</p>
                  </div>
            </div>
            <div  className='flex justify-between gap-5'>
                
            
                    <div className='mr-3'>
                    <img className='w-12 border rounded-full h-12' src="profileimg.jpg" alt="Description of image" />
                    </div>
                </div>
               
    </div>
  )
}

export default NavBar
