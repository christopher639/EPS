import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'
axios.defaults.baseURL = "https://eps-backend.onrender.com";
const TopBar = () => {
 const [Drawer , setDrawer] = useState(false)

 const [students, setMarks] = useState([]);
 useEffect(() => {
     const fetchData = () => {
         axios.get("https://eps-backend.onrender.com/students")
             .then(students => setMarks(students.data))
             .catch(err => console.log(err));
     };

     fetchData();
     const interval = setInterval(fetchData, 5000);
     return () => clearInterval(interval);
 }, []);




  return (
    <div className=' gap-5 pb-5  '>
        <div className=' flex  mx-2 gap-3 mt-2 flex-row justify-between'>
          <div >
          <button onClick={()=>setDrawer(true)}>
                    <svg className='mt-3 md:hidden' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                    </button>
          </div>
         {
          Drawer && (
            <div className=' border-r md:hidden border-slate-500 fixed w-2/3 inset-0 bg-black bg-opacity-50 backdrop-blur-[0px] flex justify-start '>

              <div className='bg-white w-full  min-h-full '>
                  <div className=' flex justify-between mx-5 mt-5'>
                      <div className='flex justify-center   items-center border h-8 w-8  md:w-24 md:h-24 border-slate-500 rounded-full mt-2'>
                      <img className='w-8 h-8 md:w-16 md:h-16' src="kibabiilogo.jpeg" alt="Description of image" />
                     </div>

                     <p className=' mt-2 bg-green-800 h-6 rounded-full cursor-pointer '>
                            <svg  onClick={()=>setDrawer(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z"/></svg>
                      </p>
                </div>
                  <NavLink to='/dashboard'>
                  <div onClick={()=>setDrawer(false)} className='flex border-b hover:bg-gray-800 hover:text-white w-full mt-2 px-3 py-1  border-t felx-row gap-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
                        <li className='list-none text-lg'>DASHBOARD</li>
                </div>
                </NavLink>

                <NavLink to='/admission'>
       <div  onClick={()=>setDrawer(false)} className='flex border-b w-full px-3 hover:bg-gray-800 hover:text-white py-1 felx-row gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/></svg>
            <li className='list-none'>ADMISSION</li>
        </div>
       </NavLink>
       <NavLink to='/students'>
       <div  onClick={()=>setDrawer(false)}  className='flex border-b w-full px-3 hover:bg-gray-800 hover:text-white py-1 felx-row gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>
                <li className='list-none'>STUDENTS</li>
        </div>
       </NavLink>

       <NavLink to="/streams">
        <div
          onClick={()=>setDrawer(false)}
       
          className="flex border-b w-full px-3 hover:bg-gray-800 hover:text-white py-1 felx-row gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
          </svg>
          <li className="list-none">ACADEMIC</li>
        </div>
      </NavLink>




        <NavLink  to="/marks">
            <div  onClick={()=>setDrawer(false)}  className='flex border-b w-full px-3 hover:bg-gray-800 hover:text-white py-1 felx-row gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>
                  <li className='list-none'>MARKS</li>
            </div>
        </NavLink>
      
      

       <NavLink  to='/reportform'>
       <div  onClick={()=>setDrawer(false)} className='flex border-b w-full px-3 hover:bg-gray-800 hover:text-white  py-1 felx-row gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>
        <li className='list-none'>REPORTS</li>
        </div>

       </NavLink>

       <NavLink  to="/staff">
       <div  onClick={()=>setDrawer(false)} className='flex border-b w-full hover:bg-gray-800 hover:text-white px-3 py-1 felx-row gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>
        <li className='list-none'>STAFF</li>
        </div>
       </NavLink>
       <NavLink to="/users">
       <div  onClick={()=>setDrawer(false)} className='flex border-b hover:bg-gray-800 hover:text-white w-full px-3 py-1 felx-row gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>
        <li className='list-none'>USERS</li>
        </div>
       </NavLink>

        <div className='flex border-b w-full hover:bg-gray-800 hover:text-white px-3 py-1 felx-row gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
        <li className='list-none'>ANALYTICS</li>
        </div>

        <div className='flex border-b w-full hover:bg-gray-800 hover:text-white  px-3 py-1 felx-row gap-1'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z"/></svg>
        <li className='list-none'>FINANCE</li>
        </div>

        <div className='flex border-b w-full hover:bg-gray-800 hover:text-white px-3 py-1 felx-row gap-1'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
        <li className='list-none'>MESSAGES</li>
        </div>


        <div className='flex border-b w-full hover:bg-gray-800 hover:text-white px-3 py-1 felx-row gap-1'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
        <li className='list-none'>SETTINGS</li>
        </div>


        <div className='  w-full flex hover:bg-gray-800 hover:text-white px-3 py-1 flex-row  '>
        <div className='list-none  flex  mt-2 justify-center items-center  h-[40px]'>    
          <img className='w-8 border rounded-full h-8' src="profileimg.jpg" alt="Description of image" />
        </div>
         <div className='flex items-center px-3 py-1   mt-2 justify-center'>
            <li className='list-none text-sm md:lg lg:2xl'>PROFILE</li>
         </div>
       </div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
          
          </div>
          )
         }
         <div className='border shadow-xl bg-slate-800 flex justify-center rounded w-1/3'>
          <p className='py-3  sm:text-sm md:text-lg text-white  whitespace-nowrap  px-2 '>Total Students :</p>
          <p className='md:text-3xl sm:text-sm lg:text-4xl text-white pt-1'>{students.length}</p>
         </div>
         <div className='border shadow-sm border-slate-500 flex justify-center rounded w-1/3'>
          <p className='py-3 '>Data2</p>
         </div>
         <div className='border mr-3 shadow-sm border-slate-500 flex justify-center rounded w-1/3'>
          <p className='py-3 '>Data3</p>
         </div>
        </div>
    </div>

  )
}

export default TopBar
