import LessonForm from '../components/LessonForm';
import LessonCard from '../components/LessonCard';
import LessonEditor from '../components/LessonEditor';
import { useState } from 'react';
import type { Lesson } from '../types/lesson';
import { updateLesson } from '../api/lessons';
import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';

type GenerateProps = {
  addLesson: (lesson: Lesson) => void;
  editLesson: (lesson: Lesson) => void;
}

export default function GenerateLesson({ addLesson, editLesson }: GenerateProps) {

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  function handleLessonGenerated(newLesson: Lesson) {
    setLesson(newLesson);
    addLesson(newLesson);
  }

  async function handleLessonUpdated(updatedLesson: Lesson) {
    try {
      setError("");
      const savedLesson = await updateLesson(updatedLesson.id, updatedLesson);
      editLesson(savedLesson)
      setLesson(savedLesson);

      setEditing(false);
    } catch (error) {
      console.error("Failed to update lesson:", error);
      setError("Failed to save lesson.")
    }
  }

  return (
    <Box component="main" sx={{ py: { xs: 4, md: 7 } }}>
      <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".14em" }}>Lesson studio</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4rem" } }}>Generate Lesson</Typography>
          <Typography color="text.secondary">Start with the shape of your class, then refine the plan once it is ready.</Typography>
        </Stack>
        <LessonForm
          onLessonGenerated={handleLessonGenerated}
          setError={setError}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {lesson && editing && (
          <LessonEditor
            lesson={lesson}
            onSaved={handleLessonUpdated}
            onCancel={() => setEditing(false)}
          />
        )}

        {lesson && !editing && (
          <>
            <LessonCard lesson={lesson} />
            <Button variant="contained" onClick={() => setEditing(true)} sx={{ mt: 2 }}>Edit Lesson</Button>
          </>
        )}
      </Container>
    </Box>
  )
}