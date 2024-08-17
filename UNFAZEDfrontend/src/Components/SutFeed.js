import { useState } from "react";
import { api, wordsToFilter } from "../api";

export const SutFeed = ({ subject_id, jwt }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const TextFilter = (text) => {
    const regex = new RegExp(`\\b(${wordsToFilter.join('|')})\\b`, 'gi');
    return text.replace(regex, '').replace(/\s+/g, ' ').trim();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const filteredComment = TextFilter(comment);

    const feedbackData = {
      subjectID: subject_id,
      rating: rating,
      comment: filteredComment,
    };

    console.log(feedbackData);

    try {
      const res = await fetch(`${api}features/feedback/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponseMessage("Feedback submitted successfully!");
      console.log(data);
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
      console.error("There was an error with the request:", error);
    }
  };

  return (
    <div className="feedback-form bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md dark:shadow-gray-700">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            htmlFor="rating"
          >
            Rating
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            htmlFor="comment"
          >
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Submit
        </button>
      </form>
      {responseMessage && (
        <p className="mt-4 text-sm dark:text-gray-300">{responseMessage}</p>
      )}
    </div>
  );
};
