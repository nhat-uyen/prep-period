/**
 * LessonHistory module
 *
 * Renders a list of lessons with buttons to select or delete each lesson.
 * Props:
 * - `lessons`: array of `Lesson` objects to display.
 * - `onLessonSelected(lessonId)`: called when a lesson is selected.
 * - `onLessonDeleted(lessonId)`: called when a lesson is deleted.
 */
import type { Lesson } from "../types/lesson";
import { DeleteOutlined, Visibility } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip, Typography } from "@mui/material";


type LessonHistoryProps = {
  lessons: Lesson[];
  onLessonSelected: (lessonId: number) => void;
  onLessonDeleted: (lessonId: number) => void;
};

export default function LessonHistory({ lessons, onLessonSelected, onLessonDeleted }: LessonHistoryProps) {
  return (
    <List disablePadding>
      {lessons.length === 0 && <Typography color="text.secondary" sx={{ py: 2 }}>Nothing here yet.</Typography>}
      {lessons.map((lesson) => (
        <ListItem key={lesson.id} disablePadding secondaryAction={
          <Tooltip title="Delete lesson">
            <IconButton edge="end" aria-label={`Delete ${lesson.title}`} onClick={() => onLessonDeleted(lesson.id)} color="error">
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        }>
          <ListItemButton onClick={() => onLessonSelected(lesson.id)} sx={{ borderRadius: 1, pr: 7 }}>
            <Visibility color="primary" sx={{ mr: 1.5 }} />
            <ListItemText primary={lesson.title} secondary={`${lesson.subject} · Grade ${lesson.grade}`} />
          </ListItemButton>
        </ListItem>
      )
      )
      }
    </List>
  )
}