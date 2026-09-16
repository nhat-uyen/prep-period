/**
 * LessonHistory module
 *
 * Renders a list of lessons with buttons to select or delete each lesson.
 * Props:
 * - `lessons`: array of `Lesson` objects to display.
 * - `onLessonSelected(lessonId)`: called when a lesson is selected.
 * - `onLessonDeleted(lessonId)`: called when a lesson is deleted.
 */
import type { Lesson } from "../types/lesson";
import './LessonHistory.css';


type LessonHistoryProps = {
  lessons: Lesson[];
  onLessonSelected: (lessonId: number) => void;
  onLessonDeleted: (lessonId: number) => void;
};

export default function LessonHistory({ lessons, onLessonSelected, onLessonDeleted }: LessonHistoryProps) {
  return (
    <ul className="lesson-history">
      {lessons.map((lesson) => (
        <li key={lesson.id} className="lesson-history__item">
          <button
            className="lesson-history__select"
            onClick={() => onLessonSelected(lesson.id)}
          >
            {lesson.subject}: {lesson.title}
          </button>

          <button
            className="lesson-history__delete"
            onClick={() => onLessonDeleted(lesson.id)}
          >
            X
          </button>
        </li>
      )
      )
      }
    </ul>
  )
}