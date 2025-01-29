import React from 'react';
import SideBar from '../components/SideBar';

const Finance = () => {
  
  return (
    <div className='flex bg-gray-50 min-h-screen'>
      <div >
        <SideBar />
      </div>
      <div className='flex bg-gray-700 flex-col w-4/5 items-center justify-center p-10'>
        <div className='text-center mb-6'>
          <p className='text-5xl font-bold text-white '>Coming Soon!</p>
        </div>
        <div className='bg-white bg-yellow-700 p-8 rounded-lg shadow-lg max-w-3xl'>
          <p className='text-lg  text-white'>
            The Finance module is being developed to provide a comprehensive
            solution for managing student fee payments. It will streamline the
            fee collection process, allowing both students and school
            administrators to track payments, view balances, and generate
            reports with ease. By automating tasks such as invoicing, payment
            reminders, and payment history tracking, the system ensures timely
            fee payments while reducing manual efforts.
          </p>
          <p className='mt-6 text-lg text-white'>
            This module is essential in improving financial management within
            the school, ensuring transparency, reducing errors, and ultimately
            supporting smooth day-to-day operations. The feature is currently
            under development as I am focusing on building other modules, but I
            will be available soon to complete the integration and provide full
            functionality for student fee management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Finance;
