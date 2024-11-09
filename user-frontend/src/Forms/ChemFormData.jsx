import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set the default base URL for axios
axios.defaults.baseURL = 'https://eps-backendt.onrender.com';

const ChemFormData = () => {
  const [students, setMarks] = useState([]);
  const [formData, setFormData] = useState({
    subjectcode: 'chem10',
    regno: '',
    score: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch student data
  const getFetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/joined-students-generallay');
      setMarks(response.data);
    } catch (error) {
      toast.error('Failed to fetch student data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student data on component mount
  useEffect(() => {
    getFetchData();
  }, []);

  // Handle form input changes
  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.regno || !formData.score) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/subjectmark', formData);
      toast.success('Chemistry mark saved successfully!');
      setFormData({
        subjectcode: 'chem10',
        regno: '',
        score: '',
      });
      getFetchData(); // Refresh the student data
    } catch (error) {
      toast.error('Failed to save chemistry mark. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete operation (if needed)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/subjectmark/${id}`);
      toast.success('Chemistry mark deleted successfully!');
      getFetchData(); // Refresh student data
    } catch (error) {
      toast.error('Failed to delete chemistry mark. Please try again.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex w-full flex-col">
        <div className="flex mt-1 flex-col md:flex-row">
          <div className="w-full px-2 border rounded">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 rounded-md">
                <div className="flex justify-between gap-4">
                  <p className="py-2">SUBJECT CODE:</p>
                  <input
                    onChange={handleOnChange}
                    name="subjectcode"
                    type="text"
                    value="CHEM10"
                    readOnly
                    className="p-2 border rounded-md outline-none text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <p className="py-1">ADM NO:</p>
                  <input
                    onChange={handleOnChange}
                    name="regno"
                    type="text"
                    placeholder="ADM NO"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-between gap-4">
                  <p className="py-1">SCORE:</p>
                  <input
                    onChange={handleOnChange}
                    name="score"
                    type="number"
                    placeholder="SCORE"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="bg-slate-800 text-white py-1 rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="flex mx-2 flex-col max-h-[53vh] sm:max-h-[50vh] overflow-y-auto overflow-x-auto">
            <div className="flex justify-between">
              <div>
                <input className="outline-none border mt-1" type="text" placeholder="Search" />
              </div>
              <div>
                <button className="bg-green-600 py-1 text-white px-2">Print</button>
              </div>
            </div>
            <table className="min-w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="border-r">ADM NO</th>
                  <th className="border-r">STREAM</th>
                  <th className="border-r whitespace-nowrap">CHEM SCORE</th>
                  <th className="border border-slate-500 text-center">
                    <button className="text-white px-1 rounded-sm cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#EA3323"
                      >
                        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border py-3 border-slate-500">
                    <td className="pr-2 text-center border border-slate-500">{student.regno}</td>
                    <td className="pr-2 text-center border border-slate-500">{student.stream}</td>
                    <td className="pr-2 text-center border border-slate-500">{student.marks.chem10}</td>
                    <td className="border border-slate-500 text-center">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-white px-1 rounded-sm cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#EA3323"
                        >
                          <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex w-2/5 items-center justify-center">
        <div className="hidden md:flex">Class performance Analytics</div>
      </div>
    </div>
  );
};

export default ChemFormData;
