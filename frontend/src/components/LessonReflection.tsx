import { useEffect, useState } from "react";
import type { Lesson, Reflection } from "../types/lesson";

type LessonReflectionProps = {
  lesson: Lesson;
  onReflectionChange: (reflection: Reflection) => void;
}

export default function LessonReflection({ lesson, onReflectionChange }: LessonReflectionProps) {
  const [objectiveReflect, setObjectiveReflect] = useState("");
  const [priorKnowledgeReflect, setPriorKnowledgeReflect] = useState("");
  const [materialsReflect, setMaterialReflect] = useState("");
  const [activityReflect, setActivityReflect] = useState<string[]>(
    () => lesson.activities.map(() => ""));

  const [keepReflect, setKeepReflect] = useState("");
  const [changeReflect, setChangeReflect] = useState("");



  useEffect(() => {
    const reflection: Reflection = {
      lesson_id: lesson.id,

      objectives_rating: null,
      objectives_notes: objectiveReflect,

      prior_knowledge_rating: null,
      prior_knowledge_notes: priorKnowledgeReflect,

      materials_rating: null,
      materials_notes: materialsReflect,

      activities: activityReflect.map((notes, index) => ({
        activity_index: index,
        rating: null,
        notes: notes,
      })),

      keep_notes: keepReflect,
      change_notes: changeReflect,
    };
    onReflectionChange(reflection);
  }, [lesson.id, onReflectionChange, objectiveReflect, priorKnowledgeReflect, materialsReflect, activityReflect, keepReflect, changeReflect]);

  function handleActivityReflectChange(index: number, value: string) {
    const updatedReflects = [...activityReflect];
    updatedReflects[index] = value;
    setActivityReflect(updatedReflects);
  }

  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>Subject: {lesson.subject} - Grade: {lesson.grade} - Duration: {lesson.duration_minutes} mins</p>

      <hr />
      <h2>01. Objectives</h2>
      {lesson.objectives.map(objective => (
        <p key={objective}> {objective} </p>
      ))}

      <label>What did you notice about student understanding?</label>
      <br />

      <textarea
        value={objectiveReflect}
        onChange={(e) => setObjectiveReflect(e.target.value)} />
      <hr />

      <h2>02. Prior Knowledge</h2>
      {lesson.prior_knowledge.map(knowledge => (
        <p key={knowledge}> {knowledge}</p>
      ))}

      <label>
        What did you notice about students' prior knowledge?
      </label>

      <br />

      <textarea
        value={priorKnowledgeReflect}
        onChange={(e) => setPriorKnowledgeReflect(e.target.value)}
      />

      <hr />

      <h2>03. Materials</h2>
      {lesson.materials.map(material => (
        <p key={material}> {material}</p>
      ))}

      <label> What worked well? What could be improved?</label>
      <br />
      <textarea
        value={materialsReflect}
        onChange={e => setMaterialReflect(e.target.value)} />

      <hr />

      <h2>04. Activities</h2>

      <p>Reflect on each activity separately.</p>

      {lesson.activities.map((activity, index) => (
        <div key={activity.name}>
          <h3>{activity.name}</h3>

          <p>{activity.duration_minutes} minutes</p>

          <p>{activity.instructions}</p>

          <label>
            What happened during this activity?
          </label>

          <br />

          <textarea
            value={activityReflect[index]}
            onChange={(e) => handleActivityReflectChange(index, e.target.value)}
          />

          <hr />
        </div>

      ))}

      <hr />
      <h2>05. Overall Reflection</h2>
      <label>What worked well? (Keep it!)</label>
      <br />

      <textarea value={keepReflect} onChange={e => setKeepReflect(e.target.value)} />
      <br />
      <br />

      <label> What didn't work so well? (Modify it!)</label>
      <br />
      <textarea value={changeReflect} onChange={e => setChangeReflect(e.target.value)} />
    </div>
  )
}