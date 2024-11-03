import React from 'react'

const Parents = () => {
  return (
    <div className='flex flex-col'>
        <div className='flex mt-2 mb-2 flex-row justify-between'>
            <p className='ml-4'>
                <input className='outline-none border border-slate-500' type="text" placeholder='Search' />
            </p>
            <button className='bg-green-700 text-white rounded px-2 py-1 mx-2'>SEND MESSAGE</button>
            <button className='bg-green-700 text-white rounded px-2 py-1 mx-2'>SEND EMAIL</button>
        </div>
    <table className='min-w-full'>
        <thead className='bg-slate-800 text-white'>
            <td className='border-r border-slate-500 whitespace-nowrap'>P/G NAME</td>
            <td className='border-r border-slate-500 whitespace-nowrap'>EMAIL</td>
            <td className='border-r border-slate-500'>PHONE NO</td>
            <td className='border-r border-slate-500 whitespace-nowrap'>STD NAME</td>
            <td className='border-r border-slate-500'>REG NO</td>
        </thead>
    </table>
    </div>
  )
}

export default Parents
