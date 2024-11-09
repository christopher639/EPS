import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = "https://eps-backendt.onrender.com";

const Form1yReport = () => {
  const [students, setMarks] = useState([]);        // State to hold the students' marks data
  const [searchTerm, setSearchTerm] = useState("");  // State for search term (ADM No)
  const [loading, setLoading] = useState(true);      // Loading state to track data fetching

  // Fetch data when component mounts
  useEffect(() => {
    // Set loading to true before fetching data
    setLoading(true);

    // Fetch students data
  //  axios.get("/api/joined-students_marks")
    axios.get("https://eps-backendt.onrender.com/api/joined-students_marks-form1y")
      .then(response => {
        // Calculate average marks for each student and sort them
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

        setMarks(studentsWithAverage);  // Set the students with average marks to the state
        setLoading(false);  // Set loading to false when data is fetched
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);  // Stop loading in case of error
      });
  }, []);

  // Filter students based on search term (ADM No)
  const filteredStudents = students.filter(student =>
    student.regno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle the print functionality
  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // Get the remarks based on the score for individual subjects
  const getRemark = (score) => {
    if (score >= 75) return "E.E";   // Exceeding Expectation
    if (score >= 50) return "M.E";   // Meeting Expectation
    if (score >= 0) return "B.E";    // Below Expectation
    return "F";                      // Failed or not attended
  };

  // Get average remarks for a student based on the average score
  const getAvgRemark = (avg) => {
    if (avg >= 75) return "E.E";
    if (avg >= 50) return "M.E";
    if (avg >= 0) return "B.E";
    return "F";
  };

  // Get grade based on average marks
  const getAvgGradeRemark = (avg) => {
    if (avg >= 80) return "5";
    if (avg >= 60) return "4";
    if (avg >= 40) return "3";
    if (avg >= 20) return "2";
    return "1";
  };

  return (
    <div className='flex min-w-full max-h-[80vh] flex-col gap-10 mb-5 overflow-y-auto overflow-x-hidden'>
      <div className='flex mx-5 justify-between'>
        <div>
          <input
            type="text"
            className='text-center border outline-none py-1 px-2 text-sm cursor-pointer mb-2'
            placeholder='Search by Adm No'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
          <button onClick={() => alert("Not implemented by Bundi for now")} className='text-center bg-green-600 py-1 px-2 text-sm cursor-pointer text-white mb-2'>
            Search
          </button>
        </div>
        <button onClick={handlePrint} className='text-center bg-green-600 py-1 px-2 cursor-pointer text-white text-sm mb-2'>
          Print
        </button>
      </div>

      {/* Conditional Rendering: Loading message */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">Wait, it's loading...</p>
        </div>
      ) : (
        <div id="printableTable">
          {filteredStudents.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-semibold text-gray-600">No students found matching the search criteria.</p>
            </div>
          ) : (
            filteredStudents.map((student, index) => {
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
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Form1yReport;
