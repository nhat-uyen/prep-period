import { useState } from "react";
import LessonForm from "./components/LessonForm"; 
import LessonCard from "./components/LessonCard";


function App() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState("")

  return (
    <>
      <LessonForm 
        onLessonGenerated={setLesson} 
        setLoading={setLoading}
        setLoadError={setLoadError}
        />
      {lesson && <LessonCard lesson={lesson} />}

      {loading && <h2>Generating lesson...</h2>}
      
      {loadError && <p>{loadError}</p>
      }
    </>
  );
}

export default App;