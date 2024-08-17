import { useEffect, useState } from "react";
import { api } from "../api";

export const StuEve = () => {
  const id = JSON.parse(localStorage.getItem("jwt"));
  const [resu, setRes] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const url = `${api}features/events/`;

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${id}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setRes(data);
        console.log(data);
      } catch (error) {
        console.error('There was an error with the request:', error);
      }
    };

    fetchSubjects();
  }, [id]);

  if (!resu) {
    return <p>Loading...</p>;
  }

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('default', options);
  };

  return (
    <div className="flex">
      <ol className="relative flex flex-col m-6 w-96 border-l border-gray-200 dark:border-gray-700">
        {resu.map(event => (
          <li key={event.id} className="mb-4 ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-1.5 mt-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-300">
              {formatDate(event.date)}
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {event.title}
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-300">
              {event.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};
