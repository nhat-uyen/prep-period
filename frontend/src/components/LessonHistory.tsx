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


type LessonHistoryProps = {
    lessons: Lesson[];
    onLessonSelected: (lessonId: number) => void;
    onLessonDeleted: (lessonId: number) => void
};

export default function LessonHistory({lessons, onLessonSelected, onLessonDeleted}: LessonHistoryProps) {
    return (
        <div>
            <h2>Lesson Hitory</h2>

            {lessons.map((lesson) => (
                <div key={lesson.id}>
                    <button
                    onClick={() => onLessonSelected(lesson.id)} 
                    >
                        {lesson.subject}: {lesson.title}
                    </button>

                    <button 
                    onClick={() => onLessonDeleted(lesson.id)}
                    >
                        Delete
                    </button>
                </div>
            )
        )
    }
    </div>
    )
}