import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:3000";
const RightBar = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/streams-summary');
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
    <div className='hidden bg-gray-200   flex-col  h-full'>
    <div className='flex justify-center'>
    </div>
      {/* Display stream and total students */}
      <div className=''>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col gap-4  px-5">
            <table>
               <thead>
                <th  className='text-sm'>NO</th>
                <th className='text-sm text-center text-gray-800'>STREAM</th>
                <th className='text-sm px-1 text-center text-gray-800'>COUNT</th>
                <th className='text-sm text-center text-gray-800'>MEAN</th>
                </thead>
              <tbody>
              {studentData.map((data,index) => (
                 <tr key={index} className='py-2 border border-slate-300'>
                      <td>{index+1}</td>
                 <td>{data.stream.toUpperCase()}</td>
                 <td className=' text-center'>{data.totalStudents}</td>
                 <td className='text-green-900 text-center font-semibold'>{data.streamMean}</td>
               </tr>
                ))}
              </tbody>
            </table>
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
