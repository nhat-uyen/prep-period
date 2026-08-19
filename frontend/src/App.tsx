import { useEffect, useState } from "react";
import LessonForm from "./components/LessonForm"; 
import LessonCard from "./components/LessonCard";
import { getLessons, getLessonByID, deleteLesson, updateLesson } from "./api/lessons";
import LessonHistory from "./components/LessonHistory";
import type { Lesson } from "./types/lesson";
import LessonEditor from "./components/LessonEditor";


function App() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Lesson[]>([]);
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    async function LoadHistory() {
      try {
        const lessons = await getLessons();
        setHistory(lessons)
      } catch (error) {
        setError("Failed to load lesson history");
      }
    }

    LoadHistory();
  }, [])

  function handleLessonGenerated(newLesson: Lesson) {
    setLesson(newLesson);
    setHistory((previousHistory) => [newLesson, ...previousHistory]);
  }

  async function handleLessonSelected(lessonId: number) {
    try {
      setError("")
      if (lesson != null && lesson.id != lessonId || lesson == null) {
        const selectedLesson = await getLessonByID(lessonId);
        setLesson(selectedLesson);
      }
    } catch (error) {
      setError("Failed to load lesson")
    }
  }

  async function handleLessonDeleted(lessonId: number) {
    try {
      await deleteLesson(lessonId);

      setHistory((previousHistory) => previousHistory.filter((lesson) => lesson.id !== lessonId));

      if (lesson?.id === lessonId) {
        setLesson(null)
      }
    } catch (error) {
      setError("Failed to delete lesson.")
    }
  }

  async function handleLessonUpdated(updatedLesson: Lesson) {
    try {
      setError("");

      const savedLesson = await updateLesson(updatedLesson.id, updatedLesson);

      setLesson(savedLesson);
      setHistory(previousHistory => previousHistory.map(lesson => lesson.id == savedLesson.id
        ? savedLesson
        : lesson
      ));

      setEditing(false);
    } catch(loadError) {
      console.error("Failed to update lesson:", loadError);
      setError("Failed to save lesson.")
    }
  }
  
  return (
    <>
      <LessonForm 
        onLessonGenerated={handleLessonGenerated} 
        setLoading={setLoading}
        setError={setError}
        />
      <LessonHistory 
        lessons={history} 
        onLessonSelected={handleLessonSelected}
        onLessonDeleted={handleLessonDeleted}
        />

      {loading && <h2>Generating lesson...</h2>}
      
      {error && <p>{error}</p>}

      {lesson && editing && (
        <LessonEditor 
        lesson={lesson}
        onSaved={handleLessonUpdated}
        onCancel={() => setEditing(false)}
        />
      )}

      {lesson && !editing && (
        <LessonCard 
        lesson={lesson} 
        onEdit={() => setEditing(true)}
        />
      )}

    </>
  )
}

export default App;