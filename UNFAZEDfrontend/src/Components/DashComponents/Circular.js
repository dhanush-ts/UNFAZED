import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { api } from '../../api';

export const FeedbackRatingCard = ({ id }) => {
  const [rating, setRating] = useState(0);
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
        setRating(data.overall_rating.toFixed(2));
      } catch (error) {
        setError('There was an error fetching the feedback data.');
        console.error('There was an error with the request:', error);
      }
    };

    fetchFeedback();
  }, [id, jwt]);

  return (
    <div className='mx-12 border-2 p-5' style={styles.card}>
      <h3>Overall Feedback Rating</h3>
      {error && <div>Error: {error}</div>}
      {rating !== null ? (
        <CircularProgressbar
          value={rating}
          maxValue={5}
          text={`${rating}/5`}
          styles={buildStyles({
            pathColor: rating >= 4 ? 'green' : '#4BC0C0', // Change color based on rating
            textColor: '#333',
            trailColor: '#d6d6d6',
            backgroundColor: '#3e98c7',
          })}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

// Inline styles for the card
const styles = {
  card: {
    width: '280px',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
};
