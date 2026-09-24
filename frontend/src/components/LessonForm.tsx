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
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";


type LessonFormProps = ({
  onLessonGenerated: (lesson: Lesson) => void;
  setError: (error: string) => void
});

export default function LessonForm({ setError, onLessonGenerated }: LessonFormProps) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("");
  // const [streamedText, setStreamedText] = useState("");

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setError("");

    try {
      // setStreamedText("");
      const streamedLesson = await streamLesson({ subject, topic, grade: Number(grade), duration_minutes: Number(duration) }, () => { })
      // (chunk) => { setStreamedText(previous => previous + chunk) });

      onLessonGenerated(streamedLesson)
      console.log("Finished streaming", streamedLesson)
    } catch (error) {
      console.error(error);
      setError("Failed to generate lesson. Please try again");
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
          placeholder="e.g. Biology"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <TextField
          label="Topic"
          id="lesson-topic"
          name="topic"
          placeholder="e.g. Cell structure"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Grade"
            id="lesson-grade"
            name="grade"
            value={grade}
            type="number"
            slotProps={{ htmlInput: { min: 1 } }}
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
        <Button type="submit" variant="contained" size="large">
          Generate Lesson
        </Button>
        {/* remove this latter but keep this for now to make sure lessons are streaming */}
        {/* <pre>{streamedText}</pre> */}
      </Stack>
    </Paper>
  );
}