import LessonForm from '../components/LessonForm';
import LessonEditor from '../components/LessonEditor';
import { useRef, useState } from 'react';
import type { Lesson, LessonDraft } from '../types/lesson';
import { saveLesson, updateLesson } from '../api/lessons';
import { Alert, Box, Button, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import TeacherLessonView from '../components/TeacherLessonView';
import StudentLessonView from '../components/StudentLessonView';
import { Link } from 'react-router';
import { ArrowBack } from '@mui/icons-material';

type GenerateProps = {
  addLesson: (lesson: Lesson) => void;
  editLesson: (lesson: Lesson) => void;
}

export default function GenerateLesson({ addLesson, editLesson }: GenerateProps) {
  const [displayLesson, setDisplayLesson] = useState<LessonDraft | null>(null);
  const [savedLesson, setSavedLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState<'teacher' | 'student'>('teacher');

  const lessonFormRef = useRef<HTMLDivElement>(null);

  function handleLessonGenerated(newLesson: LessonDraft) {
    setError("");
    setDisplayLesson(newLesson);
    setSavedLesson(null);
    setEditing(false);
  }

  async function handleLessonSaved() {
    if (!displayLesson || isSaving) return;

    try {
      setError("");
      setIsSaving(true);
      const saved = await saveLesson(displayLesson);
      setSavedLesson(saved);
      setDisplayLesson(saved);
      addLesson(saved);
    } catch (saveError) {
      console.error("Failed to save lesson:", saveError);
      setError("Could not save the lesson. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleGenerateAgain() {
    setDisplayLesson(null);
    setSavedLesson(null);
    setEditing(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  async function handleLessonUpdated(updatedLesson: Lesson) {
    try {
      setError("");
      const savedUpdatedLesson = await updateLesson(updatedLesson.id, updatedLesson);
      editLesson(savedUpdatedLesson);
      setSavedLesson(savedUpdatedLesson);
      setDisplayLesson(savedUpdatedLesson);

      setEditing(false);
    } catch (error) {
      console.error("Failed to update lesson:", error);
      setError("Failed to save lesson.")
    }
  }

  return (
    <Box component="main" sx={{ py: { xs: 4, md: 7 } }}>
      <Container maxWidth="xl">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back to Home
          </Button>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".14em" }}>Lesson studio</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4rem" } }}>Generate Lesson</Typography>
          <Typography color="text.secondary">Start with the shape of your class, then refine the plan once it is ready.</Typography>
        </Stack>
        <Box ref={lessonFormRef} sx={{ display: displayLesson ? "none" : "block" }}>
          <LessonForm onLessonGenerated={handleLessonGenerated} setError={setError} />
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {savedLesson && editing && (
          <LessonEditor
            lesson={savedLesson}
            onSaved={handleLessonUpdated}
            onCancel={() => setEditing(false)}
          />
        )}

        {displayLesson && !editing && (
          <>
            <Tabs
              value={tab}
              onChange={(_, nextTab) => setTab(nextTab)}
              sx={{
                mt: 3,
                mb: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                '& .MuiTabs-indicator': { backgroundColor: "primary.main" },
              }}
            >
              <Tab label="Teacher View" value="teacher" />
              <Tab label="Student View" value="student" />
            </Tabs>
            {tab === "teacher" && <TeacherLessonView lesson={displayLesson} />}
            {tab === "student" && <StudentLessonView lesson={displayLesson} />}
            {savedLesson ? (
              <Stack spacing={2} sx={{ mt: 2, alignItems: "flex-start" }}>
                <Alert severity="success">Lesson saved. You can now edit it.</Alert>
                <Button variant="contained" onClick={() => setEditing(true)}>
                  Edit Lesson
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: "wrap" }}>
                <Button type="button" variant="contained" onClick={handleLessonSaved} disabled={isSaving}>
                  {isSaving ? "Saving…" : "Save to database"}
                </Button>
                <Button type="button" onClick={handleGenerateAgain} disabled={isSaving}>
                  Change inputs and generate again
                </Button>
              </Stack>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}
