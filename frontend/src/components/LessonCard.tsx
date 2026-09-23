/**
 * LessonCard module
 *
 * Displays a lesson summary including objectives, prior knowledge,
 * materials, and activities. Provides an `onEdit` callback for editing.
 */
import type { Lesson } from "../types/lesson";
import "./LessonCard.css";


type LessonCardProps = {
  lesson: Lesson;
};

export default function LessonCard({ lesson }: LessonCardProps) {
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
        </section>

        <section className="lesson-card__section">
          <h3>Prior Knowledge</h3>
          <ul>
            {lesson.prior_knowledge.filter((priorknowledge) => priorknowledge.trim()).map((priorknowledge) => (<li key={priorknowledge}>{priorknowledge}</li>))}
          </ul>
        </section>

        <section className="lesson-card__section">
          <h3>Materials</h3>
          <ul>
            {lesson.materials.filter((material) => material.trim()).map((material) => (<li key={material}>{material}</li>))}
          </ul>
        </section>
      </div>

      <section className="lesson-card__activities">
        <h3>Activities</h3>
        <div className="lesson-card__activity-list">
          {lesson.activities
            .filter((activity) => activity.name.trim() || activity.instructions.trim())
            .map((activity) => (
              <article className="lesson-card__activity" key={activity.name}>
                <div className="lesson-card__activity-heading">
                  <h4>{activity.name}</h4>
                  <span>{activity.duration_minutes} min</span>
                </div>

                <p>{activity.instructions}</p>
              </article>
            ))}
        </div>
      </section>
    </article>
  );
}