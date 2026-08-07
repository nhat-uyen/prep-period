import { useState } from "react";
import api from "../api/lessons";



type LessonFormProps = ({ 
    onLessonGenerated: (lesson: any) => void;
    setLoading: (loading: boolean) => void;
    setLoadError: (loadError: string) => void
});


export default function LessonForm({ onLessonGenerated, setLoading, setLoadError }: LessonFormProps) {
    const [subject, setSubject] = useState("");
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("");
    const [duration, setDuration] = useState("");

    
    //Later: add in try catch block to catch input that are empty
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        try {
            setLoading(true);
            setLoadError("");

            const lessonRequest = await api.post("/lessons", {subject, topic, grade, duration_minutes:duration});

            console.log(lessonRequest.data);
            onLessonGenerated(lessonRequest.data);
        } catch(err) {
            setLoadError("Failed to generate lesson. Please try again");
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