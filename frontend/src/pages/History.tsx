import { useEffect, useState } from "react";
import { getLessons, deleteLesson, getLessonByID, clearLessons } from "../api/lessons";
import type { Lesson } from "../types/lesson";
import LessonHistory from "../components/LessonHistory";
import { Link } from "react-router";

// need to add Props when passing constant from one component to another
type HistoryProps = {
  history: Lesson[];
  setHistory: (lessons: Lesson[]) => void;
  removeLesson: (lessonId: number) => void;
  clearHistory: () => void;
}

function History({ history, setHistory, removeLesson, clearHistory }: HistoryProps) {
  const [error, setError] = useState('');
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await getLessons();
        setHistory(result);
      } catch (error) {
        console.error("Failed to load history", error);
        setError("Failed to load history.");
      }
    }
    loadHistory();
  }, [setHistory]);

  async function handleLessonSelected(lessonId: number) {
    try {
      setError("")

      if (lesson?.id !== lessonId) {
        const selectedLesson = await getLessonByID(lessonId);
        setLesson(selectedLesson);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load lesson")
    }
  }

  async function handleLessonDeleted(lessonId: number) {
    try {
      setError("");
      await deleteLesson(lessonId);
      removeLesson(lessonId)
      if (lesson?.id === lessonId) {
        setLesson(null)
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete lesson.")
    }
  }

  async function handleClearHistory() {
    try {
      setError("");
      await clearLessons();
      clearHistory();
    } catch (error) {
      console.error("Failed to clear history:", error);
      setError("Failed to clear lesson history.");
    }
  }

  return (
    <div>
      <h1>History</h1>
      {history.length === 0
        ? <div>
          <h2>No past lesson </h2>
          <Link to="/">Back to Home</Link>
        </div>
        : <>
          {error && <p>{error}</p>}
          <LessonHistory
            lessons={history}
            onLessonSelected={handleLessonSelected}
            onLessonDeleted={handleLessonDeleted}
            onClearLessons={handleClearHistory}
          />
        </>}
    </div>
  )
}

export default History;