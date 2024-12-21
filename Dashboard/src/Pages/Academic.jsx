import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

axios.defaults.baseURL = "http://localhost:3000";

const Academic = () => {
  const [marksData, setMarksData] = useState([]);
  const [subjectHeaders, setSubjectHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [year, setYear] = useState('');
  const [term, setTerm] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [stream, setStream] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get(`/api/marks/${stream || 'form1x'}/${year || '2025-2026'}/${term || 'Term-1'}/${examCategory || 'opener'}`);
        const data = response.data;

        // Extract unique subject codes from the marks
        const subjects = Array.from(
          new Set(
            data.flatMap(student => student.marks.map(mark => mark.subjectCode))
          )
        );

        setMarksData(data);
        setSubjectHeaders(subjects);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching marks data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchMarks();
  }, [stream, year, term, examCategory]);

  const filteredMarksData = marksData.filter(student =>
    searchQuery ? student.regno.includes(searchQuery) : true
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // If no marks data found, display a "Not Found" message
  if (marksData.length === 0) {
    return (
      <div className="py-4">
        <div className="text-center text-xl text-red-600">
          <p>No Data Found. Please check your filters and try again.</p>
        </div>
      </div>
    );
  }

  const { year: tableYear, stream: tableStream, term: tableTerm, examCategory: tableExamCategory } = marksData[0] || {};

  const handlePrint = () => {
    const printContents = document.getElementById("printableTable").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Navigate to the report form page and pass data
  const handleReportClick = () => {
    navigate('/reportform', { state: { marksData, subjectHeaders } });
  };

  return (
    <div className='flex flex-col max-w-screen-xl mx-auto'>
        {/* Filters */}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
          <div className="min-w-full">
            <button onClick={handlePrint} className="text-center text-slate-500 text-sm w-full  border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900 whitespace-nowrap">
              Print Sheet
            </button>
          </div>
          <div className="min-w-full">
            <input
              type="text"
              className="text-center text-sm w-full border border-slate-300 outline-none py-2 px-3 text-sm rounded-md"
              placeholder="REG NO"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="min-w-full">
            <select
              className="px-3 py-2 w-full text-sm outline-none border rounded"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
            >
              <option value="">Stream</option>
              <option value="form1x">Form 1X</option>
              <option value="form2x">Form 2X</option>
              <option value="form3x">Form 3X</option>
              <option value="form4x">Form 4X</option>
            </select>
          </div>
          <div className="min-w-full">
            <select
              className="px-3 py-2 w-full text-sm outline-none border rounded"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Year</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
          <div className="min-w-full">
            <select
              className="px-3 py-2 w-full text-sm outline-none border rounded"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value="">Term</option>
              <option value="Term-1">Term-1</option>
              <option value="Term-2">Term-2</option>
              <option value="Term-3">Term-3</option>
            </select>
          </div>
          <div className="min-w-full">
            <select
              className="px-3 py-2 w-full text-sm outline-none border rounded"
              value={examCategory}
              onChange={(e) => setExamCategory(e.target.value)}
            >
              <option value="">Category</option>
              <option value="opener">Opener</option>
              <option value="mid-term">Mid-Term</option>
              <option value="final">Final</option>
            </select>
          </div>
          <div>
            <button onClick={handleReportClick} className="text-center px-3 text-slate-500 text-sm w-full  border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900">
              Reports
            </button>
          </div>
        </div>
    
        {/* Display data */}
        <div className='mx-4 md:mx-0 grid grid-cols-1 max-h-[72vh] md:max-h-[80vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
         <div id='printableTable'>
            {/* Table for displaying Year, Grade/Class, Term, Exam Category */}
            <table className="min-w-full border ">
              <thead>
                <tr className="text-gray-800">
                  <th className="border border-slate-700 px-4 py-1 text-left">Year</th>
                  <th className="border border-slate-700 px-4 py-1 text-left">Grade/class</th>
                  <th className="border border-slate-700 px-4 py-1 text-left">Term</th>
                  <th className="border border-slate-700 px-4 py-1 text-left">Exam Category</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-x border-slate-700'>
                  <td className=" border-r border-slate-700 text-yellow-700 px-1 py-1">{tableYear || year}</td>
                  <td className="border-r border-slate-700 text-yellow-700 px-1 py-1">{tableTerm || term}</td>
                  <td className="border-r border-slate-700 text-yellow-700 px-1 py-1">{tableStream || stream}</td>
                  <td className="border-r border-slate-700 text-yellow-700 px-1 py-1">{tableExamCategory || examCategory}</td>
                </tr>
              </tbody>
            </table>
            
            {/* Table for displaying student marks */}
            <table className="min-w-full border border-slate-700">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-1 py-1">Reg No</th>
                  {subjectHeaders.map((subject, index) => (
                    <th key={index} className="border-x border-slate-700 px-1 py-1">{subject.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMarksData.length === 0 ? (
                  <tr>
                    <td colSpan={subjectHeaders.length + 1} className="text-center py-1 text-red-600">No Data Found</td>
                  </tr>
                ) : (
                  filteredMarksData.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-300 hover:text-black hover:font-bold">
                      <td className="border border-slate-500 px-1 py-1">{student.regno}</td>
                      {subjectHeaders.map((subject, idx) => {
                        const mark = student.marks.find(m => m.subjectCode === subject);
                        return (
                          <td key={idx} className="border text-center border-slate-700 px-1 py-1">
                            {mark ? mark.score : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
         </div>
        </div>
    </div>
  );
};

export default Academic;
