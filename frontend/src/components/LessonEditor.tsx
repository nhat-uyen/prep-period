/**
 * LessonEditor module
 *
 * Provides the `LessonEditor` component for editing an existing lesson's
 * fields, objectives, prior knowledge, materials, and activities.
 */
import { useState } from "react";
import type { Lesson } from "../types/lesson";
import ActivityEditor from "./ActivityEditor";
import "./LessonEditor.css";


type LessonEditorProps = {
  lesson: Lesson;
  onSaved: (lesson: Lesson) => void;
  onCancel: () => void
}

export default function LessonEditor({ lesson, onCancel, onSaved }: LessonEditorProps) {

  console.log("Lesson being edited", lesson);

  const [title, setTitle] = useState(lesson.title);
  const [subject, setSubject] = useState(lesson.subject);
  const [topic, setTopic] = useState(lesson.topic);
  const [grade, setGrade] = useState(lesson.grade);
  const [duration, setDuration] = useState(lesson.duration_minutes);
  const [objectives, setObjecctives] = useState(lesson.objectives);
  const [priorknowledge, setPriorknowledge] = useState(lesson.prior_knowledge);
  const [materials, setMaterials] = useState(lesson.materials);
  const [activities, setActivities] = useState(lesson.activities);

  async function handleSave() {
    const updatedLesson: Lesson = {
      ...lesson,
      title,
      subject,
      topic,
      grade,
      duration_minutes: duration,
      objectives: objectives.map((objective) => objective.trim()).filter(Boolean),
      prior_knowledge: priorknowledge.map((prior) => prior.trim()).filter(Boolean),
      materials: materials.map((material) => material.trim()).filter(Boolean),
      activities: activities.map((activity) => ({
        ...activity,
        name: activity.name.trim(),
        instructions: activity.instructions.trim(),
      })).filter((activity) => activity.name || activity.instructions),
    };
    onSaved(updatedLesson)
  }

  return (
    <main className="lesson-editor">
      <header className="lesson-editor__header">
        <p className="lesson-editor__eyebrow">Lesson workspace</p>
        <h2>Edit Lesson</h2>
      </header>

      <section className="lesson-editor__section lesson-editor__section--details">
        <div className="lesson-editor__section-heading">
          <span className="lesson-editor__section-number">01</span>
          <div><h3>Lesson details</h3><p>Give this lesson a clear identity.</p></div>
        </div>
        <div className="lesson-editor__details-grid">
          <label className="lesson-editor__field"> Title
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)} />
          </label>

          <label className="lesson-editor__field"> Subject
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)} />
          </label>

          <label className="lesson-editor__field"> Topic
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)} />
          </label>

          <label className="lesson-editor__field"> Grade
            <input
              type="number"
              value={grade}
              onChange={e => setGrade(Number(e.target.value))} />
          </label>

          <label className="lesson-editor__field"> Duration (minutes)
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))} />
          </label>
        </div>
      </section>

      <section className="lesson-editor__section">
        <div className="lesson-editor__section-heading"><span className="lesson-editor__section-number">02</span><div><h3>Objectives</h3><p>What should students know or be able to do?</p></div></div>
        <div className="lesson-editor__list">

          {objectives.map((objecctive, index) => (
            <input
              className="lesson-editor__list-input"
              type="text"
              key={index}
              value={objecctive}
              onChange={e => {
                const updated = [...objectives];
                updated[index] = e.target.value;
                setObjecctives(updated)
              }} />
          ))}
        </div>
      </section>

      <section className="lesson-editor__section">
        <div className="lesson-editor__section-heading"><span className="lesson-editor__section-number">03</span><div><h3>Prior knowledge</h3><p>Connect the lesson to what students already know.</p></div></div>
        <div className="lesson-editor__list">

          {priorknowledge.map((prior, index) => (
            <input
              className="lesson-editor__list-input"
              type="text"
              key={index}
              value={prior}
              onChange={e => {
                const updated = [...priorknowledge];
                updated[index] = e.target.value;
                setPriorknowledge(updated)
              }} />
          ))}
        </div>
      </section>

      <section className="lesson-editor__section">
        <div className="lesson-editor__section-heading"><span className="lesson-editor__section-number">04</span><div><h3>Materials</h3><p>Keep the preparation list practical and specific.</p></div></div>
        <div className="lesson-editor__list">

          {materials.map((material, index) => (
            <input
              className="lesson-editor__list-input"
              type="text"
              key={index}
              value={material}
              onChange={e => {
                const updated = [...materials];
                updated[index] = e.target.value;
                setMaterials(updated)
              }} />
          ))}
        </div>
      </section>

      <section className="lesson-editor__section lesson-editor__section--activities">
        <div className="lesson-editor__section-heading"><span className="lesson-editor__section-number">05</span><div><h3>Activities</h3><p>Organize the flow of the class from start to finish.</p></div></div>
        <div className="lesson-editor__activities">

          {activities.map((activity, index) => (
            <ActivityEditor
              key={index}
              activity={activity}
              onChange={(updatedActivity) => {
                const updatedActivities = [...activities];
                updatedActivities[index] = updatedActivity;
                setActivities(updatedActivities)
              }}
            />
          ))}
        </div>
      </section>

      <footer className="lesson-editor__actions">
        <button className="lesson-editor__button lesson-editor__button--secondary" onClick={onCancel}>Cancel</button>
        <button className="lesson-editor__button lesson-editor__button--primary" onClick={handleSave}>Save Changes</button>
      </footer>

    </main>
  );
}