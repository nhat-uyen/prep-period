import type { Lesson } from "../types/lesson";

type LessonHistoryProps = {
    lessons: any[];
    onLessonSelected: (lesson: Lesson) => void
};

export default function LessonHistory({lessons, onLessonSelected}: LessonHistoryProps) {
    return (
        <div>
            <h2>Lesson Hitory</h2>

            {lessons.map((lesson) => (
                <button
                    key={lesson.id}
                    onClick={() => onLessonSelected(lesson)}
                    >
                        {lesson.subject}: {lesson.topic}
                </button>
            ))}
        </div>
    );
}