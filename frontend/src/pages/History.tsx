import { useEffect, useState } from "react";
import { getLessons, deleteLesson, getLessonByID, clearLessons } from "../api/lessons";
import { type Reflection, type Lesson } from "../types/lesson";
import LessonHistory from "../components/LessonHistory";
import { Link } from "react-router";
import LessonCard from "../components/LessonCard";
import LessonCardReflection from "../components/LessonCardReflection";
import { Alert, Box, Button, Container, Divider, Paper, Stack, Typography } from "@mui/material";

// need to add Props when passing constant from one component to another
type HistoryProps = {
  history: Lesson[];
  setHistory: (lessons: Lesson[]) => void;
  removeLesson: (lessonId: number) => void;
  clearHistory: () => void;
}

function History({ history, setHistory, removeLesson, clearHistory }: HistoryProps) {
  const [error, setError] = useState('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);

  const lessonWithoutReflection = history.filter(lesson => lesson.reflection === null);
  const lessonWithReflection = history.filter(lesson => lesson.reflection !== null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await getLessons();
        setHistory(result);
      } catch (error) {
        console.error("Failed to load history", error);
        setError("Failed to load history.");
      }
    }
    loadHistory();
  }, [setHistory]);

  async function handleLessonSelected(lessonId: number) {
    try {
      setError("")

      if (lesson?.id !== lessonId) {
        const selectedLesson = await getLessonByID(lessonId);
        setLesson(selectedLesson);
        if (selectedLesson.reflection !== null) {
          setReflection(selectedLesson.reflection!);
        };
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load lesson")
      setReflection(null)
    }
  }

  async function handleLessonDeleted(lessonId: number) {
    try {
      setError("");
      await deleteLesson(lessonId);
      removeLesson(lessonId)
      if (lesson?.id === lessonId) {
        setLesson(null)
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete lesson.")
    }
  }

  async function handleClearHistory() {
    try {
      setError("");
      await clearLessons();
      clearHistory();
      setLesson(null);
    } catch (error) {
      console.error("Failed to clear history:", error);
      setError("Failed to clear lesson history.");
    }
  }

  return (
    <Box component="main" sx={{ py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".14em" }}>Your workspace</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4rem" } }}>History</Typography>
          <Typography color="text.secondary">Return to a lesson, review what happened, and keep improving your practice.</Typography>
        </Stack>
        {history.length === 0
          ? <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 1 }}>No past lessons yet</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Generate your first lesson to start building a useful teaching archive.</Typography>
            <Button component={Link} to="/generate" variant="contained">Generate a lesson</Button>
          </Paper>
          : <>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Paper elevation={0} sx={{ p: 2.5, flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>No reflection</Typography>
                <LessonHistory
                  lessons={lessonWithoutReflection}
                  onLessonSelected={handleLessonSelected}
                  onLessonDeleted={handleLessonDeleted}
                />
              </Paper>
              <Paper elevation={0} sx={{ p: 2.5, flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Reflected</Typography>
                <LessonHistory
                  lessons={lessonWithReflection}
                  onLessonSelected={handleLessonSelected}
                  onLessonDeleted={handleLessonDeleted}
                />
              </Paper>
            </Stack>
            <Button color="error" variant="outlined" onClick={handleClearHistory} sx={{ mt: 3 }}>
              Delete All Lessons
            </Button>
          </>}
        {lesson !== null
          ? <Box sx={{ mt: 4 }}>
            {reflection !== null
              ? <LessonCardReflection lesson={lesson} reflection={reflection} />
              : <LessonCard lesson={lesson} />}
          </Box>
          : null}
        <Divider sx={{ mt: 5 }} />
      </Container>
    </Box>
  )
}

export default History;