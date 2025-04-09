import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Help = () => {
  const [activeTab, setActiveTab] = useState('troubleshooting');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: 'technical',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const commonIssues = [
    {
      id: 1,
      question: "I can't log in to my account",
      answer: "Try resetting your password. If that doesn't work, ensure you're using the correct email address associated with your account."
    },
    {
      id: 2,
      question: "Reports aren't generating properly",
      answer: "Clear your browser cache and try again. If the problem persists, check if all required fields are filled in the report template."
    },
    {
      id: 3,
      question: "The system is running slowly",
      answer: "This might be due to high server load. Try again during non-peak hours. If consistently slow, check your internet connection."
    },
    {
      id: 4,
      question: "Error messages when submitting marks",
      answer: "Ensure all required fields are filled and you're using the correct format for marks (numbers only)."
    },
    {
      id: 5,
      question: "I can't see my student's data",
      answer: "Check your access permissions. If you're a teacher, ensure you're assigned to the correct class."
    }
  ];

  const contactInfo = {
    email: "bundichristopher639@gmail.com",
    phone: "+254745315644",
    hours: "Monday-Friday, 9AM-5PM (EAT)"
  };

  return (
    <div className="max-h-screen overflow-y-auto bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Go Back Button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Go Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find solutions to common problems or contact our support team for personalized assistance.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar - Navigation */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Help Topics</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('troubleshooting')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'troubleshooting' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  Troubleshooting Guide
                </button>
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'submit' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  Submit an Issue
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'contact' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  Contact Support
                </button>
              </nav>
            </div>
          </div>

          {/* Main content area */}
          <div className="w-full md:w-3/4">
            {activeTab === 'troubleshooting' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Troubleshooting Guide</h2>
                <div className="space-y-6">
                  {commonIssues.map((issue) => (
                    <div key={`issue-${issue.id}`} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">{issue.question}</h3>
                      <p className="text-gray-600">{issue.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Still need help?</h3>
                  <p className="text-gray-700 mb-4">If you didn't find a solution to your problem, you can:</p>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setActiveTab('submit')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Submit an Issue
                    </button>
                    <button 
                      onClick={() => setActiveTab('contact')}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submit' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit an Issue</h2>
                {submitted ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    <p>Thank you for your submission! Our team will review your issue and get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Type
                      </label>
                      <select
                        id="issueType"
                        name="issueType"
                        value={formData.issueType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account Problem</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description of the Issue
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please describe your issue in detail, including any error messages you're seeing..."
                      ></textarea>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="screenshot"
                        name="screenshot"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="screenshot" className="ml-2 block text-sm text-gray-700">
                        I can provide a screenshot of the issue
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                      >
                        Submit Issue
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Support</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Direct Contact</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-sm text-blue-600">{contactInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-sm text-blue-600">{contactInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Support Hours</p>
                          <p className="text-sm text-blue-600">{contactInfo.hours}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Support Resources</h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          Documentation
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                          </svg>
                          Live Chat
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;