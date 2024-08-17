import { useEffect, useState } from "react";
import { api } from "../api";

export const Feedback = ({ id, jwt }) => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const url = `${api}features/feedback/${id}/`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id, jwt]);

  if (loading) {
    return <p className="text-center text-gray-700">Loading feedback...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="feedback-container bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg dark:shadow-gray-700">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Overall Rating</h2>
      <div className="flex items-center mb-8">
        <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
          {feedbackData.overall_rating !== null ? feedbackData.overall_rating.toFixed(1) : 0}
        </span>
        <span className="ml-2 text-xl text-gray-500 dark:text-gray-300">/ 5</span>
        <span className="mx-6 font-light text-gray-500 dark:text-gray-300">
          ({feedbackData.feedback.length}) responses
        </span>
      </div>
      <div className="feedback-list space-y-6">
        <h3 className="text-xl font-semibold mb-4 dark:text-gray-300">Feedback</h3>
        {feedbackData.feedback.map((item, index) => (
          <div
            key={index}
            className="feedback-item border border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 shadow-sm dark:shadow-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.286a1 1 0 0 0 .95.691h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.029a1 1 0 0 0-.364 1.118l1.07 3.286c.3.921-.755 1.688-1.538 1.118l-2.8-2.029a1 1 0 0 0-1.176 0l-2.8 2.029c-.783.57-1.838-.197-1.538-1.118l1.07-3.286a1 1 0 0 0-.364-1.118L2.428 8.714c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 0 0 .95-.691l1.07-3.286z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="mt-2 text-gray-800 dark:text-gray-300 leading-relaxed">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
