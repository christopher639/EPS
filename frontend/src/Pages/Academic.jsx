import React from 'react'
import { NavLink } from 'react-router-dom'

const Academic = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className='flex justify-between mx-4 mt-4'>
        <div className='flex gap-2'>
          <input
            className='outline-none px-4 py-2 text-center border border-gray-300 rounded-md w-1/3'
            type="text"
            placeholder='Search'
          />
          <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
            Search
          </button>
        </div>
        <div>
          <button
            onClick={() => setUserForm(true)}
            className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
          >
            New
          </button>
        </div>
      </div>

      <div className="grid mx-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        
        <NavLink to="/marks">
          <div className="min-w-full border border-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex justify-center items-center h-32 p-4">
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold">FORM 1X</p>
              <p className="text-sm">TOTAL:</p>
              <p className="text-sm">COD:</p>
            </div>
          </div>
        </NavLink>

        <NavLink to="/marks1y">
          <div className="min-w-full border border-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex justify-center items-center h-32 p-4">
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold">FORM 1Y</p>
              <p className="text-sm">TOTAL:</p>
              <p className="text-sm">COD:</p>
            </div>
          </div>
        </NavLink>
        
      </div>
    </div>
  )
}

export default Academic;
