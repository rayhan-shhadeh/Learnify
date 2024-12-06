import React from 'react';
import { FaBookOpen, FaClipboardList, FaBolt, FaCalendarAlt, FaCheckCircle, FaUsers, FaUser } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white shadow">
        <h1 className="text-lg font-bold">Study tools</h1>
        <button className="text-gray-500">
          <FaClipboardList size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Top Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow rounded-lg">
            <FaBookOpen className="text-blue-500" size={30} />
            <h2 className="mt-2 text-lg font-semibold">Quizzes</h2>
            <p className="text-sm text-gray-500">Practice</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <FaClipboardList className="text-green-500" size={30} />
            <h2 className="mt-2 text-lg font-semibold">Flashcards</h2>
            <p className="text-sm text-gray-500">Learn</p>
          </div>
        </div>

        {/* Options List */}
        <ul className="mt-6 space-y-4">
          {[
            { label: 'Practice sessions', icon: <FaBolt className="text-yellow-500" size={20} /> },
            { label: 'Calendar', icon: <FaCalendarAlt className="text-red-500" size={20} /> },
            { label: 'Habit tracker', icon: <FaCheckCircle className="text-green-500" size={20} /> },
            { label: 'Groups', icon: <FaUsers className="text-blue-500" size={20} /> },
            { label: 'Profile', icon: <FaUser className="text-gray-500" size={20} /> },
          ].map((item, index) => (
            <li key={index} className="flex items-center space-x-4 p-3 bg-white shadow rounded-lg">
              <div className="p-2 bg-gray-100 rounded-full">{item.icon}</div>
              <span className="text-gray-700">{item.label}</span>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer Navigation */}
      <footer className="flex justify-between items-center px-4 py-2 bg-white shadow fixed bottom-0 inset-x-0">
        {[
          { label: 'Home', icon: <FaUser className="text-black" size={24} /> },
          { label: 'Courses', icon: <FaBookOpen size={24} /> },
          { label: 'My Library', icon: <FaClipboardList size={24} /> },
          { label: 'Search', icon: <FaUser size={24} /> },
          { label: 'More', icon: <FaUser size={24} /> },
        ].map((item, index) => (
          <button key={index} className="flex flex-col items-center space-y-1">
            {item.icon}
            <span className="text-sm text-gray-500">{item.label}</span>
          </button>
        ))}
      </footer>
    </div>
  );
};

export default HomePage;
