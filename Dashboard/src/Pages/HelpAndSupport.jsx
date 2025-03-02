import React from 'react';

const HelpAndSupport = () => {
  return (
    <div className="min-h-screen overflow-y-auto max-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-sm">Get assistance for the Examination Processing System and School Management System</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* FAQs */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">How do I reset my password?</p>
                <p className="text-gray-600">
                  You can reset your password by clicking on the "Forgot Password" link on the login page. Follow the instructions sent to your email.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">How do I generate examination reports?</p>
                <p className="text-gray-600">
                  Navigate to the "Examination" section, select the desired class, and click on "Generate Report." You can download the report in PDF or Excel format.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">How do I add a new student to the system?</p>
                <p className="text-gray-600">
                  Go to the "Students" section in the School Management System, click on "Add New Student," and fill in the required details.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label className="block text-gray-700">Subject</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-gray-700">Message</label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Documentation */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Documentation</h2>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fas fa-book mr-2"></i>
                User Guide for Examination Processing System
              </a>
              <a
                href="#"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fas fa-book mr-2"></i>
                User Guide for School Management System
              </a>
              <a
                href="#"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fas fa-book mr-2"></i>
                API Documentation
              </a>
            </div>
          </div>

          {/* System Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                All systems are operational. No ongoing issues reported.
              </p>
            </div>
          </div>

          {/* Video Tutorials */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Video Tutorials</h2>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fas fa-video mr-2"></i>
                How to Use the Examination Processing System
              </a>
              <a
                href="#"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fas fa-video mr-2"></i>
                How to Manage Students in the School Management System
              </a>
              <a
                href="#"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <i className="fas fa-video mr-2"></i>
                How to Generate Reports
              </a>
            </div>
          </div>

          {/* Community Forum */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Community Forum</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Join our community forum to ask questions, share knowledge, and get help from other users.
              </p>
              <a
                href="#"
                className="text-blue-500 hover:text-blue-600"
              >
                Visit Forum
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;