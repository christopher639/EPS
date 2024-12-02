import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
axios.defaults.baseURL = "https://eps-backendvtwo.onrender.com";

const JoinedStudentsMarks = () => {
    const [students, setMarks] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const { stream } = useParams(); // Extract 'stream' from the URL
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        const fetchData = () => {
            axios.get(`http://localhost:3000/api/joined-students_marks/${stream}`)
                .then(response => setMarks(response.data))
                .catch(err => console.log(err));
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [stream]);

    const handlePrint = () => {
        const printContents = document.getElementById("printableTable").innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); 
    };

    // Filtered list based on the search query
    const filteredStudents = students.filter(student =>
        student.regno.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle the navigation to the report form with selected students
    const handleReportClick = () => {
        navigate('/reportform1y', { state: { students: filteredStudents } });
    };

    return (
        <div className='flex overflow-none mx-1 sm:mr-5 md:mr-0 flex-col md:flex-row '>
            <div className='w-full'>
                <div className='flex flex-col'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <input 
                                type="text" 
                                className='text-center w-32 border border-slate-300 outline-none py-2 px-3 text-sm mb-2 rounded-md' 
                                placeholder='Search by ADN NO' 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                            <button 
                                onClick={handlePrint} 
                                className='text-center bg-green-600 py-2 px-4 text-white text-sm mb-2 rounded-md hover:bg-green-700'>
                                Print
                            </button>
                        </div>
                        <button 
                            onClick={handleReportClick}
                            className='text-center bg-green-600 py-2 px-4 text-white text-sm mb-2 rounded-md hover:bg-green-700'>
                            Report
                        </button>
                    </div>
                </div>

                <div className='flex max-h-[72vh] md:max-h-[73vh] overflow-y-auto overflow-x-auto justify-center'>
                    <div className='w-full' id="printableTable">
                        <table className='min-w-full mt-2'>
                            <thead className='border h-10 bg-slate-800 text-white'>
                                <tr>
                                    <th className='border whitespace-nowrap px-2'>NO</th>
                                    <th className='border whitespace-nowrap'>Full Name</th>
                                    <th className='border whitespace-nowrap'>ADN NO</th>
                                    <th className='border whitespace-nowrap'>STREAM</th>
                                    <th className='border whitespace-nowrap'>MATH</th>
                                    <th className='border whitespace-nowrap'>ENG</th>
                                    <th className='border whitespace-nowrap'>CHEM</th>
                                    <th className='border whitespace-nowrap'>KISWA</th>
                                    <th className='border whitespace-nowrap'>AGRI</th>
                                    <th className='border px-3'>BS</th>
                                    <th className='border whitespace-nowrap'>PHYC</th>
                                    <th className='border'>HISTO</th>
                                    <th className='border'>BIO</th>
                                    <th className='border'>Total</th>
                                    <th className='border'>AVG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => {
                                    const avg = (student.marks.math10 + student.marks.eng10 + student.marks.chem10 + student.marks.kisw10 + student.marks.agri10 + student.marks.busi10 + student.marks.physc10 + student.marks.histo10) / 8;
                                    const total = (student.marks.math10 + student.marks.eng10 + student.marks.chem10 + student.marks.kisw10 + student.marks.agri10 + student.marks.busi10 + student.marks.physc10 + student.marks.histo10);

                                    return (
                                        <tr key={index} className='border hover:bg-gray-200 h-10 py-3 border-slate-500'>
                                            <td className='pr-2 whitespace-nowrap border border-slate-500'>{index + 1}</td> 
                                            <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.name}</td>
                                            <td className='pr-2 text-center border border-slate-500'>{student.regno}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.stream}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.math10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.eng10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.chem10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.kisw10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.agri10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.busi10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.physc10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.histo10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{student.marks.bio10}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{total}</td>
                                            <td className='pr-2 border text-center border-slate-500'>{avg.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinedStudentsMarks;
