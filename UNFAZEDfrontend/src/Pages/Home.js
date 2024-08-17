// import { Card } from "../Components/Card"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../Components/Card";
import { api } from "../api";

export const Home = () => {

  const navi = useNavigate();
  const id = JSON.parse(localStorage.getItem("jwt"));
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  
  useEffect(() => {
    if (!id) {
      navi("/");
    }
  }, [id, navi]);
    
  const [subjects, setSubjects] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      const url = `${api}user/subject/`;

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
        setSubjects(data);
      } catch (error) {
        console.error('There was an error with the request:', error);
      }
    };

    fetchSubjects();

  }, [id]);
  if (!subjects) {
    return <p>Loading...</p>;
  }

  const transformedArray = subjects.map(subject => {
    const t1 = `${subject.title} - ${subject.code}`;
    const t2 = (!teacher) ? subject.staff.name : `${subject.klass.department} - ${subject.klass.section}`;
    const sub_id = subject.id;

    return { t1, t2 ,sub_id};
  });

  return (
    <div className="max-w-4xl m-auto my-12">
    <div className="mx-5 grid grid-cols-2 gap-5">
  {
    transformedArray.map((t, index) => (
        <Card key={index} t1={t.t1} t2={t.t2} sub={t.sub_id}/>
    ))
  }
    </div>
</div>

  )
}
