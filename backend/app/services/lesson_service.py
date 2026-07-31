from app.models.lesson import RequestLesson, ResponseLesson

def generate_lesson(request: ResponseLesson) -> ResponseLesson:
    subject = request.subject
    topic = request.topic
    objectives = ["By the end of the lesson,",
                  f"Students will understand the {request.topic}",
                  "Apply the concepts"]
    activities = ["Warm-up activity",
                  "Teacher modeling and explanation",
                  "Guided practice",
                  "Independent practice",
                  "Assessment and feedback"
              ]

    lesson_plan = ResponseLesson(subject=subject,
                                topic=topic,
                                objectives=objectives,
                                activities=activities)
    return lesson_plan