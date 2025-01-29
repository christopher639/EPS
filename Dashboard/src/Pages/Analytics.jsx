import React from 'react';
import SideBar from '../components/SideBar';

const Analytics = () => {
  return (
   <div className='flex'>
    <div>
      <SideBar/>
    </div>
     <div className="flex   w-full flex-col items-center justify-center min-h-screen bg-gray-700 text-white px-4">
      {/* Coming Soon Section */}
      <div className="text-center">
        <p className="text-5xl font-bold mb-4">Coming Soon!</p>
        <p className="text-lg mb-8">
          We're currently working on bringing you powerful analytical tools. Stay tuned for updates!
        </p>
      </div>

      {/* Importance of Analytics */}
      <div className="max-w-2xl text-center bg-yellow-700 p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-3xl font-semibold mb-4">Why Analytics is Essential</h2>
        <p className="text-lg">
          Analytics are crucial for making informed decisions. Once available, this feature will help you understand
          patterns, track progress, and gain actionable insights into various aspects of your system. With analytics,
          you'll be able to:
        </p>
        <ul className="list-disc list-inside mt-4 text-left">
          <li>Track key performance metrics</li>
          <li>Make data-driven decisions</li>
          <li>Identify growth opportunities</li>
          <li>Monitor trends and performance over time</li>
        </ul>
        <p className="mt-4">
          We're excited to bring this functionality to you as soon as possible. Stay tuned!
        </p>
      </div>
    </div>
   </div>
  );
}

export default Analytics;
