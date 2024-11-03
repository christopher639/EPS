import React from 'react'
import { toast } from 'react-toastify'
import {useEffect,useState } from 'react'
import axios from "axios"
axios.defaults.baseURL = " http://localhost:3000/"
const Users = () => {
    const[userform,setUserForm] = useState(false)
    const[users,setUsers] = useState([])
  
    const[formData,setFormData] = useState({
      name:"",
      email:"",
      mobile:"",
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


    const handleDelete = async(id) =>{
          const data = await axios.delete("/delete/"+id)
       //   alert("User Deleted")
          setUserForm(false)
          setUserForm(false)
          getFetchData()

    }

    const handleSubmit = (e) =>{
      e.preventDefault()
      const data = axios.post("/create",formData)
      //  alert("User Added Successfully")
        getFetchData()
        setUserForm(false)
    }

    const getFetchData = ()  =>{
      axios.get("http://localhost:3000/users")
      .then(users => setUsers(users.data))
      .catch(err => console.log(err))
    }

    useEffect(()=>{
      getFetchData()
       
    },[])
  return (
     <div className='flex flex-col min-w-full'>
           <div className=' flex justify-between mx-4 mt-2'>
                <div>
                    <input className='outline-none py-1  text-center border' type="text" placeholder='Search'/>
                    <button className='bg-green-500 text-white px-2 py-1 rounded'>Search</button>
                </div>
                
                <div>
                <button  onClick={()=>setUserForm(true)}  className='bg-green-500 text-white px-2 py-1 rounded'>New User</button>
                </div>

            
           </div>
            {
              userform &&(
                  <div className='fixed  inset-0 bg-black bg-opacity-50 backdrop-blur-[0px] flex justify-center  items-center'>
                  <div className='bg-white p-6 rounded-lg w-full mx-5 md:w-1/2 shadow-lg'>
                    <div className='flex justify-between'>
                            <p className='text-sm  mb-3 bg-green-700  shadow-lg text-white px-2 py-1 rounded'>Fill this Form</p>
                            <p className=' bg-green-800 h-6 rounded-full cursor-pointer '>
                            <svg onClick={()=>setUserForm(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z"/></svg>
                            </p>
                    </div>
                    <div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
                      <input required className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="text"  name='name' placeholder='Full Name' onChange={handleOnChange}/>

                      <input required className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="text"  name='email' placeholder='email' onChange={handleOnChange}/>

                      <input required className='outline-none px-2 w-full border rounded border-slate-500 py-1' type="number"  name='mobile' placeholder='Mobile Number' onChange={handleOnChange}/>
                      <button  className='bg-green-700 text-white px-2 py-1 rounded' type='submit'>Submit</button>
                    </form>
                  </div>
                  </div>
                
                 </div>
      
              )
            }

            <div className='flex  max-h-[77vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0   '>
              <table className=' min-w-full   mt-2'>
                <thead className=' bg-slate-800 text-white'>
                  <th  className='border'>Full Name</th>
                  <th className='border'>Email</th>
                  <th className='border'>Phone Number</th>
                  <th className='border'>Update</th>
                  <th className='border'>Delete</th>
                </thead>
                <tbody>
                  {
                    users.map((user) =>{
                      return(
                        <tr className='border whitespace-nowrap h-10  py-3 border-slate-500'>
                          <td className='pr-2 border border-slate-500'>{user.name}</td>
                          <td  className='pr-2  border border-slate-500'>{user.email}</td>
                          <td  className='pr-2 border border-slate-500'>{user.mobile}</td>
                          <td className=' border  border-slate-500 text-center'><button onClick={()=>{handleDelete(user._id)}} className=' text-white px-1 rounded-sm curser-pointer '>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></button>
                            </td>
                            <td className=' border  border-slate-500 text-center'>
                            <button onClick={()=>{alert("Not working at the moment")}} className=' text-white px-1 rounded-sm curser-pointer '>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#75FB4C"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/></svg></button></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
     </div>
  )
}

export default Users
