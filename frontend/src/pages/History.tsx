import { useEffect, useState } from "react";
import { getLessons, deleteLesson, getLessonByID } from "../api/lessons";
import type { Lesson } from "../types/lesson";
import LessonHistory from "../components/LessonHistory";

// need to add Props when passing constant from one component to another
type HistoryProps = {
  history: Lesson[];
  setHistory: (lessons: Lesson[]) => void;
  removeLesson: (lessonId: number) => void;
}

function History({ history, setHistory, removeLesson }: HistoryProps) {
  const [error, setError] = useState('');
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function LoadHistory() {
      try {
        const lessons = await getLessons();
        setHistory(lessons);
      } catch (error) {
        console.error("Failed to load lesson history", error);
        setError("Failed to load lesson history")
      }
    }
    LoadHistory();
  }, [setHistory])

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

  return (
    <div>
      <h1>History</h1>
      {error && <p>{error}</p>}
      <LessonHistory
        lessons={history}
        onLessonSelected={handleLessonSelected}
        onLessonDeleted={handleLessonDeleted}
      />
    </div>
  )
}

export default History;