import type { Lesson } from "../types/lesson";

type LessonHistoryProps = {
    lessons: Lesson[];
    onLessonSelected: (lessonId: number) => void
};

export default function LessonHistory({lessons, onLessonSelected}: LessonHistoryProps) {
    return (
        <div>
            <h2>Lesson Hitory</h2>

            {lessons.map((lesson) => (
                <button
                    key={lesson.id}
                    onClick={() => onLessonSelected(lesson.id!)} >
                        {lesson.subject}: {lesson.topic}
                </button>
            ))}
        </div>
    );
}