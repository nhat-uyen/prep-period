type Activity = { 
    name: string; duration_minutes: number; instructions: string
};

type Lesson = {
    title: string; objectives: string[]; materials: string[]; activities: Activity[]
};

type LessonCardProps = {
    lesson: Lesson
};

export default function LessonCard({lesson}: LessonCardProps) {
    return (
        <div>
            <h2>{lesson.title}</h2>

            <h3>Objectives</h3>
            <ul>
                {lesson.objectives.map((objective) => (<li key={objective}>{objective}</li>))}
            </ul>

            <h3>Materials</h3>
            <ul>
                {lesson.materials.map((material) => (<li key={material}>{material}</li>))}
            </ul>

            <h3>Activies</h3>
            {lesson.activities.map((activity) => (
                <div key={activity.name}>
                    <h4>
                        {activity.name} ({activity.duration_minutes} min) 
                    </h4>

                    <p>{activity.instructions}</p>
                </div>
            ))}
        </div>
    )
}