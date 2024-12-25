import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Final = () => {
  const [classValue, setClassValue] = useState('Form3');
  const [yearValue, setYearValue] = useState('2024-2025');
  const [termValue, setTermValue] = useState('Term-1');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/marks/${classValue}/${yearValue}/${termValue}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [classValue, yearValue, termValue]);

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">Error: {error}</div>;
  }

  const subjectCodes = [
    ...new Set(data.flatMap(student => student.subjects.map(subject => subject.code))),
  ];

  const subjectScores = subjectCodes.map((code) => {
    const totalScore = data.reduce((sum, student) => {
      const subject = student.subjects.find(sub => sub.code === code);
      return sum + (subject ? subject.finalScore : 0);
    }, 0);
    return { code, totalScore };
  });

  const sortedSubjectCodes = subjectScores.sort((a, b) => b.totalScore - a.totalScore).map(subject => subject.code);

  const studentWithScores = data.map((student) => {
    const studentScores = sortedSubjectCodes.map((subjectCode) => {
      const subject = student.subjects.find(sub => sub.code === subjectCode);
      return subject ? subject.finalScore ?? 0 : 0;
    });

    const totalScore = studentScores.reduce((sum, score) => sum + score, 0);
    const averageScore = studentScores.length > 0 ? (totalScore / studentScores.length).toFixed(2) : 0;

    return { ...student, studentScores, totalScore, averageScore };
  });

  const totalScoresPerSubject = sortedSubjectCodes.map((code) => {
    return data.reduce((sum, student) => {
      const subject = student.subjects.find(sub => sub.code === code);
      return sum + (subject ? subject.finalScore : 0);
    }, 0);
  });

  const overallTotalScore = studentWithScores.reduce((sum, student) => sum + student.totalScore, 0);
  const overallAverageScore = studentWithScores.length > 0 ? (overallTotalScore / studentWithScores.length).toFixed(2) : 0;

  return (
    <div className="container mx-auto max-w-screen-lg ">
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
        <div>
          <button onClick={() => window.print()} className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900">
            Print
          </button>
        </div>
        <div>
          <select
            id="class"
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Form3">Form 3</option>
            <option value="Form4">Form 4</option>
            <option value="Form5">Form 5</option>
            <option value="Form6">Form 6</option>
          </select>
        </div>

        <div>
          <select
            id="year"
            value={yearValue}
            onChange={(e) => setYearValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>

        <div>
          <select
            id="term"
            value={termValue}
            onChange={(e) => setTermValue(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Term-1">Term-1</option>
            <option value="Term-2">Term-2</option>
            <option value="Term-3">Term-3</option>
          </select>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-lg text-red-500">No data found</p>
      ) : (
        <div className='mx-4 md:mx-0 grid grid-cols-1 max-h-[72vh] md:max-h-[80vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0'>
          <table id="printableTable" className="min-w-full table-auto text-center border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-slate-700">Reg No</th>
                <th className="px-4 py-2 border border-slate-700">Stream</th>
                {sortedSubjectCodes.map((code) => (
                  <th key={code} className="px-1 py-1 border border-slate-700">{code}</th>
                ))}
                <th className="px-4 py-2 border border-slate-700">Total</th>
                <th className="px-4 py-2 border border-slate-700">Average</th>
              </tr>
            </thead>
            <tbody>
              {studentWithScores.map((student) => (
                <tr className="hover:bg-slate-300 text-black" key={student.regno}>
                  <td className="border border-slate-700 px-1 py-1">{student.regno}</td>
                  <td className="border border-slate-700 px-1 py-1">{student.stream}</td>
                  {student.studentScores.map((score, idx) => (
                    <td key={idx} className="border border-slate-700 px-1 py-1">{score}</td>
                  ))}
                  <td className="border border-slate-700 px-1 py-1">{student.totalScore}</td>
                  <td className="border border-slate-700 px-1 py-1">{student.averageScore}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="border border-slate-700 px-1 py-1"><strong>Total Scores</strong></td>
                {totalScoresPerSubject.map((total, idx) => (
                  <td key={idx} className="border border-slate-700 px-1 py-1">{total}</td>
                ))}
                <td className="border border-slate-700 px-1 py-1">{overallTotalScore}</td>
                <td className="border border-slate-700 px-1 py-1">{overallAverageScore}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default Final;
