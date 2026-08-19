/**
 * LessonForm module
 *
 * Renders a form for collecting lesson generation parameters and submits
 * them to the lessons API. Calls `onLessonGenerated` with the created lesson
 * when the request succeeds.
 */
import { useState } from "react";
import api from "../api/lessons";
import type { Lesson } from "../types/lesson";


type LessonFormProps = ({ 
    onLessonGenerated: (lesson: Lesson) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void
});

export default function LessonForm({ onLessonGenerated, setLoading, setError }: LessonFormProps) {
    const [subject, setSubject] = useState("");
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("");
    const [duration, setDuration] = useState("");

    
    //Later: add in try catch block to catch input that are empty
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response= await api.post("/lessons", {subject, topic, grade, duration_minutes:duration});

            onLessonGenerated(response.data);
            
        } catch(error) {
            setError("Failed to generate lesson. Please try again");
        } finally {
            setLoading(false);
        }
    }

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
            />
            <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
            />
            <input
                value={grade}
                type="number"
                onChange={e => setGrade(e.target.value)}
            />
            <input
                value={duration}
                type="number"
                onChange={e => setDuration(e.target.value)}
            />

            <button onSubmit={handleSubmit}>
                Generate Lesson
            </button>
        </form>
    </div>
    );
}