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
                        {lesson.subject}: {lesson.topic}
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