import React, { useEffect, useState } from 'react';
import { api } from '../api';

export const Interactions = ({ id, jwt }) => {
  const [interactions, setInteractions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await fetch(`${api}features/interaction/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setInteractions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [id, jwt]);

  if (loading) return <p className="text-center text-gray-700">Loading interactions...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      {interactions.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 dark:text-gray-300">No interactions found.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {interactions.map((interaction, index) => (
            <li key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <div className="flex flex-col space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Time:</strong> {new Date(interaction.created_at).toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Rating:</strong> {interaction.rating * 10}%
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
