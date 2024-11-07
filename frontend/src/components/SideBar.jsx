import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="hidden md:flex flex-col min-h-full bg-gray-100 text-white w-50 p-4">
      {/* Logo Section */}
      <div className="flex justify-center py-4">
      <div className="flex justify-center   items-center h-8 w-8  md:w-24 md:h-24">
          <img
            className="w-8 h-8 md:w-16 md:h-16 bg-gray-100"
            src="kibabiilogo.jpeg"
            alt="Description of image"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <NavLink to="/dashboard">
        <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li className="list-none text-sm">DASHBOARD</li>
        </div>
      </NavLink>

      <NavLink to="/admission">
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li className="list-none text-sm">ADMISSION</li>
        </div>
      </NavLink>

      <NavLink to="/students">
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li className="list-none text-sm">STUDENTS</li>
        </div>
      </NavLink>

      <NavLink to="/streams">
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
      <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
          </svg>
          <li className="list-none text-sm">ACADEMICS</li>
        </div>
      </NavLink>

      <NavLink to="/parents">
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li className="list-none text-sm">PARENTS</li>
        </div>
      </NavLink>

      <NavLink to="/fees">
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li className="list-none text-sm">FEES</li>
        </div>
      </NavLink>


      <NavLink to="/users">
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li className="list-none text-sm">USERS</li>
        </div>
      </NavLink>
      <div className="flex rounded py-2 text-black hover:bg-gray-800 hover:text-white w-full  px-3 py-1   felx-row gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
          </svg>
          <li className="list-none text-sm">ANALYTICS</li>
        </div>
        <div className="flex items-center border px-3 py-1   mt-2 justify-center">
          <li className="list-none text-sm text-slate-800 md:lg lg:2xl">PROFILE</li>
        </div>
      
      

    </div>
  );
};

export default SideBar;
