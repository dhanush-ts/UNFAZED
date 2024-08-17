import React, { useState } from 'react';
import {api} from '../api' 

export const LPC = ({ file, index }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleSendQuestion = async () => {
    try {
      const response = await fetch(`${api}features/query/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "fileID": file.id,
          "question": question
        })
      });

      if (!response.ok) throw new Error('Failed to send question');

      const result = await response.json();
      setResponse(result.detail);

      // Update the list of questions and responses
      setQuestionsList([...questionsList, { question, response: result.answer }]);

      // Clear the question input
      setQuestion('');
      // handleDialogClose(); // Uncomment if you want to close the dialog after sending the question
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div key={index} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-lg">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a6 6 0 0 1 6 6v3h-3a3 3 0 0 0-3 3v3H6v-3a3 3 0 0 0-3-3H0V8a6 6 0 0 1 6-6h6m0-2H6a8 8 0 0 0-8 8v3a5 5 0 0 0 5 5v3a2 2 0 0 0 2 2h7v3h2v-3h7v3h2v-3a2 2 0 0 0 2-2v-3a5 5 0 0 0 5-5V8a8 8 0 0 0-8-8z" />
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">{file.name}</p>
          <a
            href={file.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Download File
          </a>
        </div>
        <div>
          <i
            className="bi bi-question-octagon text-3xl cursor-pointer"
            onClick={handleDialogOpen}
          ></i>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
            <textarea
              value={question}
              onChange={handleQuestionChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Type your question here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSendQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
              <button
                onClick={handleDialogClose}
                className="ml-4 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
            {response && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Response:</h3>
                <p>{response}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
