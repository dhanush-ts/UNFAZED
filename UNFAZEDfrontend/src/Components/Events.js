import React, { useState } from 'react';
import { api } from '../api';

export const Events = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  const id = JSON.parse(localStorage.getItem("jwt"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = { title, date, description, year, department };

    try {
      const response = await fetch(`${api}features/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${id}`
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Event added successfully:', result);
      setTitle('');
      setDate('');
      setDescription('');
      setYear('');
      setDepartment('');
      setStatus("Event added successfully!");
    } catch (error) {
      console.error('There was an error with the request:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="mx-auto mb-5">
      <form className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-gray-700" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">Add New Event</h2>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            className="w-full mt-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Year</label>
          <input
            type="number"
            min={1}
            max={4}
            className="w-full mt-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Department</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Add Event
        </button>

        {status && (
          <p className={`mt-4 text-sm ${status.startsWith("Error") ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
};
