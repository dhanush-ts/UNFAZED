import { Link } from "react-router-dom";

export const Card = ({t1,t2,sub}) => {
  
    return (
        <Link to={`./home/${sub}`} className="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{t1}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{t2}</p>
        </Link>
  )
}
