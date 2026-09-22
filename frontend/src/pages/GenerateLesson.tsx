import LessonForm from '../components/LessonForm';
import LessonCard from '../components/LessonCard';
import LessonEditor from '../components/LessonEditor';
import { useState } from 'react';
import type { Lesson } from '../types/lesson';
import { updateLesson } from '../api/lessons';

type GenerateProps = {
  addLesson: (lesson: Lesson) => void;
  editLesson: (lesson: Lesson) => void;
}

export default function GenerateLesson({ addLesson, editLesson }: GenerateProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  function handleLessonGenerated(newLesson: Lesson) {
    setLesson(newLesson);
    addLesson(newLesson);
  }

  async function handleLessonUpdated(updatedLesson: Lesson) {
    try {
      setError("");
      const savedLesson = await updateLesson(updatedLesson.id, updatedLesson);
      editLesson(savedLesson)
      setLesson(savedLesson);

      setEditing(false);
    } catch (loadError) {
      console.error("Failed to update lesson:", loadError);
      setError("Failed to save lesson.")
    }
  }

  return (
    <div>
      <h1> Generate Lesson </h1>
      <LessonForm
        onLessonGenerated={handleLessonGenerated}
        setError={setError}
      />
      {error && <p>{error}</p>}
      {lesson && editing && (
        <LessonEditor
          lesson={lesson}
          onSaved={handleLessonUpdated}
          onCancel={() => setEditing(false)}
        />
      )}

      {lesson && !editing && (
        <>
          <LessonCard lesson={lesson} />
          <button onClick={() => setEditing(true)}>Edit Lesson</button>
        </>
      )}
    </div>
  )
}