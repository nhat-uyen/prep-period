/**
 * LessonForm module
 *
 * Renders a form for collecting lesson generation parameters and submits
 * them to the lessons API. Calls `onLessonGenerated` with the created lesson
 * when the request succeeds.
 */
import { useEffect, useRef, useState } from "react";
import { Autocomplete, Button, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { getProblems } from "../api/problems";
import { streamLesson } from "../api/lessons";
import type { LessonDraft, Problem } from "../types/lesson";


type LessonFormProps = ({
  onLessonGenerated: (lessondraft: LessonDraft) => void;
  setError: (error: string) => void
});

export default function LessonForm({ setError, onLessonGenerated }: LessonFormProps) {
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("");
  const [savedProblems, setSavedProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  const [problemLoadError, setProblemLoadError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [receivedCharacters, setReceivedCharacters] = useState(0);
  const lessonFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let cancelled = false;

    getProblems()
      .then((problems) => {
        if (!cancelled) setSavedProblems(problems);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Failed to load saved problems", error);
        setProblemLoadError("Saved problems could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProblems(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setError("");
    setReceivedCharacters(0);
    setIsGenerating(true);

    try {
      const streamedLesson = await streamLesson(
        {
          topic,
          grade,
          duration_minutes: Number(duration),
          problem_ids: selectedProblems.flatMap((problem) =>
            problem.id === undefined ? [] : [problem.id],
          ),
        },
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
    <Paper ref={lessonFormRef} component="form" onSubmit={handleSubmit} elevation={0} sx={{ p: { xs: 2, md: 3 }, backgroundColor: "background.paper" }}>
      <Stack spacing={2.5}>
        <Typography variant="h5">Set the lesson parameters</Typography>
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
        <Autocomplete
          multiple
          options={savedProblems}
          value={selectedProblems}
          onChange={(_, selected) => setSelectedProblems(selected)}
          getOptionLabel={(problem) => problem.question}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={isLoadingProblems}
          disabled={isLoadingProblems || savedProblems.length === 0}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Saved problems (optional)"
              placeholder={savedProblems.length ? "Search and select problems" : "No saved problems available"}
              helperText={problemLoadError || (isLoadingProblems ? "Loading saved problems…" : "Selected problems will be included in the generated lesson.")}
            />
          )}
        />
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
