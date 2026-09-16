import { useEffect, useState } from "react";
import { getLessons, deleteLesson, getLessonByID, clearLessons } from "../api/lessons";
import { type Reflection, type Lesson } from "../types/lesson";
import LessonHistory from "../components/LessonHistory";
import { Link } from "react-router";
import LessonCard from "../components/LessonCard";
import "./History.css";
import LessonCardReflection from "../components/LessonCardReflection";

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
  const [reflection, setReflection] = useState<Reflection | null>(null);

  const lessonWithoutReflection = history.filter(lesson => lesson.reflection === null);
  const lessonWithReflection = history.filter(lesson => lesson.reflection !== null);

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
        if (selectedLesson.reflection !== null) {
          setReflection(selectedLesson.reflection);
        };
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load lesson")
      setReflection(null)
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
      setLesson(null);
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
          <div className="history-grid">
            <div>
              <h2>No Reflection</h2>
              <LessonHistory
                lessons={lessonWithoutReflection}
                onLessonSelected={handleLessonSelected}
                onLessonDeleted={handleLessonDeleted}
              />
            </div>
            <div>
              <h2>Reflected</h2>
              <LessonHistory
                lessons={lessonWithReflection}
                onLessonSelected={handleLessonSelected}
                onLessonDeleted={handleLessonDeleted}
              />
            </div>
          </div>
          <button className="history__clear-button" onClick={handleClearHistory}>
            Delete All Lessons
          </button>
        </>}
      {lesson !== null
        ? <div>
          {reflection !== null
            ? <LessonCardReflection lesson={lesson} reflection={reflection} />
            : <LessonCard lesson={lesson} />}
        </div>
        : null}
    </div>
  )
}

export default History;