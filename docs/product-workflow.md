# Prep-Period Product Workflow

This diagram is the source workflow for the Prep-Period project.

```text
PREP-PERIOD
                         |
                 Generate Math Lesson
                         |
          +--------------+--------------+
          |                             |
   Teacher Version               Student Version
          |                             |
   Actions / Prompts              Problems
   Look-Fors                      Instructions
   Notes                          Workspace
          |                             |
          +--------------+--------------+
                         |
                      Problems
                         |
                    Save Problem
                         |
                         v
                  +--------------+
                  | Problem Bank |
                  +--------------+
                         |
                 +-------+-------+
                 |               |
               Topic           Skills
                 |               |
                 +-------+-------+
                         |
                  Search / Filter
                         |
                         v
                 Future Lessons
                         |
                         v
                    Reflection
```

## Generated lesson structure

Each lesson produced by Prep-Period should follow this structure:

```text
Lesson
|
|- Teacher Version
|  |- Teacher Actions
|  |- Teacher Prompts
|  |- Look-Fors
|  `- Teacher Notes Prompts
|
|- Student Version
|  |- Instructions
|  `- Problems
|     |- Question
|     |- Instructions
|     |- Answer
|     |- Explanation
|     `- Skills
|
`- Assessment
```

## Core product concepts

- Generate a math lesson from teacher-provided lesson parameters.
- Produce separate teacher and student versions.
- Capture problems, instructions, workspace, actions, prompts, look-fors, and notes.
- Save reusable problems to a problem bank.
- Organize and retrieve problems by topic and skill.
- Search and filter the problem bank to support future lessons.
- Use reflection to improve future lesson planning.
