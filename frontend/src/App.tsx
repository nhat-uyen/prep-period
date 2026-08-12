import { useEffect, useState } from "react";
import LessonForm from "./components/LessonForm"; 
import LessonCard from "./components/LessonCard";
import { getLessons, getLessonByID, deleteLesson } from "./api/lessons";
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
      if (lesson != null && lesson.id != lessonId || lesson == null) {
        const selectedLesson = await getLessonByID(lessonId);
        setLesson(selectedLesson);
      }
    } catch (loadError) {
      setLoadError("Failed to load lesson")
    }
  }

  async function handleLessonDeleted(lessonId: number) {
    try {
      await deleteLesson(lessonId);

      setHistory((previousHistory) => previousHistory.filter((lesson) => lesson.id !== lessonId));

      if (lesson?.id === lessonId) {
        setLesson(null)
      }
    } catch (loadError) {
      setLoadError("Failed to delete lesson.")
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

  function handleLessonGenerated(newLesson: Lesson) {
    setLesson(newLesson);
    setHistory((previousHistory) => [newLesson, ...previousHistory]);
  }
  
  return (
    <>
      <LessonForm 
        onLessonGenerated={handleLessonGenerated} 
        setLoading={setLoading}
        setLoadError={setLoadError}
        />
      <LessonHistory 
        lessons={history} 
        onLessonSelected={handleLessonSelected}
        onLessonDeleted={handleLessonDeleted}
        />

      {loading && <h2>Generating lesson...</h2>}
      
      {loadError && <p>{loadError}</p>}

      {lesson && <LessonCard lesson={lesson} />}
    </>
  );
}

export default App;