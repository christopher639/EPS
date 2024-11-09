import React from 'react'
import {useEffect,useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
axios.defaults.baseURL = "https://eps-backendt.onrender.com"

const MathFormData = () => {
 
    const [students, setMarks] = useState([]);


    const getFetchData = ()  =>{
      axios.get("https://eps-backendt.onrender.com/api/joined-students-generallay")
      .then(students => setMarks(students.data))
      .catch(err => console.log(err));
    }
    useEffect(()=>{
      getFetchData()
       
    },[])


  const[formData,setFormData] = useState({
    subjectcode:"math10",
    regno:"",
    score:""
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
    setFormData({
      subjectcode: 'math10',
      regno: '',
      score: ''
    });
    e.preventDefault()
    const data = axios.post("/api/subjectmark",formData)
    console.log(data)

      alert("English Marks Saved")
      getFetchData()
    
  }

  

  return (

    <div className='flex   flex-col md:flex-row '>
    <div className='flex w-full flex-col'>
    <div className='flex mt-1 flex-col md:flex-row'>
      <div className='w-full px-2 border rounded'>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 rounded-md ">
            <div className='flex justify-between gap-4'>
              <p className='py-2'>SUBJECT CODE:</p>
              <input
                onChange={handleOnChange}
                name='subjectcode'
                type="text"
                placeholder="MATH10"
                value="MATH10"
                readOnly
                className="p-2 border rounded-md outline-none text-gray-700 cursor-not-allowed"
              />
            </div>
            <div className='flex justify-between gap-4'>
              <p className='py-1'>ADM NO:</p>
              <input
                onChange={handleOnChange}
                name='regno'
                type="text"
                placeholder="ADM NO"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className='flex justify-between gap-4'>
              <p className='py-1'>SCORE:</p>
              <input
                onChange={handleOnChange}
                name='score'
                type="number"
                placeholder="SCORE"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className='bg-slate-800 text-white py-1 rounded'>Submit</button>
            
          </div>
        </form>
      </div>
    
    </div>
   <div>
  
 <div>

 <div className='flex mx-2   flex-col max-h-[53vh] sm:max-h-[50vh]  overflow-y-auto overflow-x-auto'>
 <div className='flex   justify-between'>
      <div>
        <input className='outline-none border  mt-1' type="text" placeholder='search' />
      </div>
      <div>
       <button className='bg-green-600 py-1 text-white px-2'>Print</button>
      </div>
    </div>
      <table className='min-w-full '>
        <thead className='bg-slate-800 text-white '>
          <tr>
            <th className='border-r'>ADM NO</th>
            
            <th className='border-r'>STREAM</th>
            <th className='border-r whitespace-nowrap'>MATH SCORE</th>
            <th className='border border-slate-500 text-center'>
              <button className='text-white px-1 rounded-sm cursor-pointer '>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323">
                  <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
                </svg>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            return (
              <tr key={index} className='border py-3 border-slate-500'>
                <td className='pr-2 text-center border border-slate-500'>{student.regno}</td>
                
                <td className='pr-2 text-center border border-slate-500'>{student.stream}</td>
                <td className='pr-2 border text-center border-slate-500'>{student.marks.math10}</td>
                <td className='border border-slate-500 text-center'>
                  <button onClick={() => { handleDelete(student._id); }} className='text-white px-1 rounded-sm cursor-pointer '>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323">
                      <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
 </div>
   </div>
  </div>

  <div className='flex w-2/5  items-center justify-center'>
    <div className='hidden  md:flex'>
      Class performance Analytics
    </div>
  </div>
</div>

  )
}

export default MathFormData
