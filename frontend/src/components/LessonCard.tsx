/**
 * LessonCard module
 *
 * Displays a lesson summary including objectives, prior knowledge,
 * materials, and activities. Provides an `onEdit` callback for editing.
 */
import type { Lesson } from "../types/lesson";


type LessonCardProps = { 
    lesson: Lesson;
    onEdit: () => void
};

export default function LessonCard({lesson, onEdit}: LessonCardProps) {
    return (
        <div>
            <h2>{lesson.title}</h2>

            <h3>Objectives</h3>
            <ul>
                {lesson.objectives.map((objective) => (<li key={objective}>{objective}</li>))}
            </ul>

            <h3>Prior Knowledge</h3>
            <ul>
                {lesson.prior_knowledge.map((priorknowledge) => (<li key={priorknowledge}>{priorknowledge}</li>))}
            </ul>

            <h3>Materials</h3>
            <ul>
                {lesson.materials.map((material) => (<li key={material}>{material}</li>))}
            </ul>

            <h3>Activities</h3>
            {lesson.activities.map((activity) => (
                <div key={activity.name}>
                    <h4>
                        {activity.name} ({activity.duration_minutes} min) 
                    </h4>

                    <p>{activity.instructions}</p>
                </div>
            ))}

            <button onClick={onEdit}>
                Edit Lesson
            </button>
        </div>
    )
}