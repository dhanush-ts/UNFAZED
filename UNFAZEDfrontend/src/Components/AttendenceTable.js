import React, { useState } from 'react';
import { api } from '../api';

export const AttendanceTable = () => {
  const [date, setDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!date) {
      setError('Please enter a date.');
      return;
    }
    setError('');

    const jwtToken = JSON.parse(localStorage.getItem('jwt')); // Get JWT from local storage

    try {
      const response = await fetch(`${api}student/attendance/${date}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`, // Add JWT to Authorization header
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Enter Date (YYYY-MM-DD):</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Fetch Attendance
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>

      <div className="attendance-data">
        <h2 className="text-xl font-semibold mb-4">Attendance Data for {date}</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((entry, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.subject.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.subject.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.status === 0 ? 'Absent' : 'Present'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};