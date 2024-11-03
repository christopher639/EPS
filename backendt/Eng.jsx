import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Eng = () => {
  const [password, setPassword] = useState('');
  const [passForm, setPassForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Call useNavigate inside the component

  const handlePasswordSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Log the password to the console
    console.log('Password:', password);

    // Basic password check (for demo purposes)
    if (password === '5542') {
      navigate('/engformdata');
    } else {
      setErrorMessage('Incorrect password. Please try again.');
   
    }
  };

  return (
    <div>
      {passForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[0px] flex justify-center items-center">
          <div className="bg-white md:h-1/2  w-2/3 md:w-1/2 p-5 rounded">
            <form onSubmit={handlePasswordSubmit}>
              <div>
                <div className="flex flex-col gap-3">
                {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
                  <div className="flex justify-between">
                    <p>Password</p>
                    <p className="bg-green-800 h-6 rounded-full cursor-pointer">
                      <NavLink to="/entermarks">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="white"
                        >
                          <path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z" />
                        </svg>
                      </NavLink>
                    </p>
                  </div>
                  <input
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="outline-none border rounded px-2 py-1"
                    type="password"
                    placeholder="Enter password"
                  />
                
                </div>
                <button
                  type="submit"
                  className="border rounded shadow-lg px-3 py-1 mt-3 bg-slate-800 text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eng;
