import { useEffect, useState } from "react";
import LessonReflection from "../components/LessonReflection";
import type { Lesson } from "../types/lesson";
import type { Reflection } from "../types/lesson";
import { createReflection, getLessonByID, getLessons } from "../api/lessons";
import { Alert, Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";



export default function Reflection() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadLessons() {
      try {
        const data = await getLessons();
        setLessons(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load lessons");
      }
    }
    loadLessons();
  }, [])

  async function handleSelectedLesson(lessonId: number) {
    if (!lessonId) {
      setSelectedLesson(null);
      return;
    }
    try {
      setError("");
      const lesson = await getLessonByID(lessonId);
      setSelectedLesson(lesson);
    } catch (error) {
      console.error(error);
      setError("Failed to load lesson.");
    }
  }

  async function handleSavingReflection() {
    if (!reflection) {
      setError("Please complete your reflection.");
      setSuccessMessage("");
      return;
    }
    try {
      setError("")

      await createReflection(reflection);
      setSuccessMessage("Reflection saved successfully!")
      console.log("Reflection saved!");
    } catch (error) {
      console.error(error);
      setError("Failed to save reflection.");
      setSuccessMessage("");
    }
  }

  return (
    <Box component="main" sx={{ py: { xs: 4, md: 7 } }}>
      <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".14em" }}>Look back</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4rem" } }}>Lesson Reflection</Typography>
          <Typography color="text.secondary">Reflect on each part of your lesson.</Typography>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="lesson-select-label">Select a lesson</InputLabel>
          <Select
            labelId="lesson-select-label"
            label="Select a lesson"
            value={selectedLesson?.id ?? ""}
            onChange={(e) => {
              const lessonId = Number(e.target.value);
              handleSelectedLesson(lessonId)
            }
            }
          >
            <MenuItem value="">Select a lesson</MenuItem>
            {lessons.map(lesson => (
              <MenuItem key={lesson.id} value={lesson.id}>{lesson.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {selectedLesson !== null
          ? <>
            <LessonReflection
              lesson={selectedLesson}
              onReflectionChange={setReflection} />

            {successMessage && (
              <Alert severity="success" sx={{ mt: 3 }}>
                {successMessage}
              </Alert>
            )}

            <Button variant="contained" type="button" onClick={handleSavingReflection} sx={{ mt: 3 }}>
              Save Reflection
            </Button>
          </>
          : <Typography color="text.secondary" sx={{ mt: 3 }}>Please select a lesson to begin your reflection.</Typography>
        }
      </Container>
    </Box>
  )
}