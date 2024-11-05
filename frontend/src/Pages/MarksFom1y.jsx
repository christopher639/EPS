import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
axios.defaults.baseURL = "https://eps-backend.onrender.com";

const MarksFom1y = () => {
    const [students, setMarks] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input

    useEffect(() => {
        const fetchData = () => {
            axios.get("https://eps-backend.onrender.com/api/joined-students_marks-form1y")
                .then(students => setMarks(students.data))
                .catch(err => console.log(err));
        };
  
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handlePrint = () => {
        const printContents = document.getElementById("printableTable").innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page after printing
    };

    // Filtered list based on the search query
    const filteredStudents = students.filter(student =>
        student.regno.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='flex overflow-none mx-1 mr-5 flex-col md:flex-row '>
            <div className='w-full'>
                <div className='flex flex-col'>
                    <div className='flex justify-between mt-1 mx-2'>
                        <div>
                            <input 
                                type="text" 
                                className='text-center border outline-none py-1 px-2 text-sm cursor-pointer mb-2' 
                                placeholder='Search by ADN NO' 
                                value={searchQuery} // Bind input value to searchQuery state
                                onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                            />
                            <button onClick={handlePrint} className='text-center bg-green-600 py-1 px-2 cursor-pointer text-white text-sm mb-2'>
                                Print
                            </button>
                        </div>
                        <NavLink to='/reportform1y'>
                            <p className='text-center bg-green-600 py-1 px-2 cursor-pointer text-white text-sm mb-2'>Report</p>
                        </NavLink>
                    </div>
                </div>

                <div className='flex max-h-[75vh] overflow-y-auto overflow-x-auto justify-center'>
                    <div className='w-full' id="printableTable">
                        <table className='min-w-full mt-2'>
                            <thead className='border bg-slate-800 text-white'>
                                <tr>
                                    <th className='border whitespace-nowrap px-2'>NO</th>
                                    <th className='border whitespace-nowrap'>Full Name</th>
                                    <th className='border whitespace-nowrap'>ADN NO</th>
                                    <th className='border whitespace-nowrap'>MATH</th>
                                    <th className='border whitespace-nowrap'>ENG</th>
                                    <th className='border whitespace-nowrap'>CHEM</th>
                                    <th className='border whitespace-nowrap'>KISWA</th>
                                    <th className='border whitespace-nowrap'>AGRI</th>
                                    <th className='border px-1'>BS</th>
                                    <th className='border whitespace-nowrap'>PHYC</th>
                                    <th className='border'>HISTO</th>
                                    <th className='border'>BIO</th>
                                    <th className='border'>Total</th>
                                    <th className='border'>AVG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredStudents.map((student, index) => (
                                        <tr key={index} className='border py-3 border-slate-500'>
                                            <td className='pr-2 whitespace-nowrap border border-slate-500'>{index + 1}</td> 
                                            <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.name}</td>
                                            <td className='pr-2 text-center border border-slate-500'>{student.regno}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.math10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.eng10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.chem10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.kisw10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.agri10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.busi10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.physc10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.histo10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.bio10}</td>
                                            <td className='pr-2 border text-center border-slate-500'></td>
                                            <td className='pr-2 border text-center border-slate-500'></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarksFom1y;
