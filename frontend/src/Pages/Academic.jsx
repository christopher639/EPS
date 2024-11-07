import React from 'react'
import { NavLink } from 'react-router-dom'

const Academic = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex mx-4 justify-between mt-1">
        <div className="flex justify-between w-full">
          <div className="flex gap-2 w-full">
            <input 
              type="text" 
              className="text-center border border-slate-300 outline-none py-2 px-3 text-sm cursor-pointer mb-2 w-full rounded-md" 
              placeholder="Search" 
            />
            <button 
              onClick={() => { alert("Not implemented by Bundi for now") }} 
              className="text-center bg-green-600 py-2 px-4 text-sm cursor-pointer text-white mb-2 rounded-md hover:bg-green-700"
            >
              Search
            </button>
          </div>
        </div>
        <div>
          <button className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800">
            NEW
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
