import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "https://eps-backendvtwo.onrender.com";
const RightBar = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://eps-backendvtwo.onrender.com/api/total-students-by-stream');
        setStudentData(response.data);  // Set the response data into state
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    console.log(studentData)
    fetchStudentData();
    
  }, []);

  return (
    <div className='hidden bg-gray-200  md:flex  flex-col  h-full'>
    <div className='flex justify-center'>
    <p className='text-sm  mt-4 py-2'>TOTAL PER STREM</p>
      
    </div>
      {/* Display stream and total students */}
      <div className=''>
    
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col gap-4  px-5">
        
            {studentData.length > 0 ? (
              <ul className="list-disc pl-5  border  border-slate-300  flex flex-col gap-2">
                {studentData.map((data, index) => (
                  <li key={index} className="text-sm border-b px-5 borde-x  border-slate-300 flex gap-5 list-none">
                    <p className='  border-x  border-slate-300'>{data.stream.toUpperCase()}</p><p className='text-green-800 font-bold text-center '>{data.totalStudents} </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data available</p>
            )}
          </div>
        )}
      </div>
      
      <div className='h-1/3'>
        {/* Additional content can go here */}
      </div>
    </div>
  );
};

export default RightBar;
