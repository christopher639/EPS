import axios from 'axios'
import React, { useEffect ,useState } from 'react'
//import SideBar from './components/SideBar'
//import RightBar from './components/RightBar'
//import TopBar from './components/TopBar'
import { toast } from 'react-toastify'
const App = () => {
  //const url ="http://localhost:4000";
  const notify = () => toast("Not Working!");
  const [addSection,setAddSection] = useState(false)
  const[staffmembers,setStaffMembers] = useState([])
  const[data,setFormData] = useState({
    fName: "",
    Lname: "",
    position: "",
    sex: "",
    DOB: "",
    salary: "",
    branchNo: "",
    staffNo: ""
  })
  const onnChangedHandler =(event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data =>({...data,[name]:value}))
}
const onSubmitHandler = async (event) =>{
  event.preventDefault();
  const formData = new FormData();
  formData.append("fname",data.fName)
  formData.append("Lname",data.Lname)
  formData.append("position",data.position)
  formData.append("sex",data.sex)
  formData.append("DOB",data.DOB)
  formData.append("salary",Number(data.salary))
  formData.append("branchNo",data.branchNo)
  formData.append("staffNo",data.staffNo)
 // const response = await axios.post(`${url}/api/food/add`,formData);
 console.log(formData)
 setAddSection(false)
 notify
 //alert("Programming error")
}
  useEffect(()=>{
    axios.get("http://localhost:3000/api/staffs")
    .then(staffmembers => setStaffMembers(staffmembers.data))
    .catch(err => console.log(err))
  },[])
  return (
   <div className='flex overflow-none mx-1 mr-5 flex-col  md:flex-row '>
        <div className=' w-full  '>
                <div className='flex flex-col'>
           
                  <div  className=' shadow-lg flex justify-between mt-1 mx-2'>
                          <div>
                              <input type="text" className='text-center border outline-none py-1 px-2 text-sm  cursor-pointer  mb-2' placeholder='Search'/>
                                <button onClick={()=>{alert("Not impleted by Bundi for now")}} className='text-center bg-green-600 py-1 px-2 text-sm  cursor-pointer text-white mb-2' >Search
                                </button>
                          </div>
                            <button onClick={()=>setAddSection(true)} className='text-center bg-green-600  py-0 px-2  cursor-pointer text-white text-sm mb-2' >New Staff
                            </button>
                </div>
                </div>
                {
                  addSection &&(
                 
                     <div className='fixed   inset-0 bg-black bg-opacity-50 backdrop-blur-[0px] flex justify-center items-center'>
                     <div className='bg-white p-6 rounded-lg w-full mx-5 md:w-1/2 shadow-lg'>
                 
                 <div className='flex justify-between'>
                        <p className='text-sm  mb-3 bg-green-700  shadow-lg text-white px-2 py-1 rounded'>Fill this Form</p>
                        <p className=' bg-green-800 h-6 rounded-full cursor-pointer '>
                        <svg onClick={()=>setAddSection(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z"/></svg>
                        </p>
                      </div>
                      <div className='grid grid-cols-1 gap-5 sm:gap-10  sm:grid-cols-3 '>
                        <input onChange={onnChangedHandler} value={data.fName} className='outline-none border border-gray-700   text-center rounded py-2  'name='fName' type="text" placeholder='First Name'  required/>

                        <input onChange={onnChangedHandler} value={data.Lname} className='outline-none border border-gray-700    text-center rounded py-2   '   type="text" name='Lname' placeholder='Last  Name'  required/>

                        <select onChange={onnChangedHandler} value={data.position}  className='outline-none border rounded    border-gray-700 py-2' name="position"  id="">
                          <option value="">Manager</option>
                          <option value="">Director</option>
                          <option value="">Assistant</option>
                          <option value="">Employee</option>
                     
                        </select>
                      <select  onChange={onnChangedHandler} value={data.sex} className='outline-none border    rounded border-gray-700 py-2'  name="sex" id="">
                        <option value="">Male</option>
                        <option value="">Female</option>
                        <option value="">Rather Not Say</option>
                      </select>
                        <input onChange={onnChangedHandler} value={data.DOB} className='outline-none border border-gray-700  text-center rounded py-2  'name='DOB' type="date" placeholder='Date OfBirth'  required/>
                        <input onChange={onnChangedHandler} value={data.salary} className='outline-none border border-gray-700  text-center   rounded py-2  ' type="text" name='salary' placeholder='salary' required/>
                        <input onChange={onnChangedHandler} value={data.branchNo} className='outline-none border border-gray-700  text-center rounded py-2     ' type="text" name='branchNo'  placeholder='Branch No'  required/>
                        <input className='outline-none border border-gray-700  text-center rounded py-2 ' name='staffNo' type="text"  placeholder='Staff No' required/>
                        <input className='outline-none border border-gray-700   text-center rounded py-2  ' type="text" placeholder='Phone Number'/>
                      </div>
                      <div className='flex justify-center mt-4'><button  onClick={onSubmitHandler} className='text-center border border-gray-700 bg-green-700 py-1 px-2 w-1/2 shadow-lg  rounded cursor-pointer text-white mb-2'>Submit</button>
                      </div>
                 </div>
              </div>
      
                  )
                }
              
                <div  className='flex h-screen overflow-y-auto overflow-x-auto justify-center   '>
                  <table className='border  border-collapse min-w-full shadow-lg overflow-scroll '>
                    
                    <thead className='mt-2 border bg-slate-800 text-white'>
                      <tr className='border'>
                      <th className='border '>
                        StaffNo
                      </th>
                      <th className='text-gray-200'>
                        First Name
                      </th>
                        <th className='text-gray-200'>
                          Last Name
                        </th>
                        <th className='text-gray-200'>
                          Position
                        </th>
                        <th className='text-gray-200'>
                          Sex
                        </th>
                        <th className='text-gray-200'>
                          DOB
                        </th>
                        <th className='text-gray-200'>
                          Salary
                        </th>
                        <th className='text-gray-200'>
                          Branch No
                        </th>

                        <th className='text-gray-200'>
                          Delete
                        </th>
                        <th className='text-gray-200'>
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                    
                      staffmembers.map(member =>{
                        return(
                          <tr>
                            <td className='border  whitespace-nowrap '>{member.staffNo}</td>
                            <td className='border  whitespace-nowrap text-center'>{member.fName}</td>
                            <td className=' border text-center'>{member.Lname}</td>
                            <td className='border  whitespace-nowrap'>{member.position}</td>
                            <td className='border text-center'>{member.sex}</td>
                            <td className=' border whitespace-nowrap text-center'>{member.DOB}</td>
                            <td className='border text-center'>{member.salary}</td>
                            <td className=' border text-center'>{member.branchNo}</td>
                          
                            <td className=' border text-center'><button onClick={()=>{alert("Not impleted by Bundi for now")}} className=' text-white px-1 rounded-sm curser-pointer '>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></button></td>
                            <td className=' border text-center'><button onClick={()=>{alert("Not working at the moment")}} className=' text-white px-1 rounded-sm curser-pointer '>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#75FB4C"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/></svg></button></td>
                          </tr>
                        )
                      
                      })
                    
                    }
                    </tbody>
                  </table>
                </div>
        </div>
   </div>
  )
}
export default App
