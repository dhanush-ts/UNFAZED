import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { api } from '../../api';

// Registering the required Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const BottomPerformersChart = ({ id }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Average Scores',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const jwt = JSON.parse(localStorage.getItem("jwt"));

  useEffect(() => {
    const fetchSubjects = async () => {
      const url = `${api}student/mark/${id}/`;

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);

        // Process the data to compute averages
        const categories = ['CAT 1', 'CAT 2', 'CAT 3', 'SEM'];
        const sums = { 'CAT 1': 0, 'CAT 2': 0, 'CAT 3': 0, 'SEM': 0 };
        const counts = { 'CAT 1': 0, 'CAT 2': 0, 'CAT 3': 0, 'SEM': 0 };

        data.forEach(item => {
          if (categories.includes(item.exam)) {
            sums[item.exam] += item.secured; // Use 'secured' field
            counts[item.exam] += 1;
          }
        });

        const averages = categories.map(category => (counts[category] ? (sums[category] / counts[category]).toFixed(2) : 0));

        setChartData({
          labels: categories,
          datasets: [
            {
              label: 'Average Scores',
              data: averages,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('There was an error with the request:', error);
        setChartData({
          labels: [],
          datasets: [
            {
              label: 'Average Scores',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      }
    };

    fetchSubjects();
  }, [jwt, id]);

  return (
    <div className='rounded-lg border-2 p-5' style={{ width: '400px', height: '300px', margin: '0 auto' }}>
      {/* <h2>Average Scores by Category</h2> */}
      <Bar 
        data={chartData} 
        options={{
          responsive: true,
          maintainAspectRatio: false, // Ensures the chart resizes according to the container
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Average Scores by Exam Category',
            },
          },
          scales:{
            x: {
              grid: {
                display: false, // Removes the grid lines on the x-axis
              }
          }}
        }} 
      />
    </div>
  );
};
