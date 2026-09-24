/**
 * LessonCard module
 *
 * Displays a lesson summary including objectives, prior knowledge,
 * materials, and activities. Provides an `onEdit` callback for editing.
 */
import type { Lesson } from "../types/lesson";
import { Card, CardContent, Chip, Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";


type LessonCardProps = {
  lesson: Lesson;
};

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card elevation={0} sx={{ mt: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>Lesson plan</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>{lesson.title}</Typography>
          <Typography color="text.secondary">{lesson.subject} · Grade {lesson.grade} · {lesson.duration_minutes} minutes</Typography>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            { heading: "Objectives", items: lesson.objectives },
            { heading: "Prior Knowledge", items: lesson.prior_knowledge },
            { heading: "Materials", items: lesson.materials },
          ].map(({ heading, items }) => (
            <Grid key={heading} size={{ xs: 12, md: 4 }}>
              <Typography variant="h6">{heading}</Typography>
              <List dense disablePadding>
                {(items as string[]).filter((item) => item.trim()).map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemText primary={<Typography color="text.secondary">{item}</Typography>} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 3 }} />
        <Typography variant="h6" sx={{ mb: 1.5 }}>Activities</Typography>
        <Stack spacing={1.5}>
          {lesson.activities
            .filter((activity) => activity.name.trim() || activity.instructions.trim())
            .map((activity) => (
              <Stack key={activity.name} spacing={1} sx={{ p: 2, borderRadius: 2, backgroundColor: "rgba(31, 92, 85, .06)" }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{activity.name}</Typography>
                  <Chip size="small" label={`${activity.duration_minutes} min`} color="primary" variant="outlined" />
                </Stack>
                <Typography color="text.secondary">{activity.instructions}</Typography>
              </Stack>
            ))}
        </Stack>
      </CardContent>
    </Card>
  );
}