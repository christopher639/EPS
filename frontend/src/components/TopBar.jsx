import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
axios.defaults.baseURL = "https://eps-backendt.onrender.com";

const TopBar = () => {
  const [drawer, setDrawer] = useState(false);
  const [students, setMarks] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get("/api/students")
        .then(students => setMarks(students.data))
        .catch(err => console.log(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative gap-5 p-5 bg-gray-100'>
      <div className='flex gap-4 items-center bg-gray-100'>
        <div className='flex items-center justify-start w-1/3'>
          <p className='text-slate-800 text-sm md:text-lg font-semibold whitespace-nowrap'>STUDENTS:</p>
          <p className='text-green-800 text-xl md:text-3xl lg:text-3xl font-bold '>{students.length}</p>
        </div>

        <div className='flex justify-center w-1/3'>
          <p className='text-sm text-gray-700 py-2'>Data2</p>
        </div>

        <div className='flex justify-end items-center w-1/3'>
          <p className='text-sm text-gray-700 py-2'>Data3</p>
        </div>

        <div>
          <button onClick={() => setDrawer(true)}>
            <svg className='mt-3 md:hidden' xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed top-20 left-0 h-full bg-white  md:hidden   transform transition-transform duration-500 ease-in-out ${
          drawer ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
       
        <div className='bg-gray-200 w-full min-h-full ' >
         
                <div >
                  <div className=' flex justify-between mx-5 '>
                      <div className='flex justify-center   items-center border h-8 w-8  md:w-24 md:h-24 border-slate-500 rounded-full mt-2'>
                      <img className='w-8 h-8 md:w-16 md:h-16' src="kibabiilogo.jpeg" alt="Description of image" />
                     </div>

                     <p className=' mt-2 bg-green-800 h-6 rounded-full cursor-pointer '>
                            <svg  onClick={()=>setDrawer(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z"/></svg>
                      </p>
                </div>
                <NavLink to="/dashboard">
            <div onClick={()=>setDrawer(false)} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li  className="list-none text-sm">DASHBOARD</li>
        </div>
      </NavLink>

      <NavLink to="/admission">
      <div onClick={()=>setDrawer(false)} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M610-210q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm110 0q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm110 0q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm-630 90q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z"/></svg>
          <li className="list-none text-sm">ADMISSION</li>
        </div>
      </NavLink>

      <NavLink to="/students">
      <div onClick={()=>setDrawer(false)} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
          <li className="list-none text-sm">STUDENTS</li>
        </div>
      </NavLink>

      <NavLink to="/streams">
      <div onClick={()=>setDrawer(false)} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>
          <li className="list-none text-sm">ACADEMICS</li>
        </div>
      </NavLink>

      <NavLink to="/parents">
      <div onClick={()=>setDrawer(false)} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-40q-186 0-313-69.5T40-280q0-69 64-126.5T280-494v82q-73 23-116.5 59T120-280q0 64 108 112t252 48q144 0 252-48t108-112q0-37-43.5-73T680-412v-82q112 30 176 87.5T920-280q0 101-127 170.5T480-40ZM360-200v-440H160v-80h640v80H600v440h-80v-200h-80v200h-80Zm120-560q-33 0-56.5-23.5T400-840q0-33 23.5-56.5T480-920q33 0 56.5 23.5T560-840q0 33-23.5 56.5T480-760Z"/></svg>
          <li className="list-none text-sm">PARENTS</li>
        </div>
      </NavLink>

      <NavLink to="/fees">
      <div onClick={()=>setDrawer(false)} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z"/></svg>
          <li className="list-none text-sm">FINANCE</li>
        </div>
      </NavLink>


      <NavLink to="/users">
      <div onClick={()=>setDrawer(false)} className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>
          <li className="list-none text-sm">USERS</li>
        </div>
      </NavLink>

       

        <div className='flex border-b w-full hover:bg-gray-800 hover:text-white px-3 py-1 felx-row gap-1'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
        <li className='list-none text-sm'>MESSAGES</li>
        </div>


        <div className='flex border-b w-full hover:bg-gray-800 hover:text-white px-3 py-1 felx-row gap-1'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
        <li className='list-none text-sm'>SETTINGS</li>
        </div>


        <div className='  w-full flex hover:bg-gray-800 hover:text-white px-3 py-1 flex-row  '>
        <div className='list-none  flex  mt-2 justify-center items-center  h-[40px]'>    
          <img className='w-8 border rounded-full h-8' src="profileimg.jpg" alt="Description of image" />
        </div>
         <div className='flex items-center px-3 py-1   mt-2 justify-center'>
            <li className='list-none text-sm md:lg lg:2xl'>PROFILE</li>
         </div>
         </div>
         <div className='text-sm ml-2  text-black fixed bottom-40 w-full '>
  <p className='text-center'>© 2024 Software Engineer Bundi</p>
</div>


        </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
