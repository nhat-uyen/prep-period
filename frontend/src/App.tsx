import { useEffect, useState } from "react";
import LessonForm from "./components/LessonForm"; 
import LessonCard from "./components/LessonCard";
import { getLessons, getLessonByID } from "./api/lessons";
import LessonHistory from "./components/LessonHistory";
import type { Lesson } from "./types/lesson";


function App() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [history, setHistory] = useState<Lesson[]>([]);

  async function handleLessonSelected(lessonId: number) {
    try {
      setLoadError("")
      const selectedLesson = await getLessonByID(lessonId);
      setLesson(selectedLesson);
      
    } catch (loadError) {
      setLoadError("Failed to load lesson")
    }
  }

  useEffect(() => {
    async function LoadHistory() {
      try {
        const lessons = await getLessons();
        setHistory(lessons)
      } catch (loadError) {
        setLoadError("Failed to load lesson history");
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
        onLessonSelected={handleLessonSelected}
        />

      {lesson && <LessonCard lesson={lesson} />}

      {loading && <h2>Generating lesson...</h2>}
      
      {loadError && <p>{loadError}</p>}
    </>
  );
}

export default App;