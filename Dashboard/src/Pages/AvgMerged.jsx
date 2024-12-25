import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AvgMerged = () => {
  const location = useLocation();
  const { data, classValue, yearValue, termValue } = location.state || {}; // Default to an empty object if state is not available

  const [studentWithScores, setStudentWithScores] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [overallTotalScore, setOverallTotalScore] = useState(0);
  const [overallAverageScore, setOverallAverageScore] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      // Process the data to extract scores and calculate averages
      const tempStudentWithScores = data.map((student) => {
        let totalScore = 0;
        let totalSubjects = 0;
        const studentScores = student.subjects.map((subject) => {
          const score = subject.avgScore;
          if (score != null) {
            totalScore += score;
            totalSubjects++;
          }
          return score != null ? score : "-"; // Replace missing scores with "-"
        });
        const averageScore = totalSubjects > 0 ? totalScore / totalSubjects : 0;
        return {
          regno: student.regno,
          stream: student.stream,
          studentScores,
          totalScore,
          averageScore
        };
      });

      setStudentWithScores(tempStudentWithScores);

      // Calculate averages for each subject
      const tempSubjectAverages = studentWithScores.length > 0 
        ? studentWithScores[0].studentScores.map((_, idx) => {
            const subjectScores = data.map((student) => {
              const score = student.subjects[idx]?.avgScore;
              return score !== null ? score : 0;
            });
            const totalSubjectScore = subjectScores.reduce((total, score) => total + score, 0);
            return subjectScores.length > 0 ? totalSubjectScore / subjectScores.length : 0;
          })
        : [];

      setSubjectAverages(tempSubjectAverages);

      // Calculate overall scores
      const tempOverallTotalScore = tempStudentWithScores.reduce((total, student) => total + student.totalScore, 0);
      setOverallTotalScore(tempOverallTotalScore);

      const tempOverallAverageScore = tempStudentWithScores.reduce((total, student) => total + student.averageScore, 0) / tempStudentWithScores.length;
      setOverallAverageScore(tempOverallAverageScore);
    }
  }, [data]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center gap-10 mx-3">
        <div className='flex'>
          <p>Class  :</p>
          <p className='text-yellow-700'>{classValue}</p>
        </div>
        <div className='flex'>
          <p>Academic Year : </p>
          <p className='text-yellow-700'>{yearValue}</p>
        </div>
        <div className='flex'>
          <p>Term :</p>
          <p className='text-yellow-700'>{termValue}</p>
        </div>
      </div>

      <div className="mx-4 md:mx-0 grid grid-cols-1 max-h-[80vh] md:max-h-[86vh] overflow-y-auto overflow-x-auto mr-5 md:mr-0">
        <table className="min-w-full table-auto text-center border-collapse">
          <thead>
            <tr>
              <th className="border border-slate-700">Reg No</th>
              <th className="border border-slate-700">Stream</th>
              {data[0]?.subjects.map((subject, idx) => (
                <th key={idx} className="border border-slate-700">{subject.code}</th>
              ))}
              <th className="border border-slate-700">Total</th>
              <th className="border border-slate-700">Average</th>
            </tr>
          </thead>
          <tbody>
            {studentWithScores.map((student) => (
              <tr key={student.regno}>
                <td className="border border-slate-700">{student.regno}</td>
                <td className="border border-slate-700">{student.stream}</td>
                {student.studentScores.map((score, idx) => (
                  <td key={idx} className="border border-slate-700">
                    {score === "-" ? "-" : score.toFixed(1)} {/* Format scores with a decimal if they are numbers */}
                  </td>
                ))}
                <td className="border border-slate-700">{student.totalScore.toFixed(1)}</td>
                <td className="border border-slate-700">{student.averageScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="border border-slate-700"><strong>Total Scores</strong></td>
              {subjectAverages.map((average, idx) => (
                <td key={idx} className="border border-slate-700">
                  {average === 0 ? "-" : average.toFixed(2)} {/* Replace 0 average with a dash */}
                </td>
              ))}
              <td className="border border-slate-700">{overallTotalScore.toFixed(2)}</td>
              <td className="border border-slate-700">{overallAverageScore.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AvgMerged;
