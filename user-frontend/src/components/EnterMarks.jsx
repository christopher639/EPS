import React from 'react'
import {useState } from 'react'
import axios from "axios"
import { NavLink } from 'react-router-dom'
axios.defaults.baseURL = " http://localhost:3000/"
const EnterMarks = () => {
    const[userform,setUserForm] = useState(false)
    const[formData,setFormData] = useState({
      name:"",
      adm:"",
      math:"",
      eng:"",
      sci:"",
      phy:"",
      bio:"",
      chem:"",
      kisw:"",
      geo:"",
    })

    const handleOnChange =(e) =>{
      const {value,name} =e.target
      setFormData((preve)=>{
        return{
          ...preve,
          [name]:value
        }
      })
    }

    const handleSubmit = (e) =>{
      e.preventDefault()
      const data = axios.post("/mark",formData)
        alert("Data SAved Successfully")
        setUserForm(false)
    }
  return (
     <div className='mx-4 md:mx-1'>
           <div className=' flex  justify-between mx-4 mt-2'>
                <div>
                    <input className='outline-none py-1  text-center border' type="text" placeholder='Search'/>
                    <button className='bg-green-500 text-white px-2 py-1 rounded'>Search</button>
                </div>
                
                <div>
                <button  onClick={()=>setUserForm(true)}  className='bg-green-500 text-white px-2 py-1 rounded'>Enter Marks</button>
                </div>
           </div>
            {
              userform &&(
                  <div className='fixed   inset-0 bg-black bg-opacity-50 backdrop-blur-[0px] flex justify-center  items-center'>
                  <div className='bg-white w-1/2 p-6 rounded-lg shadow-lg'>
                    <div className='flex  justify-between'>
                            <p className='text-sm  mb-3 bg-green-700  shadow-lg text-white px-2 py-1 rounded'>Fill this Form</p>
                            <p className=' bg-green-800 h-6 rounded-full cursor-pointer '>
                            <svg onClick={()=>setUserForm(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z"/></svg>
                            </p>
                    </div>
                    <div>
                    <form onSubmit={handleSubmit}>
                     <div  className='grid grid-cols-2 gap-10'>
                         <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="text"  name='name' placeholder='Full Name' onChange={handleOnChange}/>

                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="text"  name='adm' placeholder='ADM NO' onChange={handleOnChange}/>

                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='math' placeholder='Mathematics' onChange={handleOnChange}/>
                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='eng' placeholder='English' onChange={handleOnChange}/>
                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='sci' placeholder='Intergrated Science' onChange={handleOnChange}/>
                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='phy' placeholder='Physics' onChange={handleOnChange}/>
                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='bio' placeholder='Biology' onChange={handleOnChange}/>
                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='chem' placeholder='Chemistry' onChange={handleOnChange}/>
                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='kisw' placeholder='Kiswahili' onChange={handleOnChange}/>
                      <input className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='geo' placeholder='Geography' onChange={handleOnChange}/>
                     </div>
                      <button  className='bg-green-700  mt-5  w-full text-white px-2 py-1 rounded' type='submit'>Submit</button>
                    </form>
                  </div>
                  </div>
                 </div>
      
              )
            }
                <div  className='mt-2 flex justify-center'>
                  <p>SELECT LEARNING AREA YOU TEACH</p>
                </div>
            <div className='grid gap-5 mt-3  grid-cols-1 min-w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              <NavLink to="/math">
              <div className='border hover:bg-slate-800  hover:text-white text-lg min-w-full items-center text-center rounded py-10 cursor-pointer'>Mathematics</div>
              </NavLink>
              <NavLink to="/eng">
              <div className='border hover:bg-slate-800  hover:text-white text-lg min-w-full items-center text-center rounded py-10 cursor-pointer'>English</div>
              </NavLink>
           
            <NavLink to='/kiswa'>
            <div className='border hover:bg-slate-800  hover:text-white text-lg  items-center text-center rounded py-10 cursor-pointer '>Kiswahili</div>
            </NavLink>

          <NavLink to='/chem'>
          <div className='border hover:bg-slate-800  hover:text-white text-lg items-center text-center rounded py-10 cursor-pointer '>Chemistry</div>
          </NavLink>

             <NavLink to='/physc'>
             <div className='border hover:bg-slate-800  hover:text-white text-lg items-center text-center rounded py-10 cursor-pointer '>Physics</div>
             </NavLink>

             <NavLink to='/agri'>
             <div className='border hover:bg-slate-800  hover:text-white text-lg items-center text-center rounded py-10 cursor-pointer '>Agriculture</div>

             </NavLink>
             <NavLink to='/bs'>
             <div className='border hover:bg-slate-800  hover:text-white text-lg items-center text-center rounded py-10 cursor-pointer '>Business</div>
             </NavLink>
             
            <NavLink to='/histo'>
            <div className='border hover:bg-slate-800  hover:text-white text-lg items-center text-center rounded py-10 cursor-pointer '>History</div>
            </NavLink>

             <NavLink to='/bio'>
             <div className='border hover:bg-slate-800  hover:text-white text-lg items-center text-center rounded py-10 cursor-pointer '>Biology</div>
             </NavLink>
            </div>
     </div>
  )
}

export default EnterMarks
