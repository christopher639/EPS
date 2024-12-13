import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:3000";
const Academic = () => {
  const [stream, setStream] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [modalVisible, setModalVisible] = useState(false);
  const [newStreamName, setNewStreamName] = useState("");
  const [newStreamTeacher, setNewStreamTeacher] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const streamResponse = await axios.get("/api/stream");
        const teachersResponse = await axios.get("/api/teachers");
        setStream(streamResponse.data);
        setTeachers(teachersResponse.data.reverse());
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const filteredStreams = stream.filter(
    (item) => item && item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleAddStream = () => {
    const newStream = {
      name: newStreamName,
      teacher: newStreamTeacher,
    };
    axios
      .post("/api/stream", newStream)
      .then((response) => {
        alert(response.data.message);
        setStream((prevStreams) => [...prevStreams, response.data.stream]);
        setModalVisible(false);
        setNewStreamName("");
        setNewStreamTeacher("");
      })
      .catch((err) => console.log("Error adding stream:", err));
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Stream</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Stream Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
                placeholder="Enter stream name"
              />
            </div>
            <div>
              <p>Class Teacher</p>
              <div className="relative">
                <select
                  className="w-full py-2 px-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  value={newStreamTeacher}
                  onChange={(e) => setNewStreamTeacher(e.target.value)}
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.fullname} value={teacher.fullname}>
                      {teacher.fullname}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStream}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Stream
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mx-4 mt-1">
        <div className="flex gap-2">
          <input
            className="outline-none px-4 py-2 text-center border border-gray-300 rounded-md w-1/3"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Search
          </button>
        </div>
        <div>
          <button
            onClick={() => setModalVisible(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-semibold text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="grid mx-5 max-h-[72vh] md:max-h-[71vh] overflow-y-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-4">
          {filteredStreams.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/joined-students_marks/${item.name}`)}
              className="min-w-full border border-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex justify-center items-center h-32 p-4 cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm">TOTAL:</p>
                <p className="text-sm">COD: {item.teacher}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Academic;
