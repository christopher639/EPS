import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Import Bar from Chart.js (if you're using it)

axios.defaults.baseURL = "https://eps-backend.onrender.com";

const ReportForm = () => {
  const [students, setMarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("https://eps-backend.onrender.com/api/joined-students_marks")
      .then(response => {
        // Calculate average for each student and sort by average descending
        const studentsWithAverage = response.data.map(student => {
          const avg = (
            student.marks.eng10 +
            student.marks.math10 +
            student.marks.bio10 +
            student.marks.chem10 +
            student.marks.histo10 +
            student.marks.physc10 +
            student.marks.agri10 +
            student.marks.kisw10 +
            student.marks.busi10
          ) / 9;
          return { ...student, avg };
        }).sort((a, b) => b.avg - a.avg); // Sort descending by average

        setMarks(studentsWithAverage);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Filtered students based on search term
  const filteredStudents = students.filter(student =>
    student.regno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const getRemark = (score) => {
    if (score >= 75) return "E.E";
    if (score >= 50) return "M.E";
    if (score >= 0) return "B.E";
    return "F";
  };

  const getAvgRemark = (avg) => {
    if (avg >= 75) return "E.E";
    if (avg >= 50) return "M.E";
    if (avg >= 0) return "B.E";
    return "F";
  };

  const getAvgGradeRemark = (avg) => {
    if (avg >= 80) return "5";
    if (avg >= 60) return "4";
    if (avg >= 40) return "3";
    if (avg >= 20) return "2";
    return "1";
  };

  return (
    <div className='flex  min-w-full max-h-[80vh] flex-col gap-10 mb-5 overflow-y-auto overflow-x-auto'>
      <div className=' flex justify-between '>
        <div>
          <input 
            type="text" 
            className='text-center border outline-none py-1 px-2 text-sm cursor-pointer mb-2' 
            placeholder='Search by Adm No' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
          <button onClick={() => alert("Not implemented by Bundi for now")} className='text-center bg-green-600 py-1 px-2 text-sm cursor-pointer text-white mb-2'>Search</button>
        </div>
        <button onClick={handlePrint} className='text-center bg-green-600 py-1 px-2 cursor-pointer text-white text-sm mb-2'>Print</button>
      </div>

      <div id="printableTable">
        {filteredStudents.map((student, index) => { // Use filteredStudents here
          const { marks } = student;
          const avg = (marks.eng10 + marks.math10 + marks.bio10 + marks.chem10 + marks.histo10 + marks.physc10 + marks.agri10 + marks.kisw10 + marks.busi10) / 9;
          const avgRemark = getAvgRemark(avg);
          const avgGradeRemark = getAvgGradeRemark(avg);

          return (
            <div className="page-break" key={index}>
              <div className='min-h-auto min-w-auto pb-10 px-4'>
                <div className='flex flex-col justify-center'>
                  <div className='flex pb-2 justify-center'>
                    <img className='w-10 mt-4 h-10 md:w-20 md:h-20' src="kibabiilogo.jpeg" alt="School Logo" />
                  </div>
                  <div className='flex justify-center'>
                    <p>KIBABII SCHOOL</p>
                  </div>
                  <div className='flex justify-center'>
                    <p>TERM II</p>
                  </div>
                </div>
                <div className='flex border-b border-slate-500 justify-between'>
                  <p className='ml-1'>Name: <span className='text-yellow-800'>{student.name.toUpperCase()}</span></p>
                  <p className='ml-1'>ADM: <span className='text-yellow-800'>{student.regno}</span></p>
                  <p className='ml-1'>STREAM: <span className='text-yellow-800'>{student.stream}</span></p>
                  <p className='mr-3'>AVG: <span className='text-yellow-800'>{avg.toFixed(2)}</span></p>
                  <p className='mr-3'>GRADE: <span className='text-yellow-800'>{avgGradeRemark}</span></p>
                  <p className='mr-3'>REMARKS: <span className='text-yellow-800'>{avgRemark}</span></p>
                </div>
                <table className='w-full'>
                  <thead className='border-b border-r border-slate-500'>
                    <tr>
                      <th className='text-left border-r border-l border-slate-500'>SUBJECT</th>
                      <th className='border-r border-slate-500'>SCORE</th>
                      <th>REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(marks).map((subject, i) => (
                      <tr key={i} className='border-t border-r border-slate-500'>
                        <td className='border-r border-l border-slate-500'>{subject.toUpperCase()}</td>
                        <td className='text-center border-r border-slate-500'>{marks[subject]}</td>
                        <td className='text-center border-r border-slate-500'>{getRemark(marks[subject])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='flex flex-col md:flex-row gap-5 mt-5'>
                  <div className='border w-full border-slate-500'>
                    <table className='w-full'>
                      <caption>KEY</caption>
                      <tbody>
                        <tr className='border-t border-slate-500'>
                          <td>E.E</td>
                          <td>75 -100</td>
                          <td>Exceeding Expectation</td>
                        </tr>
                        <tr className='border-t border-slate-500'>
                          <td>M.E</td>
                          <td>50 -74</td>
                          <td>Meeting Expectation</td>
                        </tr>
                        <tr className='border-t border-slate-500'>
                          <td>B.E</td>
                          <td>0 -49</td>
                          <td>Below Expectation</td>
                        </tr>
                        <tr className='border-t border-slate-500'>
                          <td>F</td>
                          <td>NULL</td>
                          <td>Never did exam</td>
                        </tr>
                        <tr className='border-t border-slate-500'>
                          <td>AVG</td>
                          <td>Total divided by 9</td>
                          <td>Average</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className='w-full h-1/4 border border-slate-500 mt-5 px-1 '>
                    {/* Chart.js component can go here */}
                  </div>
                </div>
                <div className=''>
                  <p>Principal Message: <span className='text-gray-500 text-sm'>You are required to fully pay fees before reporting back; otherwise, you will not be allowed in school.</span></p>
                </div>
                <div className='mt-2 flex flex-row gap-5 justify-between'>
                  <p>Closing Date ______</p>
                  <p>Opening Date ______</p>
                  <p>Stamp b________</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportForm;
