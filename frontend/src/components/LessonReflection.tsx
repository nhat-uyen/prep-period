import { useState } from "react";
import type { Lesson } from "../types/lesson";

type LessonReflectionProps = {
  lesson: Lesson;
}

export default function LessonReflection({ lesson }: LessonReflectionProps) {
  const [objectiveReflect, setObjectiveReflect] = useState("");
  const [priorKnowledgeReflect, setPriorKnowledgeReflect] = useState("");
  const [materialsReflect, setMaterialReflect] = useState("");
  const [activityReflect, setActivityReflect] = useState<string[]>(
    () => lesson.activities.map(() => ""));


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
    </div>
  )
}