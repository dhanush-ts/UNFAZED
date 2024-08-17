// import { useState } from "react";
import { ExamRow } from "../Components/ExamRow";

export const TimeTable = ({ examData, teacher }) => {
  // const [selectedCategory, setSelectedCategory] = useState("All");

  // const handleCategoryChange = (event) => {
  //   setSelectedCategory(event.target.value);
  // };

  // Normalize both the selectedCategory and exam.exam for comparison
  // const filteredExamData = selectedCategory === "All"
  //   ? examData 
  //   : examData.filter(exam => exam.exam === selectedCategory);

//  <div className="mb-4 flex ">
//  <span className="ml-4 mt-4 block text-gray-700 mb-2">Select Exam Category:</span> 
//          <select
//           id="category-select"
//           className="block ml-4 max-w-xs p-2 border border-gray-300 rounded"
//           value={selectedCategory}
//           onChange={handleCategoryChange}
//         >
//           <option value="All">All</option>
//           <option value="CAT 1">CAT 1</option>
//           <option value="CAT 2">CAT 2</option>
//           <option value="CAT 3">CAT 3</option>
//           <option value="SEM">SEM</option>
//         </select> 
//        </div> 
      

  
  return (
      <div className="relative shadow rounded-lg">
        <table className="w-full text-sm text-left  rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {teacher && <th scope="col" className="px-6 py-3">Student Name</th>}
              <th scope="col" className="px-6 py-3">Exam</th>
              <th scope="col" className="px-6 py-3">Secured</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Percentage</th>
              <th scope="col" className="px-6 py-3">Status</th>
              {teacher && <th scope="col" className="px-6 py-3"><span className="sr-only">Edit</span></th>}
            </tr>
          </thead>
          <tbody>
            {examData.map((exam, index) => {
              const isDataAvailable = exam.secured !== null && exam.total !== null;
              const percentage = isDataAvailable ? (exam.secured / exam.total) * 100 : null;
              const isPass = percentage !== null && percentage >= 50;
              // console.log(examData);
              return (
                <ExamRow 
                  key={index} 
                  index={index} 
                  isDataAvailable={isDataAvailable} 
                  percentage={percentage} 
                  exam={exam} 
                  securedfilter = {exam.secured}
                  teacher={teacher} 
                  isPass={isPass} 
                />
              );
            })}
          </tbody>
        </table>
      </div>
  );
};
