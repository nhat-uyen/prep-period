// displaying lesson with reflection, if available, when selected in History
import type { Lesson, Reflection } from "../types/lesson";
import ActivityReflection from "./ActivityReflection";
import "./LessonCard.css";


type LessonCardReflectionProps = {
  lesson: Lesson;
  reflection: Reflection;
};

export default function LessonCardReflection({ lesson, reflection }: LessonCardReflectionProps) {
  return (
    <article className="lesson-card">
      <header className="lesson-card__header">
        <p className="lesson-card__eyebrow">Lesson plan</p>
        <h2>{lesson.title}</h2>
      </header>

      <div className="lesson-card__overview">
        <section className="lesson-card__section">
          <h3>Objectives</h3>
          <ul>
            {lesson.objectives.filter((objective) => objective.trim()).map((objective) => (<li key={objective}>{objective}</li>))}
          </ul>
          <h3>Notes</h3>
          <p>{reflection.objectives_notes || "No notes saved"}</p>
        </section>

        <section className="lesson-card__section">
          <h3>Prior Knowledge</h3>
          <ul>
            {lesson.prior_knowledge.filter((priorknowledge) => priorknowledge.trim()).map((priorknowledge) => (<li key={priorknowledge}>{priorknowledge}</li>))}
          </ul>
          <h3>Notes</h3>
          <p>{reflection.prior_knowledge_notes || "No notes saved"}</p>
        </section>

        <section className="lesson-card__section">
          <h3>Materials</h3>
          <ul>
            {lesson.materials.filter((material) => material.trim()).map((material) => (<li key={material}>{material}</li>))}
          </ul>
          <h3>Notes</h3>
          <p>{reflection.materials_notes || "No notes saved"}</p>
        </section>
      </div>

      <section className="lesson-card__activities">
        <h3>Activities</h3>
        <div className="lesson-card__activity-list">
          {lesson.activities.map((activity, activityIndex) => (
            activity.name.trim() || activity.instructions.trim() ? (
              <ActivityReflection
                key={activity.name}
                activity={activity}
                reflection={reflection.activities.find((item) => item.activity_index === activityIndex,)!}
              />
            ) : null
          ))}
        </div>
      </section>
    </article>
  );
}