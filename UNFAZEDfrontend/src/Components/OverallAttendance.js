import React, { useState, useEffect } from 'react';
import { api } from '../api';

export const OverallAttendance = ({id}) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const jwtToken = JSON.parse(localStorage.getItem('jwt')); // Get JWT from local storage

      try {
        const response = await fetch(`${api}student/sub-attendance/${id}/overall/`, {
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
        setAttendanceData(result.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setError('Failed to fetch attendance data.');
      }
    };

    fetchAttendanceData();
  }, [id]); // Empty dependency array means this runs once on mount

  return (
    <div>
      {error && <p className="mt-2 text-red-500">{error}</p>}

      <div className="attendance-data mt-4">
        <h2 className="text-xl font-semibold mb-4">Attendance Data</h2>
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
            {attendanceData.map((entry) => {
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

