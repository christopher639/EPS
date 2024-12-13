import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:3000";

const JoinedStudentsMarks = () => {
    const [students, setMarks] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [year, setYear] = useState('');
    const [term, setTerm] = useState('');
    const [examType, setExamType] = useState('');
    const { stream } = useParams();
    const navigate = useNavigate();

    // Fetch filtered data when the component loads or filters change
    useEffect(() => {
        const fetchData = () => {
            // Prepare filters based on state values
            const filters = {
                searchQuery,  // Student Registration number
                year,         // Year from the dropdown
                term,         // Term from the dropdown
                examType,     // Exam type from the dropdown
            };

            // Construct query string with the filter parameters
            const queryParams = new URLSearchParams(filters).toString();

            // Fetch data from the API with filters
            axios.get(`/api/joined-students_marks/${stream}?${queryParams}`)
                .then(response => setMarks(response.data))
                .catch(err => console.log(err));
        };

        fetchData();

        // Optional: Periodically fetch data
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [stream, searchQuery, year, term, examType]);

    const handlePrint = () => {
        const printContents = document.getElementById("printableTable").innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); 
    };

    const handleReportClick = () => {
        navigate('/reportform1y', { state: { students } });
    };

    return (
        <div className='flex overflow-none mx-1 sm:mr-5 md:mr-0 flex-col md:flex-row'>
            <div className='w-full'>
                <div className='grid grid-cols-2 md:grid-cols-6 py-2 gap-2 md:mr-4 items-center'>
                    <div className='min-w-full'>
                        <button 
                            onClick={handlePrint} 
                            className='text-center w-full bg-green-600 py-2 px-4 text-white text-sm rounded-md hover:bg-green-700'>
                            Print
                        </button>
                    </div>
                    <div className='min-w-full'>
                        <input 
                            type="text" 
                            className='text-center text-sm w-full border border-slate-300 outline-none py-2 px-3 text-sm rounded-md' 
                            placeholder='Search->adm no' 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>
                    <div className='min-w-full'>
                        <select  
                            className='px-3 py-2 w-full text-sm outline-none border rounded '
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="">Select Year</option>
                            <option value="2028-2029">2028-2029</option>
                            <option value="2027-2028">2027-2028</option>
                            <option value="2026-2027">2026-2027</option>
                            <option value="2025-2026">2025-2026</option>
                            <option value="2024-2025">2024-2025</option>
                        </select>
                    </div>
                    <div className='min-w-full'>
                        <select 
                            className='px-3 py-2 w-full md:w-32 outline-none border rounded '
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        >
                            <option value="">Select Term</option>
                            <option value="Term-1">Term-1</option>
                            <option value="Term-2">Term-2</option>
                            <option value="Term-3">Term-3</option>
                        </select>
                    </div>
                    <div className='rounded-md'>
                        <select 
                            className='px-3 w-full py-2 outline-none border rounded '
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >
                            <option value="">Select Exam Type</option>
                            <option value="Opener">Opener</option>
                            <option value="Mid-Term">Mid-Term</option>
                            <option value="End-term">End-term</option>
                            <option value="Merged">Merged</option>
                        </select>
                    </div>
                    <div className='min-w-full'>
                        <button 
                            onClick={handleReportClick}
                            className='text-center w-full bg-green-600 py-2 px-4 text-white text-sm rounded-md hover:bg-green-700'>
                            Report
                        </button>
                    </div>
                </div>
                <div className='flex max-h-[72vh] md:max-h-[80vh] overflow-y-auto overflow-x-auto justify-center'>
                    <div className='w-full' id="printableTable">
                        <table className='min-w-full'>
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
                                {students.map((student, index) => (
                                    <tr key={index} className='border hover:bg-gray-200 h-10 py-3 border-slate-500'>
                                        <td className='pr-2 whitespace-nowrap border border-slate-500'>{index + 1}</td>
                                        <td className='pr-2 whitespace-nowrap border border-slate-500'>{student.name}</td>
                                        <td className='pr-2 text-center border border-slate-500'>{student.regno}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.stream.toUpperCase()}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.math10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.eng10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.chem10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.kisw10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.agri10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.busi10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.physc10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.histo10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.marks.bio10}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.total}</td>
                                        <td className='pr-2 border text-center border-slate-500'>{student.average}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinedStudentsMarks;
