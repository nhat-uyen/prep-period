import { useEffect, useState } from "react";
import LessonReflection from "../components/LessonReflection";
import type { Lesson } from "../types/lesson";
import type { Reflection } from "../types/lesson";
import { createReflection, getLessonByID, getLessons } from "../api/lessons";



export default function Reflection() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLessons() {
      try {
        const data = await getLessons();
        setLessons(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load lessons");
      }
    }
    loadLessons();
  }, [])

  async function handleSelectedLesson(lessonId: number) {
    if (!lessonId) {
      setSelectedLesson(null);
      return;
    }
    try {
      setError("");
      const lesson = await getLessonByID(lessonId);
      setSelectedLesson(lesson);
    } catch (error) {
      console.error(error);
      setError("Failed to load lesson.");
    }
  }

  async function handleSavingReflection() {
    if (!reflection) {
      setError("Please complete your reflection.");
      return;
    }
    try {
      setError("")

      await createReflection(reflection);
      console.log("Reflection saved!");
    } catch (error) {
      console.error(error);
      setError("Failed to save reflection.");
    }

  }

  return (
    <div>
      <h1>Lesson Reflection</h1>
      <p>Reflect on each part of your lesson.</p>

      <select
        value={selectedLesson?.id ?? ""}
        onChange={(e) => {
          const lessonId = Number(e.target.value);
          handleSelectedLesson(lessonId)
        }
        }
      >
        <option value="">Select a lesson</option>
        {lessons.map(lesson => (
          <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
        ))}
      </select>

      {error && <p>{error}</p>}
      {selectedLesson !== null
        ? <>
          <LessonReflection
            lesson={selectedLesson}
            onReflectionChange={setReflection} />

          <button type="button" onClick={handleSavingReflection}>
            Save Reflection
          </button>
        </>
        : <p>Please select a lesson to begin your reflection.</p>
      }
    </div>
  )
}