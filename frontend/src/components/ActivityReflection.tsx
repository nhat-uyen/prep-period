import type { Activity, ActivityReflection as ActivityReflectionData } from "../types/lesson";

type ActivityReflectionProps = {
  activity: Activity;
  reflection: ActivityReflectionData;
};

export default function ActivityReflection({ activity, reflection }: ActivityReflectionProps) {
  return (
    <article className="lesson-card__activity">
      <div className="lesson-card__activity-heading">
        <h4>{activity.name}</h4>
        <span>{activity.duration_minutes} min</span>
      </div>

      <p>{activity.instructions}</p>
      <div className="lesson-card__activity-heading">
        <h4>Notes</h4>
      </div>
      <p>{reflection.notes || "No notes recorded."}</p>
    </article>
  );
}
