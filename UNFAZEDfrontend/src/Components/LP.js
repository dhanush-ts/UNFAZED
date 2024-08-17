import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { LPC } from "./LPC";

export const LP = () => {
  const sub_id = useParams("id");
  const id = JSON.parse(localStorage.getItem("jwt"));
  const [resu, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const url = `${api}student/material/${sub_id.id}/`;

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
        setSubjects(data);
      } catch (error) {
        console.error('There was an error with the request:', error);
      }
    };

    fetchSubjects();
  }, [id, sub_id]);

  if (!resu) {
    return <p>Loading...</p>;
  }

  console.log(resu);

  return (
    <div className="mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">Learning Files</h2>
      {resu.map((file, index) => (
        <LPC id={file.id} file={file} index={index} />
        ))}
    </div>
  );
};
