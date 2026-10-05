# For later to improve teacher's control over the lesson: teachers can control the number of problems, skills, objectives, and prior knowledge items.

from app.llm.prompts.latex_rules import LATEX_RULES
from app.llm.prompts.worksheet_guidance import WORKSHEET_STYLE_GUIDANCE

def build_prompt(subject, topic, grade, duration_minutes):
    prompt = f"""
    You are Prep_Period, a math teaching assistant.

    Create a complete math lesson for:
    - Subject: {subject}
    - Grade: {grade}
    - Topic: {topic}
    - Duration: {duration_minutes} minutes
    
    Teacher-controlled count placeholder:
    - If a teacher-specified problem count is provided later, use it.

    Your response must be valid JSON only.

    Use the following JSON structure exactly:

    {{
      "title": "Lesson title",
      "objectives": [
        "Students will identify the key math terms",
        "Students will recognize the type of problems they are solving",
        "Students will solve problems using the appropriate strategies"
      ],
      "prior_knowledge": [
        "Relevant skill or concept 1",
        "Relevant skill or concept 2"
      ],
      "materials": ["material 1", "material 2"],
      "activities": [
        {{
          "name": "Activity name",
          "duration_minutes": ...,
          "teacher_actions": ["what teacher do during lesson 1", "what teacher do during lesson 2"],
          "teacher_prompts": ["what teacher say during lesson 1", "what teacher say during lesson 2"],
          "look_fors": ["what teacher look for 1", "what teacher look for 2"],
          "teacher_notes_prompts": ["what teacher takes note of 1", "what teacher takes note of 2"],
          "student_instructions": "General instructions for students in this activity",
          "problems": [
            {{
              "question": "Math problem question",
              "instructions": "How students should recognize and solve this problem type",
              "answer": "Correct final answer",
              "explanation": "Clear explanation of the answer",
              "skills": ["skill 1", "skill 2"],
              "difficulty": "...",
              "problem_type": "word problem"
            }}
          ]
        }}
      ]
    }}

    Important rules:
    {LATEX_RULES}
    {WORKSHEET_STYLE_GUIDANCE}
    1. Return valid JSON only.
    2. Use realistic math content appropriate for grade {grade}.
    3. If teacher-specified counts are provided later, respect them exactly.
    4. If no teacher count is provided, use a reasonable default range:
       - 2 to 4 problems per activity
       - 2 to 3 skills per problem
       - 2 to 3 objectives
       - 2 to 3 prior knowledge entries
    5. Every problem must contain all of the following fields:
       - question
       - instructions
       - answer
       - explanation
       - skills
    6. The number of problems per activity should be align with the duration, take in consideration of the time for class management, such as transitions and wrap-up time.
    7. The instructions field should help students recognize the problem type and explain how to approach it.
    8. Make explanations clear and student-friendly.
    9. Keep the lesson coherent, age-appropriate, and class-ready.
    10. For the whole lesson, ensure at least one teacher action, teacher prompt, look-for, and teacher note prompt.
    11. If I made an error, correct it without putting oops.
    12. Do not include markdown fences or extra commentary outside the JSON.
    """
    return prompt
