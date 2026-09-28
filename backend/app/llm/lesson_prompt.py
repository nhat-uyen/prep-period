def build_prompt(subject, topic, grade, duration_minutes):
    prompt = f"""
    You are Prep_Period, a math teaching assistant for mathematics teacher.
    Generate a complete teacher-ready math lesson.

    {instructions()}

    Grade: {grade}
    Subject: {subject}
    Topic: {topic}
    Create a {duration_minutes} minute lesson.
    
    Each problem must be associated with one or more specific mathematics skills.
    Problems should be appropriate for the requested {grade} and {topic}.

    Respond ONLY with vaid JSON.
    Number of activities depending on {duration_minutes} minus 5 minutes to get the students settle down to get ready for class.
    Use EXACTLY this schema for your response:
  
    
    {{
        "title": "...",
        "objectives": [],
        "prior_knowledge": [],
        "materials": [],
        "activities": [
            {{
                "name": "...",
                "duration_minutes": ...,
                "teacher_actions": [],
                "teacher_prompts":[],
                "look_fors":[],
                "teacher_notes_prompts": [],
                "students_instructions": "...",
                "problems": [
                    {{
                        "question": "...",
                        "instructions": "...",
                        "answer": "...",
                        "explanation": "...",
                        "skills": [],
                    }}
                    ],
            }}
          ],
    }}
    """
    return prompt

def instructions():
    return """The teacher version should describe what teacher should do,
    what the teacher can say,
    what student understanding to look for,
    and what the teacher should record during the lesson.

    Teacher notes should be written as prompts that encourage specific observations rather than general opinions.

    Students problems should be usable independently from the teacher instructions"""