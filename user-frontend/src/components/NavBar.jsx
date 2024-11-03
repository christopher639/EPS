import React from 'react'
import {useState } from 'react'

const NavBar = () => {
const [mobileBar,setMobileBar] = useState(false)

  return (
    <div className='flex  justify-between border-b p-2 border-slate-500'>

            <div className='ml-3 gap-4 flex flex-row'>
            {
                  mobileBar &&(
                    <div className="fixed md:hidden w-1/2 inset-0 bg-black bg-opacity-50 backdrop-blur-[0px] flex  ">
                     <div className='bg-white w-full border-r border-slate-500'>
                     <div className='pl-4 flex flex-col gap-5'>
                        <div className='border-b flex gap-51 py-5'>
                          <img className='w-10 h-10 ' src="kibabiilogo.jpeg" alt="" />
                          <p className='text-lg pt-2'>Kibabii School</p>
                          </div>
                        <div>Enter Marks</div>
                        <div>Performance</div>
                        <div>Messages</div>
                        <div>Profile</div>
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
