import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { LP } from '../Components/LP';

export const LearningPath = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(0); 
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const subjectID = useParams("id").id;

  const jwt = JSON.parse(localStorage.getItem("jwt"));

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('name', name);

    const url = `${api}student/material/${subjectID}/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      setSuccess(true);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload the file. Please try again.');
    }
  };

  const resetForm = () => {
    setFile(null);
    setCategory(0);
    setName('');
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white rounded-lg">
      <div className="mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md ">
        <h2 className="text-2xl font-semibold mb-6">Upload Learning Material</h2>
        {success && <p className="text-green-500 dark:text-green-400 mb-4">File uploaded successfully!</p>}
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="file">
              File
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="0">Common</option>
              <option value="1">Weak Learner</option>
              <option value="2">Average</option>
              <option value="3">Good</option>
              <option value="4">Topper</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900"
          >
            Upload
          </button>
        </form>
      </div>
      <LP />
    </div>
  );
};
