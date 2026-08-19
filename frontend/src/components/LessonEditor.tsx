/**
 * LessonEditor module
 *
 * Provides the `LessonEditor` component for editing an existing lesson's
 * fields, objectives, prior knowledge, materials, and activities.
 */
import { useState } from "react";
import type { Lesson } from "../types/lesson";
import ActivityEditor from "./ActivityEditor";


type LessonEditorProps = {
    lesson: Lesson;
    onSaved: (lesson: Lesson) => void;
    onCancel: () => void
}

export default function LessonEditor({lesson, onCancel, onSaved}: LessonEditorProps) {
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
        const updatedLesson: Lesson= {
            ...lesson, 
            title, subject, topic, grade, duration_minutes: duration, objectives, prior_knowledge: priorknowledge, materials, activities
        };
        onSaved(updatedLesson)
    }

    return (
        <div>
            <h2>Edit Lesson</h2>

            <label> Title 
                <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}/>
            </label>
            
            <label> Subject 
                <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}/>
            </label>

            <label> Topic 
                <input 
                type="text" 
                value={topic}
                onChange={e => setTopic(e.target.value)}/>
            </label>

            <label> Grade
                <input 
                type="number" 
                value={grade}
                onChange={e => setGrade(e.target.value)}/>
            </label>

            <label> Duration
                <input 
                type="number" 
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}/>
            </label>

            <h3>Objectives</h3>

            {objectives.map((objecctive,index) => (
                <input 
                type="text"
                key={index} 
                value={objecctive}
                onChange={e => {
                    const updated = [...objectives];
                    updated[index] = e.target.value;
                    setObjecctives(updated)
                }}/>
            ))}

            <h3>Prior Knowledge</h3>

            {priorknowledge.map((prior,index) => (
                <input 
                type="text"
                key={index} 
                value={prior}
                onChange={e => {
                    const updated = [...priorknowledge];
                    updated[index] = e.target.value;
                    setPriorknowledge(updated)
                }}/>
            ))}

            <h3>Materials</h3>

            {materials.map((material, index) => (
                <input 
                type="text"
                key={index} 
                value={material}
                onChange={e => {
                    const updated = [...materials];
                    updated[index] = e.target.value;
                    setMaterials(updated)
                }}/>
            ))}

            <h3>Activities</h3>

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
        
            <button onClick={onCancel}>
                Cancel
            </button>

            <button onClick={handleSave}>
                Save Changes
            </button>

        </div>
    );
}