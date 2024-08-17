import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from './Home';
import { Table } from '../Components/Table';
import { StuEve } from '../Components/StuEve';
import { Events } from '../Components/Events';
import { Attendance } from '../Components/Attendance';
import { AttendanceTable } from '../Components/AttendenceTable';

export const PreHome = () => {
    const navi = useNavigate();
    const id = JSON.parse(localStorage.getItem("jwt"));
    const teacher = JSON.parse(localStorage.getItem("teacher"));
    
    useEffect(() => {
      if (!id) {
        navi("/");
      }
    }, [id, navi]);
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='mx-6 my-6'>
      <div className="md:flex">
        <ul className="flex-column space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
          <li>
            <p
              onClick={() => handleTabClick('home')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${activeTab === 'home' ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
              </svg>
              Home
            </p>
          </li>
          <li>
            <p
              onClick={() => handleTabClick('events')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${activeTab === 'events' ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18"><path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/></svg>
              Events
            </p>
          </li>
          <li>
            <p
              onClick={() => handleTabClick('table')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${activeTab === 'table' ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
              </svg>
              Table
            </p>
          </li>
          {(!teacher) && <li>
            <p
              onClick={() => handleTabClick('attendance')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${activeTab === 'attendance' ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
              </svg>
              Attendance
            </p>
          </li>}
          {(!teacher) &&
            <li>
            <p
              onClick={() => handleTabClick('attendanceTable')}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${activeTab === 'attendanceTable' ? 'bg-blue-700 text-white dark:bg-blue-600' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'}`}
            >
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 8 8A8.009 8.009 0 0 0 8 0Zm0 1a7 7 0 1 1-7 7A7.008 7.008 0 0 1 8 1Zm-3.993 6.227a.75.75 0 0 1 .989-.44l2.5 1.5a.75.75 0 0 1 0 1.32l-2.5 1.5a.75.75 0 0 1-.989-.44V7.227Zm6.985 1.44a.75.75 0 0 0-.988.44v3.25a.75.75 0 0 0 1.244.561l2.5-1.5a.75.75 0 0 0 0-1.32l-2.5-1.5a.75.75 0 0 0-.256-.161Zm-1.993-2.5a.75.75 0 0 1 .256.161l2.5 1.5a.75.75 0 0 1 0 1.32l-2.5 1.5a.75.75 0 0 1-1.244-.561v-3.25a.75.75 0 0 1 .988-.44ZM8 7.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 7.5Z"/>
              </svg>
              Attendance Table
            </p>
          </li>
          }
        </ul>
        <div className="w-full">
          {activeTab === 'home' && (
            <div className="home-section">
              <h1 className="text-2xl font-semibold mb-4">Home</h1>
              <Home />
            </div>
          )}
          {activeTab === 'events' && (
            <div className="events-section">
              {/* <h1 className="text-2xl font-semibold mb-4">Events</h1> */}
              {teacher?<Events />:<StuEve />}
            </div>
          )}
          {activeTab === 'table' && (
            <div className="table-section">
              <Table />
            </div>
          )}
          {activeTab === 'attendance' && (!teacher) && (
            <div className="attendance-section">
              {/* <h1 className="text-2xl font-semibold mb-4">Attendance</h1> */}
              <Attendance />
            </div>
          )}
           {activeTab === 'attendanceTable' && !teacher && (
              <div className="attendance-table-section">
                <AttendanceTable />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
