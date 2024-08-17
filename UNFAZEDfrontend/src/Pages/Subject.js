import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TimeTable } from "../Components/TimeTable";
import { LP } from "../Components/LP"
import { Feedback } from "../Components/Feedback"
import { Interactions } from "../Components/Interactions"
import { SutFeed } from '../Components/SutFeed';
import { api } from '../api';
import { LearningPath } from '../Components/LearningPath';
import { Dashboard } from '../Components/Dashboard';
import { OverallAttendance } from '../Components/OverallAttendance';
import { Single } from '../Components/Single';

export const Subject = () => {
  const { id } = useParams();
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const [ex, setEx] = useState([]);
  
  // State for tabs
  const [marksTab, setMarksTab] = useState(true);
  const [learningPathTab, setLearningPathTab] = useState(false);
  const [feedbackTab, setFeedbackTab] = useState(false);
  const [interactionTab, setInteractionTab] = useState(false);
  const [dashTab, setDashTab] = useState(false);
  const [overallTab,setOverall] = useState(false);
  const [attendanceTab,setAttendance] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      const url = `${api}student/mark/${id}/`;

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setEx(data);
        console.log(data);
      } catch (error) {
        console.error('There was an error with the request:', error);
      }
    };

    fetchSubjects();
  }, [jwt, id]);

  const handleTabClick = (tab) => {
    setMarksTab(tab === 'marks');
    setLearningPathTab(tab === 'learningPath');
    setFeedbackTab(tab === 'feedback');
    setInteractionTab(tab === 'interaction');
    setDashTab(tab=== "dash")
    setOverall(tab=== "overall")
    setAttendance(tab=== "attendance")
  };

  return (
    <div className='mx-6 my-6'>
      <div className="md:flex">
      <ul className="flex-column space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
          <li>
            <p
              onClick={() => handleTabClick('marks')}
              className={`inline-flex items-center cursor-pointer px-4 py-3 rounded-lg w-full ${marksTab ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
              </svg>
              Marks
            </p>
          </li>
          <li>
            <p
              
              onClick={() => handleTabClick('learningPath')}
              className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${learningPathTab ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18"><path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/></svg>
              Learning Path
            </p>
          </li>
          <li>
            <p
              onClick={() => handleTabClick('feedback')}
              className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${feedbackTab ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
              </svg>
              Feedback
            </p>
          </li>
          {teacher && (
            <li>
              <p
                
                onClick={() => handleTabClick('interaction')}
                className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${interactionTab ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
              >
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M15 3h3.586L7.05 14.536 8.464 15.95 19 5.414V9h2V3h-6v2h4.586L6.05 15.536 7.464 16.95 18 6.414V11h2V3zm-2 6H3c-1.1 0-2 .9-2 2v11h9v-5h2v5h9V11c0-1.1-.9-2-2-2h-9z"/></svg>
                Interactions
              </p>
            </li>
          )}
            {teacher && (
            <li>
              <p    
                onClick={() => handleTabClick('dash')}
                className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${dashTab ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
              >
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M15 3h3.586L7.05 14.536 8.464 15.95 19 5.414V9h2V3h-6v2h4.586L6.05 15.536 7.464 16.95 18 6.414V11h2V3zm-2 6H3c-1.1 0-2 .9-2 2v11h9v-5h2v5h9V11c0-1.1-.9-2-2-2h-9z"/></svg>
                Dashboard
              </p>
            </li>
          )}{teacher && (
            <li>
              <p    
                onClick={() => handleTabClick('overall')}
                className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${overallTab ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
              >
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M15 3h3.586L7.05 14.536 8.464 15.95 19 5.414V9h2V3h-6v2h4.586L6.05 15.536 7.464 16.95 18 6.414V11h2V3zm-2 6H3c-1.1 0-2 .9-2 2v11h9v-5h2v5h9V11c0-1.1-.9-2-2-2h-9z"/></svg>
                Overall Attendance
              </p>
            </li>
          )}
          {/* {teacher && (
            <li>
              <p    
                onClick={() => handleTabClick('attendance')}
                className={`inline-flex cursor-pointer items-center px-4 py-3 rounded-lg w-full ${attendanceTab ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
              >
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M15 3h3.586L7.05 14.536 8.464 15.95 19 5.414V9h2V3h-6v2h4.586L6.05 15.536 7.464 16.95 18 6.414V11h2V3zm-2 6H3c-1.1 0-2 .9-2 2v11h9v-5h2v5h9V11c0-1.1-.9-2-2-2h-9z"/></svg>
                Single day attendance
              </p>
            </li>
          )} */}
        </ul>
        <div className="w-full">
          {marksTab && (
            <div className="section ">
              <h1 className="text-2xl font-semibold mb-4">Marks</h1>
              <TimeTable  examData={ex} teacher={teacher}/>
            </div>
          )}
          {learningPathTab && (
            <div className="learning-path-section">
              {/* <h1 className="text-2xl font-semibold mb-4">Learning Path</h1> */}
              {teacher?<LearningPath id = {id} />:<LP jwt={jwt} />}
            </div>
          )}
          {feedbackTab && (
            <div className="feedback-section">
              {/* <h1 className="text-2xl font-semibold mb-4">Feedback</h1> */}
              {teacher?<Feedback id = {id} jwt={jwt} />:<SutFeed subject_id = {id} jwt={jwt} />}
            </div>
          )}
          {interactionTab && teacher && (
            <div className="interaction-section">
              <h1 className="text-2xl font-semibold mb-4">Interactions</h1>
              <Interactions id = {id} jwt={jwt} />
            </div>
          )}
          {teacher && dashTab &&(
            <div className="dash-section">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <Dashboard id = {id} jwt={jwt} />
          </div>
          )}{teacher && overallTab &&(
            <div className="dash-section">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <OverallAttendance id = {id} jwt={jwt} />
          </div>
          )}{teacher && attendanceTab &&(
            <div className="dash-section">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <Single id = {id} jwt={jwt} />
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
