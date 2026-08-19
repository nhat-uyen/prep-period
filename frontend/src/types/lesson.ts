export type Activity = {
    name: string;
    duration_minutes: number;
    instructions: string
};

export type Lesson = {
    id: number;    // this means that id is optional
    subject: string;
    topic: string; 
    grade: string;
    duration_minutes: number; 
    title: string;
    objectives: string[];
    prior_knowledge: string[];
    materials: string[];
    activities: Activity[]
};

export type LessonRequest = {
    subject: string;
    topic: string;
    grade: number;
    duration_minutes: number
}
