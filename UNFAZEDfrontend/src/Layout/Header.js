import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import logo from "../asserts/logo.jpg"

export const Header = () => {

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    // Handle logout logic, e.g., clearing tokens, user data, etc.
    localStorage.removeItem('jwt');
    localStorage.removeItem('teacher'); // Example of clearing user data
    navigate('/');
     // Redirect to login page
  };

  const id = JSON.parse(localStorage.getItem("jwt"));
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const [data, setData] = useState({});

  
    useEffect(() => {
      const fetchSubjects = async () => {
        const url = `${api}user/profile/`;
  
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${id}`,
              'Content-Type': 'application/json'
            }
          });
  
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
  
          const data = await res.json();
          setData(data);
        } catch (error) {
          console.error('There was an error with the request:', error);
        }

      };
      if(id){
      fetchSubjects();
      }
  
    }, [id]);
    if (!data) {
      return <p>Loading...</p>;
    }  
  

  return (

<nav className="border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src={logo} className="h-8" alt="Flowbite Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Hacktivate</span>
    </Link>
    <div className="w-full md:block md:w-auto" id="navbar-multi-level">
      <i onClick={() => setIsDarkMode(!isDarkMode)} className="bi bi-brightness-low text-2xl  text-center border-4 rounded-full px-1 text-gray-500 cursor-pointer mx-5"></i>
      {id && <i
            className="bi bi-person-circle text-4xl text-gray-500 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          ></i>}
      {id && isHovered && (
            <div
              className="absolute z-10 right-4 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300">Name: {data.name || ""}</p>
                {(!teacher) && <p className="text-gray-700 dark:text-gray-300">Roll No: {data.rollno|| ""}</p>}
                {(!teacher) && <p className="text-gray-700 dark:text-gray-300">Class : {data.klass?.department|| ""} - {data.klass?.section|| ""}</p>}
                {(!teacher) && <p className="text-gray-700 dark:text-gray-300">Year: {data.klass?.year|| ""}</p>}
                <button
                  className="mt-3 w-full text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
    </div>
  </div>
</nav>

  )
}
