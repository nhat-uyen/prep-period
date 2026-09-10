/**
 * LessonForm module
 *
 * Renders a form for collecting lesson generation parameters and submits
 * them to the lessons API. Calls `onLessonGenerated` with the created lesson
 * when the request succeeds.
 */
import { useState } from "react";
import api from "../api/lessons";
import type { Lesson } from "../types/lesson";
import "./LessonForm.css";


type LessonFormProps = ({
  onLessonGenerated: (lesson: Lesson) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void
});

export default function LessonForm({ onLessonGenerated, setLoading, setError }: LessonFormProps) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("");


  //Later: add in try catch block to catch input that are empty
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/lessons", { subject, topic, grade, duration_minutes: duration });

      onLessonGenerated(response.data);

    } catch (error) {
      console.error(error)
      setError("Failed to generate lesson. Please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lesson-form">
      <form className="lesson-form__form" onSubmit={handleSubmit}>
        <div className="lesson-form__field">
          <label htmlFor="lesson-subject">Subject</label>
          <input
            id="lesson-subject"
            name="subject"
            placeholder="e.g. Biology"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>
        <div className="lesson-form__field">
          <label htmlFor="lesson-topic">Topic</label>
          <input
            id="lesson-topic"
            name="topic"
            placeholder="e.g. Cell structure"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>
        <div className="lesson-form__field">
          <label htmlFor="lesson-grade">Grade</label>
          <input
            id="lesson-grade"
            name="grade"
            min="1"
            value={grade}
            type="number"
            onChange={e => setGrade(e.target.value)}
          />
        </div>
        <div className="lesson-form__field">
          <label htmlFor="lesson-duration">Period duration (mins)</label>
          <input
            id="lesson-duration"
            name="duration"
            min="1"
            value={duration}
            type="number"
            onChange={e => setDuration(e.target.value)}
          />
        </div>
        <button className="lesson-form__button" type="submit">
          Generate Lesson
        </button>
      </form>
    </div>
  );
}