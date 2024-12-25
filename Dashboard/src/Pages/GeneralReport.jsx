import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GeneralReport = () => {
  const [classValue, setClassValue] = useState("Form3");
  const [yearValue, setYearValue] = useState("2024-2025");
  const [termValue, setTermValue] = useState("Term-1");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/marks/${classValue}/${yearValue}/${termValue}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
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

  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");

    printWindow.document.write("<html><head><title>Print</title>");
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`<style>${styles}</style>`);
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };

  const calculateStudentTotalsAndAverages = (students) => {
    return students.map((student) => {
      const totalScores = student.subjects.reduce((total, subject) => {
        const scores = [subject.openerScore, subject.midTermScore, subject.finalScore];
        const validScores = scores.filter((score) => score != null);
        const avgScore = validScores.length > 0 ? validScores.reduce((acc, score) => acc + score, 0) / validScores.length : 0;
        return total + avgScore;
      }, 0);

      // Calculate student average by dividing the total score by the number of subjects
      const avgScore = student.subjects.length > 0 ? totalScores / student.subjects.length : 0;

      return {
        ...student,
        totalScore: totalScores,
        avgScore: avgScore,
        subjects: student.subjects.map((subject) => ({
          ...subject,
          avgScore: (subject.openerScore + subject.midTermScore + subject.finalScore) / 3
        })),
      };
    });
  };

  const updatedData = calculateStudentTotalsAndAverages(data);

  // Calculate the class total and average
  const calculateClassTotalAndAverage = () => {
    const totalScores = updatedData.reduce((sum, student) => sum + student.totalScore, 0);
    const subjectCount = updatedData.reduce((sum, student) => sum + student.subjects.length, 0);

    // Class average is the total score of all students divided by the number of subjects
    const classAverage = subjectCount > 0 ? totalScores / subjectCount : 0;

    return {
      total: totalScores,
      average: classAverage
    };
  };

  const classStats = calculateClassTotalAndAverage();

  const subjectStats = updatedData.reduce((acc, student) => {
    student.subjects.forEach(subject => {
      const existingSubject = acc.find(sub => sub.code === subject.code);
      if (existingSubject) {
        existingSubject.total += subject.avgScore;
        existingSubject.count++;
      } else {
        acc.push({
          code: subject.code,
          total: subject.avgScore,
          count: 1
        });
      }
    });
    return acc;
  }, []);

  subjectStats.sort((a, b) => (b.total / b.count) - (a.total / a.count));

  const calculateSubjectTotalsAndAverages = () => {
    return subjectStats.map(subjectStat => ({
      ...subjectStat,
      average: subjectStat.total / subjectStat.count
    }));
  };

  const subjectTotalsAndAverages = calculateSubjectTotalsAndAverages();

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto max-h-[93vh] flex flex-col">
      <div className="grid grid-cols-5 gap-4 p-3">
        <div className="w-24">
          <button
            onClick={handlePrint}
            className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900"
          >
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
        <div>
          <button
            onClick={() =>
              navigate("/report-card", {
                state: { data: updatedData, classValue, yearValue, termValue },
              })
            }
            className="text-center px-3 text-slate-500 text-sm w-full border border-1 border-slate-700 font-bold py-2 rounded hover:text-slate-900"
          >
            Reports
          </button>
        </div>
      </div>

      {updatedData.length === 0 ? (
        <p>No data found</p>
      ) : (
        <div
          id="printableTable"
          className="flex-1 overflow-y-auto"
          style={{ overflowY: "auto", padding: "10px" }}
        >
          <div className='flex justify-center'>
            <div>
              <img
                className="w-8 h-8 md:w-[60px] md:h-[44px]  bg-gray-100"
                src="KIbabii-Logo.png"
                alt="Logo"
              />
            </div>

            <div>
              <table className="min-w-full ">
                <thead>
                  <tr className="text-gray-800">
                    <th className="border border-slate-700 px-1 text-left">Academic Year</th>
                    <th className="border border-slate-700 px-1 text-left">Class</th>
                    <th className="border border-slate-700 px-1 text-left">Term</th>
                    <th className="border border-slate-700 px-1 text-left">Exam Type</th>
                    <th className="border border-slate-700 px-1 text-left">Best Subject</th>
                    <th className="border border-slate-700 px-1 text-left">Least Subject</th>
                    <th className="border border-slate-700 px-1 text-left">Mean Score</th>
                    <th className="border border-slate-700 px-1 text-left">Grade</th>
                    <th className="border border-slate-700 px-1 text-left">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-x border-slate-700'>
                    <td className=" border-r border-slate-700 text-yellow-700 px-1">{yearValue}</td>
                    <td className="border-r border-slate-700 text-yellow-700 px-1 ">{classValue}</td>
                    <td className="border-r border-slate-700 text-yellow-700 px-1 ">{termValue}</td>
                   
                    <td className=" border-r border-slate-700 text-yellow-700 px-1">{/**best subject */}</td>
                    <td className="border-r border-slate-700 text-yellow-700 px-1 ">{/**least subject code with lowest avg at the bottom */}</td>
                    <td className="border-r border-slate-700 text-yellow-700 px-1 ">{/**Mean score */}</td>
                    <td className=" border-r border-slate-700 text-yellow-700 px-1 ">{/**Grade */}</td>
                    <td className="border-r border-slate-700 text-yellow-700 px-1 ">{/**Remark */}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <table className="min-w-full table-auto text-center border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-700">Reg No</th>
                <th className="border border-slate-700">Stream</th>
                {subjectTotalsAndAverages.map((subjectStat, index) => (
                  <th key={index} className="border border-slate-700">
                    <p className="text-yellow-700">{index + 1}</p>
                  <p>{subjectStat.code}</p></th>
                ))}
                <th className="border border-slate-700">Total</th>
                <th className="border border-slate-700">Average</th>
              </tr>
            </thead>
            <tbody>
              {updatedData.map((student, studentIndex) => {
                const studentTotal = student.subjects.reduce((sum, subject) => sum + subject.avgScore, 0);
                const studentAverage = studentTotal / student.subjects.length;

                return (
                  <tr key={studentIndex} className="hover:bg-slate-300 text-black">
                    <td className="border border-slate-700">{student.regno}</td>
                    <td className="border border-slate-700">{student.stream}</td>
                    {subjectTotalsAndAverages.map((subjectStat, subjectIndex) => {
                      const subject = student.subjects.find((sub) => sub.code === subjectStat.code);
                      return (
                        <td key={subjectIndex} className="border border-slate-700">
                          {subject ? subject.avgScore.toFixed(2) : "-"}
                        </td>
                      );
                    })}
                    <td className="border border-slate-700">
                      {studentTotal.toFixed(2)}
                    </td>
                    <td className="border border-slate-700">
                      {studentAverage.toFixed(2)} {/* Displaying overall average for the student */}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-bold">
                <td colSpan={2} className="border border-slate-700">Total</td>
                {subjectTotalsAndAverages.map((subjectStat, index) => (
                  <td key={index} className="border border-slate-700">
                    {subjectStat.total.toFixed(2)}
                  </td>
                ))}
                <td className="border border-slate-700">
                  {classStats.total.toFixed(2)}
                </td>
              </tr>
              <tr className="font-bold">
                <td colSpan={2} className="border border-slate-700">Average</td>
                {subjectTotalsAndAverages.map((subjectStat, index) => (
                  <td key={index} className="border border-slate-700">
                    {subjectStat.average.toFixed(2)}
                  </td>
                ))}
                <td className="border border-slate-700">
                  {classStats.average.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GeneralReport;
