import { useEffect, useState } from "react";
import LessonForm from "./components/LessonForm"; 
import LessonCard from "./components/LessonCard";
import { getLessons } from "./api/lessons";
import LessonHistory from "./components/LessonHistory";
import type { Lesson } from "./types/lesson";


function App() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [history, setHistory] = useState<Lesson[]>([]);

  useEffect(() => {
    async function LoadHistory() {
      try {
        const lessons = await getLessons();
        setHistory(lessons)
      } catch (error) {
        console.error("Failed to load lesson history", error);
      }
    }

    LoadHistory();
  }, [])

  return (
    <>
      <LessonForm 
        onLessonGenerated={setLesson} 
        setLoading={setLoading}
        setLoadError={setLoadError}
        />
        <LessonHistory 
        lessons={history} 
        onLessonSelected={setLesson}
        />

      {lesson && <LessonCard lesson={lesson} />}

      {loading && <h2>Generating lesson...</h2>}
      
      {loadError && <p>{loadError}</p>}
    </>
  );
}

export default App;