export type Problem = {
  question: string;
  instructions: string;
  answer: string;
  explanation: string;
  skills: string[];
  difficulty?: string | null;
  problem_type?: string | null;
};

export type Activity = {
  name: string;
  duration_minutes: number;

  teacher_actions: string[];
  teacher_prompts: string[];
  look_fors: string[];
  teacher_notes_prompts: string[];

  student_instructions: string;
  problems: Problem[];
};

export type Lesson = {
  id: number;
  subject: string;
  topic: string;
  grade: number;
  duration_minutes: number;
  title: string;
  objectives: string[];
  prior_knowledge: string[];
  materials: string[];
  activities: Activity[];

  reflection?: Reflection | null;
};

export type LessonRequest = {
  subject: string;
  topic: string;
  grade: number;
  duration_minutes: number
}

export type ActivityReflection = {
  activity_index: number;
  rating: number | null;
  notes: string;
};

export type Reflection = {
  lesson_id: number;

  objectives_rating: number | null;
  objectives_notes: string;

  prior_knowledge_rating: number | null;
  prior_knowledge_notes: string;

  materials_rating: number | null;
  materials_notes: string;

  activities: ActivityReflection[];
  keep_notes: string;
  change_notes: string;
}