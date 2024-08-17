import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { api } from '../api';

export const Attendance = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState(null);
  const jwt = JSON.parse(localStorage.getItem("jwt"));

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    }
  }, [jwt, navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const url = `${api}student/attendance/`;

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        console.log('Fetched data:', data); // Log the data to check its structure

        // No need to reduce, just set the fetched object directly
        setSubjects(data);

      } catch (error) {
        console.error('There was an error with the request:', error);
      }
    };

    fetchSubjects();
  }, [jwt]);

  if (!subjects) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Attendance Summary by Subject</h2>
      <div className="flex flex-wrap justify-between max-w-3xl m-auto gap-4">
        {Object.keys(subjects).map((subject) => {
          const { total, present, absent } = subjects[subject];
          
          // Calculate attendance percentage with NaN handling
          const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";

          return (
            <Card 
              key={subject} 
              t1={subject} 
              t2={`Present: ${present}, Absent: ${absent}, Attendance: ${attendancePercentage}%`} 
              sub={subject} 
            />
          );
        })}
      </div>
    </div>
  );
};
