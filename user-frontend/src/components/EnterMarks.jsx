import React, { useState } from 'react';
import axios from "axios";
import { NavLink } from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:3000/";

const EnterMarks = () => {
    const [userform, setUserForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        adm: "",
        math: "",
        eng: "",
        sci: "",
        phy: "",
        bio: "",
        chem: "",
        kisw: "",
        geo: "",
    });

    const handleOnChange = (e) => {
        const { value, name } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/mark", formData)
            .then(() => {
                alert("Data Saved Successfully");
                setUserForm(false);
            })
            .catch((err) => {
                console.error("Error saving data:", err);
                alert("Failed to save data.");
            });
    };

    return (
        <div className="mx-4 max-h-[80vh] overflow-y-auto bg-gray-100 md:mx-1 p-4">
            {/* Header and Search Section */}
            <div className="flex justify-center mb-4">
                <div className="flex w-full gap-2">
                    <input
                        className="outline-none w-full text-center py-2  rounded border border-gray-300 w-56"
                        type="text"
                        placeholder="Search"
                    />
                    
                </div>
               
            </div>

           
            {/* Learning Area Selection */}
            <div className="mt-4 text-center">
                <p className="text-lg font-semibold mb-4">Select Learning Area You Teach</p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <NavLink to="/math">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        Mathematics
                    </div>
                </NavLink>
                <NavLink to="/eng">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        English
                    </div>
                </NavLink>
                <NavLink to="/kiswa">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        Kiswahili
                    </div>
                </NavLink>
                <NavLink to="/chem">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        Chemistry
                    </div>
                </NavLink>
                <NavLink to="/physc">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        Physics
                    </div>
                </NavLink>
                <NavLink to="/agri">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        Agriculture
                    </div>
                </NavLink>
                <NavLink to="/bs">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        Business
                    </div>
                </NavLink>
                <NavLink to="/histo">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        History
                    </div>
                </NavLink>
                <NavLink to="/bio">
                    <div className="border border-gray-300 hover:bg-green-700 hover:text-white text-lg text-center py-10 rounded cursor-pointer transition">
                        Biology
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default EnterMarks;
