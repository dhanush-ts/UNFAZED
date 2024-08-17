import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { api } from '../../api';

// Register necessary Chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const FeedbackPieChart = ({ id }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [error, setError] = useState(null);
  const jwt = JSON.parse(localStorage.getItem("jwt"));

  useEffect(() => {
    const fetchFeedback = async () => {
      const url = `${api}features/feedback/${id}/`;

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
        setFeedbackData(data.feedback);
        setOverallRating(data.overall_rating);
        console.log(data);
      } catch (error) {
        console.error('There was an error with the request:', error);
        setError(error.message);
      }
    };

    fetchFeedback();
  }, [id, jwt]);

  // Count the number of ratings for each category (1 to 5)
  const ratingCounts = [0, 0, 0, 0, 0];
  feedbackData.forEach(feedback => {
    const rating = Math.round(feedback.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1] += 1;
    }
  });

  const totalRatings = ratingCounts.reduce((sum, count) => sum + count, 0);

  // Prepare data for the pie chart
  const data = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: '# of Ratings',
        data: ratingCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12 // Decrease font size
          },
          boxWidth: 12, // Decrease box width
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const count = tooltipItem.raw;
            const percentage = ((count / totalRatings) * 100).toFixed(1);
            return `${tooltipItem.label}: ${count} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: 'white',
        formatter: (value, ctx) => {
          const percentage = ((value / totalRatings) * 100).toFixed(1);
          return value === 0 ? "" : `${percentage}%`;
        },
        font: {
          weight: 'bold',
          size: 14,
        }
      },
      title: {
        display: true,
        text: 'Rating Counts by Rating Categories'
      }
    }
  };

  return (
    <div className='rounded-lg border-2 mx-12 px-5' style={{ width: '350px', height: '300px' }}>
      {error && <div>Error: {error}</div>}
      {feedbackData.length > 0 && (
        <>
          {overallRating && (
            <div className="overall-rating">
              {/* <strong>Overall Rating: </strong>{overallRating.toFixed(2)} */}
            </div>
          )}
          <Pie data={data} options={options} />
        </>
      )}
    </div>
  );
};
