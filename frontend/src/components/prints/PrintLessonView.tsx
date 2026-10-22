import { Box, Typography } from "@mui/material";
import type { Lesson } from "../../types/lesson";
import { printSx } from "./printStyles";
import MathText from "../MathText";
import ResponseAreaRenderer from "./ResponseAreaRenderer";

interface Props {
  lesson: Lesson;
  showAnswers?: boolean;
}

export default function PrintLessonView({ lesson, showAnswers = false }: Props) {
  return (
    <Box sx={printSx.page}>
      <Box sx={printSx.header}>
        <span>Name:_____________________________</span>
        <span>Date:________________</span>
      </Box>

      <Typography variant="h5" component="h1" gutterBottom>
        {lesson.title}
      </Typography>

      {lesson.activities.map((activity, ai) => (
        <Box key={ai} sx={printSx.activity}>
          <Typography variant="h6" component={"h2"} sx={printSx.activityTitle}>
            {activity.name}
          </Typography>

          {activity.student_instructions && (
            <MathText>{activity.student_instructions}</MathText>
          )}

          {activity.problems.map((problem, pi) => (
            <Box key={pi} sx={printSx.problem}>
              <Box sx={printSx.problemRow}>
                <strong>{pi + 1}.</strong>
                <Box>
                  <MathText>{problem.question}</MathText>
                  {problem.instructions && <MathText>{problem.instructions}</MathText>}
                </Box>
              </Box>

              <ResponseAreaRenderer area={problem.response_area} />

              {showAnswers && (
                <Box sx={printSx.answer}>
                  Answer: <MathText>{problem.answer}</MathText>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}