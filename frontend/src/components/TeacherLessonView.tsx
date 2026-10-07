/**
 * TeacherLessonView module
 *
 * Displays the teacher-facing lesson plan with objectives, materials,
 * activity guidance, and answer keys.
 */
import type { LessonDraft } from "../types/lesson";
import {
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import MathText from "./MathText";

type TeacherLessonViewProps = {
  lesson: LessonDraft;
};

export default function TeacherLessonView({ lesson }: TeacherLessonViewProps) {
  return (
    <Card elevation={0} sx={{ mt: 3, border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".12em" }}>
            Teacher version
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>
            {lesson.title}
          </Typography>
          <Typography color="text.secondary">
            Grade {lesson.grade} · {lesson.duration_minutes} minutes
          </Typography>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            { heading: "Objectives", items: lesson.objectives },
            { heading: "Prior Knowledge", items: lesson.prior_knowledge },
            { heading: "Materials", items: lesson.materials },
          ].map(({ heading, items }) => (
            <Grid key={heading} size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>{heading}</Typography>
              <List dense disablePadding>
                {items.filter((item) => item.trim()).map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemText primary={<Typography color="text.secondary">{item}</Typography>} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Activities</Typography>
        <Stack spacing={2}>
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
                  <Chip size="small" label={`${activity.duration_minutes} min`} color="primary" variant="outlined" />
                </Stack>

                <Typography color="text.secondary"><MathText>{activity.student_instructions}</MathText></Typography>

                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Teacher actions</Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {activity.teacher_actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">Questions to ask</Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {activity.teacher_prompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                </Stack>

                <Stack spacing={1.5}>
                  {activity.problems.map((problem, index) => (
                    <Stack
                      key={`${activity.name}-${index}`}
                      spacing={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">Problem {index + 1}</Typography>
                      <Typography><strong>Question:</strong>< MathText>{problem.question}</MathText></Typography>
                      <Typography><strong>Instructions:</strong> <MathText>{problem.instructions}</MathText></Typography>
                      <Typography><strong>Answer:</strong> <MathText>{` ${problem.answer}`}</MathText></Typography>
                      <Typography><strong>Explanation:</strong> <MathText>{` ${problem.explanation}`}</MathText></Typography>
                      <Typography><strong>Skills:</strong> {problem.skills.join(", ") || "—"}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
