import React from 'react'
import {useEffect,useState } from 'react'
import axios from "axios"
axios.defaults.baseURL = "https://eps-backend.onrender.com"

const Students = () => {
  const[students,setStudents] = useState([])
  const getFetchData = ()  =>{
    axios.get("https://eps-backend.onrender.com/api/students")
    .then(students => setStudents(students.data))
    .catch(err => console.log(err))
  }

  useEffect(()=>{
    getFetchData()
     
  },[])


  /**
   *   "name": "DERICK OTHIAMBO",
        "dot": "2024-01-01T21:00:00.000Z",
        "dob": "2004-02-02T21:00:00.000Z",
        "regno": "2",
        "gender": "Male",
        "previous": "Kaaga Girls",
        "stream": "form1x",
        "parentname": "Rechard Linguli",
        "email": "linguli639@gmail.com",
        "phone": 2547856444,
        "createdAt": "2024-10-27T09:02:59.669Z",
        "updatedAt": "2024-10-27T09:02:59.669Z",
   */


  return (
    <div className='flex flex-col min-w-full'>

      


           <div className='flex  max-h-[77vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0   '>
             <table className=' min-w-full   mt-2'>
               <thead className=' bg-slate-800 text-white'>
               <th  className='border px-2'>NO</th>
                 <th  className='border'>Full Name</th>
                 <th className='border'>ADM</th>
                 <th className='border'>GENDER</th>

                 <th className='border'>DATE OF ADM</th>
                 <th className='border'>STREAM</th>
                 <th className='border'>UPDATE</th>
                 <th className='border'>DELETE</th>
                 
               </thead>
               <tbody>
                 {
                   students.map((student,index) =>{
                     return(
                       <tr key={index} className='border whitespace-nowrap h-10  py-3 border-slate-500'>
                         <td className='pr-2 border border-slate-500'>{index+1}</td>
                         <td  className='pr-2  border border-slate-500'>{student.name}</td>
                         <td  className='pr-2 border border-slate-500'>{student.regno}</td>
                         <td className='pr-2 border border-slate-500'>{student.gender}</td>
                         <td  className='pr-2  border border-slate-500'>{student.dot}</td>
                         <td  className='pr-2 border border-slate-500'>{student.stream}</td>
                         
                         <td className=' border  border-slate-500 text-center'><button className=' text-white px-1 rounded-sm curser-pointer '>
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

export default Students
