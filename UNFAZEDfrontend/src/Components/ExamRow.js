import { useState, useEffect } from "react";
import { api } from "../api";

export const ExamRow = ({ index, exam, teacher }) => {
  const [edit, setEdit] = useState(false);
  const [num, setNumber] = useState(exam.secured || 0);
  const [loading, setLoading] = useState(false);
  const [secured, setSecured] = useState(exam.secured || null);
  const total = exam.total || 100
  const [percentage, setPercentage] = useState(null);
  const [isPass, setIsPass] = useState(false);

  const jwt = JSON.parse(localStorage.getItem("jwt"));

  useEffect(() => {
    if (secured === null) {
      setPercentage(null);
      setIsPass(false);
    } else {
      const newPercentage = (secured / total) * 100;
      setPercentage(newPercentage);
      setIsPass(newPercentage >= 50);
    }
  }, [secured, total]);

  const handleSubmit = async () => {
    if (!edit) {
      setEdit(true);
    } else {
      setLoading(true);
      try {
        const url = `${api}student/mark/${exam.id}/`;
        const body = {
          secured: num,
          total: total,
        };

        const res = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        setSecured(num); // Update the secured state
        setEdit(false);
      } catch (error) {
        console.error("There was an error with the request:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const displayValue = secured === null ? "not yet uploaded" : secured;
  const displayPercentage = percentage === null ? "not yet uploaded" : percentage.toFixed(2);

  return (
    <tr
      key={index}
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-500"
    >
      {teacher && (
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {exam.student.name}
        </th>
      )}
      <td className="px-6 py-4 ">{exam.exam}</td>
      {!edit && <td className="px-6 py-4">{displayValue}</td>}
      {edit && (
        <td className="px-6 py-4">
          <input
            onChange={(e) => setNumber(parseFloat(e.target.value))}
            value={num}
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-12 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </td>
      )}
      <td className="px-6 py-4">{total !== null ? total : "N/A"}</td>
      <td className="px-6 py-4">{displayPercentage}</td>
      <td className="px-6 py-4">
        {secured !== null ? (
          <span
            className={`inline-block px-2 py-1 text-sm font-medium rounded-lg ${
              isPass
                ? "bg-green-200 text-green-700 dark:text-slate-100 dark:bg-green-700"
                : "bg-red-200 text-red-700 dark:text-slate-100 dark:bg-red-700 px-3"
            }`}
          >
            {isPass ? "Pass" : "Fail"}
          </span>
        ) : (
          "not yet uploaded"
        )}
      </td>
      {teacher && (
        <td className="px-6 py-4 text-right">
          <button
            onClick={handleSubmit}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            disabled={loading}
          >
            {edit ? "Save" : "Edit"}
          </button>
        </td>
      )}
    </tr>
  );
};
