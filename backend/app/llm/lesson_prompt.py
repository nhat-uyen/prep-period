def build_prompt(subject, topic, grade, duration_minutes):
    prompt = f"""
    You are an experienced {grade} grade teacher.
    Create a {duration_minutes}-minute lesson.
    Subject: {subject}
    Topic: {topic}
    
    Respond ONLY with vaid JSON.
    Use EXACTLY this schema for your response:

    {{
        "topic": "...",
        "objectives": [],
        "prior_knowledge": [],
        "materials": [],
        "activities": [
            {{
                "name": "...",
                "duration_minutes": ...,
                "instructions": "..."
            }}
        ],
    }}
    """
    return prompt