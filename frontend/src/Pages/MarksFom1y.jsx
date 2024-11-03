

import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
axios.defaults.baseURL = "https://eps-backend.onrender.com";

const MarksFom1y = () => {
    const [students, setMarks] = useState([]);
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

    return (
        <div className='flex flex-col max-h-[80vh] overflow-y-auto overflow-x-auto'>
            <div className='shadow-lg flex justify-between mt-1 mx-1'>
                <div>
                    <input type="text" className='text-center border outline-none py-1 px-2 text-sm cursor-pointer mb-2' placeholder='Search' />
                    <button onClick={() => { alert("Not implemented by Bundi for now") }} className='text-center bg-green-600 py-1 px-2 text-sm cursor-pointer text-white mb-2'>Search
                    </button>
                </div>
                <button onClick={handlePrint} className='text-center bg-green-600 py-1 px-2 cursor-pointer text-white text-sm mb-2'>Print
                </button>
                <NavLink to='/reportform1y'>
                    <p className='text-center bg-green-600 py-1 px-2 cursor-pointer text-white text-sm mb-2'>Report Forms
                    </p>
                </NavLink>
            </div>
            <div id="printableTable">
                <table className='min-w-full mt-2'>
                    <thead className='border bg-slate-800 text-white'>
                        <tr>
                            <th className='border px-2'>NO</th>
                            <th className='border'>Full Name</th>
                            <th className='border'>ADN NO</th>
                            <th className='border'>MATH</th>
                            <th className='border'>ENG</th>
                            <th className='border'>CHEM</th>
                            <th className='border'>KISWA</th>
                            <th className='border'>AGRI</th>
                            <th className='border'>BS</th>
                            <th className='border'>PHYC</th>
                            <th className='border'>HISTO</th>
                            <th className='border'>BIO</th>
                            <th className='border'>Total</th>
                            <th className='border'>AVG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            students.map((student, index) => (
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
    );
};

export default MarksFom1y;
