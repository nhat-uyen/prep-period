// displaying lesson with reflection, if available, when selected in History
import type { Lesson, Reflection } from "../types/lesson";
import ActivityReflection from "./ActivityReflection";
import { Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";


type LessonCardReflectionProps = {
  lesson: Lesson;
  reflection: Reflection;
};

export default function LessonCardReflection({ lesson, reflection }: LessonCardReflectionProps) {
  return (
    <Card elevation={0}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>Lesson plan · Reflected</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>{lesson.title}</Typography>
          <Typography color="text.secondary">{lesson.subject} · Grade {lesson.grade} · {lesson.duration_minutes} minutes</Typography>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>
          {[
            { heading: "Objectives", items: lesson.objectives, notes: reflection.objectives_notes },
            { heading: "Prior Knowledge", items: lesson.prior_knowledge, notes: reflection.prior_knowledge_notes },
            { heading: "Materials", items: lesson.materials, notes: reflection.materials_notes },
          ].map(({ heading, items, notes }) => (
            <Stack key={heading} spacing={1} sx={{ flex: 1 }}>
              <Typography variant="h6">{heading}</Typography>
              <List dense disablePadding>
                {items.filter((item) => item.trim()).map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemText primary={<Typography color="text.secondary">{item}</Typography>} />
                  </ListItem>
                ))}
              </List>
              <Chip size="small" label={notes || "No notes saved"} sx={{ height: "auto", justifyContent: "flex-start", "& .MuiChip-label": { whiteSpace: "normal", display: "block", py: 0.75 } }} />
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ mb: 3 }} />
        <Typography variant="h6" sx={{ mb: 1.5 }}>Activities</Typography>
        <Stack spacing={1.5}>
          {lesson.activities.map((activity, activityIndex) => (
            activity.name.trim() || activity.instructions.trim() ? (
              <ActivityReflection
                key={activity.name}
                activity={activity}
                reflection={reflection.activities.find((item) => item.activity_index === activityIndex,)!}
              />
            ) : null
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}