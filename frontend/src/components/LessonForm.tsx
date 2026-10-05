/**
 * LessonForm module
 *
 * Renders a form for collecting lesson generation parameters and submits
 * them to the lessons API. Calls `onLessonGenerated` with the created lesson
 * when the request succeeds.
 */
import { useState } from "react";
import { streamLesson } from "../api/lessons";
import type { Lesson } from "../types/lesson";
import { Button, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material";


type LessonFormProps = ({
  onLessonGenerated: (lesson: Lesson) => void;
  setError: (error: string) => void
});

export default function LessonForm({ setError, onLessonGenerated }: LessonFormProps) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [receivedCharacters, setReceivedCharacters] = useState(0);

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setError("");
    setReceivedCharacters(0);
    setIsGenerating(true);

    try {
      const streamedLesson = await streamLesson(
        { subject, topic, grade, duration_minutes: Number(duration) },
        chunk => setReceivedCharacters(previous => previous + chunk.length),
      );

      onLessonGenerated(streamedLesson)
      console.log("Finished streaming", streamedLesson)
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error && error.message
          ? `Failed to generate lesson: ${error.message}`
          : "Failed to generate lesson. Please try again");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: { xs: 2, md: 3 }, backgroundColor: "background.paper" }}>
      <Stack spacing={2.5}>
        <Typography variant="h5">Set the lesson parameters</Typography>
        <TextField
          label="Subject"
          id="lesson-subject"
          name="subject"
          placeholder="e.g. Fractions"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <TextField
          label="Topic"
          id="lesson-topic"
          name="topic"
          placeholder="e.g. Adding fractions"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Grade"
            id="lesson-grade"
            name="grade"
            placeholder="e.g. 8, college level, or GED"
            value={grade}
            type="text"
            onChange={e => setGrade(e.target.value)}
          />
          <TextField
            fullWidth
            label="Period duration (mins)"
            id="lesson-duration"
            name="duration"
            value={duration}
            type="number"
            slotProps={{ htmlInput: { min: 1 } }}
            onChange={e => setDuration(e.target.value)}
          />
        </Stack>
        {isGenerating && (
          <Stack spacing={1} aria-live="polite">
            <Typography variant="body2" color="text.secondary">
              Generating lesson… {receivedCharacters.toLocaleString()} characters received
            </Typography>
            <LinearProgress />
          </Stack>
        )}
        <Button type="submit" variant="contained" size="large" disabled={isGenerating}>
          {isGenerating ? "Generating…" : "Generate Lesson"}
        </Button>
      </Stack>
    </Paper>
  );
}
