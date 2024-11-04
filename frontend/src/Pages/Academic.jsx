import React from 'react'
import { NavLink } from 'react-router-dom'

const  Academic = () => {
  return (
    <div >
            <div  className='  flex mx-4  justify-between mt-1 '>
                          <div className='flex  justify-between'>
                          
                             <input type="text" className='text-center border outline-none py-1 px-2 text-sm  cursor-pointer  mb-2' placeholder='Search'/>
                                <button onClick={()=>{alert("Not impleted by Bundi for now")}} className='text-center bg-green-600 py-1 px-2 text-sm  cursor-pointer text-white mb-2' >Search
                                </button>
                             </div>
                      

                          <div>
                            <button className='bg-green-700 text-white px-2 rounded'>NEW </button>
                           </div>
                </div>

      <div className='grid grid-cols-2 mt-4 md:grid-cols-2'>
        
      <NavLink  to='/marks'>
      <div className='min-w-full border  shadow-lg rounded items-center flex justify-center h-24'>
         <div className='flex flex-col'>
         <p>FORM 1X</p>
            <p>Number Of Students:</p>
            <p>Class teacher:</p>
         </div>
           
        </div>
      </NavLink>
      <NavLink to='/marks1y'>
        <div  className='min-w-full border shadow-lg rounded items-center flex justify-center h-24'>
            
            <div className='flex flex-col'>
         <p>FORM 1Y</p>
            <p>Number Of Students:</p>
            <p>Class teacher:</p>
         </div>
           
        </div>
      </NavLink>
    
      </div>
    </div>
  )
}

export default Academic
