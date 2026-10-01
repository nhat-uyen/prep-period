import type { Lesson } from "../types/lesson";
import {
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MathText from "./MathText";

type StudentLessonViewProps = {
  lesson: Lesson;
};

export default function StudentLessonView({ lesson }: StudentLessonViewProps) {
  return (
    <Card elevation={0} sx={{ mt: 3, border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".12em" }}>
            Student version
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
            {lesson.title}
          </Typography>
          <Typography color="text.secondary">
            {lesson.subject} · Grade {lesson.grade} · {lesson.duration_minutes} minutes
          </Typography>
        </Stack>

        <Stack spacing={2.5}>
          {lesson.activities
            .filter((activity) => activity.name.trim() || activity.student_instructions.trim())
            .map((activity) => (
              <Stack
                key={activity.name}
                spacing={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(31, 92, 85, .06)",
                  border: "1px solid",
                  borderColor: "rgba(31, 92, 85, .12)",
                }}
              >
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {activity.name}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${activity.duration_minutes} min`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Typography color="text.secondary"><MathText>{activity.student_instructions}</MathText></Typography>

                {activity.problems.map((problem, index) => (
                  <Stack
                    key={`${activity.name}-${index}`}
                    spacing={1.5}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Instructions
                    </Typography>
                    <Typography><MathText>{problem.instructions}</MathText></Typography>

                    <Typography variant="subtitle2" color="text.secondary">
                      Problem {index + 1}
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}><MathText>{problem.question}</MathText></Typography>

                    <TextField
                      label="Your work"
                      multiline
                      minRows={4}
                      placeholder="Show your work here..."
                      fullWidth
                    />
                  </Stack>
                ))}
              </Stack>
            ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
