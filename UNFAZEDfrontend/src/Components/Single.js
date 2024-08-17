import React, { useState } from 'react';
import { api } from '../api';

export const Single = () => {
  const [date, setDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');

  const fetchAttendanceData = async () => {
    if (date) {
      const jwtToken = JSON.parse(localStorage.getItem('jwt')); // Get JWT from local storage

      try {
        const response = await fetch(`${api}student/sub-attendance/2/${date}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`, // Add JWT to Authorization header
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setAttendanceData(result.data || []); // Ensure attendanceData is always an array
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setError('Failed to fetch attendance data.');
        setAttendanceData([]); // Reset data on error
      }
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <div>
      <form className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date (YYYY-MM-DD):</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={fetchAttendanceData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Fetch Data
        </button>
      </form>

      {error && <p className="mt-2 text-red-500">{error}</p>}

      <div className="attendance-data mt-4">
        <h2 className="text-xl font-semibold mb-4">Attendance Data for {date}</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.length > 0 ? (
              attendanceData.map((entry) => {
                const totalAttendance = entry.present + entry.absent;
                const attendancePercentage = totalAttendance === 0 ? 0 : (entry.present / totalAttendance) * 100;
                return (
                  <tr key={entry.rollno}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.rollno}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.present}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.absent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendancePercentage.toFixed(2)}%</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
