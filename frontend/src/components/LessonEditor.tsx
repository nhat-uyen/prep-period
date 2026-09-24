/**
 * LessonEditor module
 *
 * Provides the `LessonEditor` component for editing an existing lesson's
 * fields, objectives, prior knowledge, materials, and activities.
 */
import { useState } from "react";
import type { Lesson } from "../types/lesson";
import ActivityEditor from "./ActivityEditor";
import { Box, Button, Container, Divider, Paper, Stack, TextField, Typography } from "@mui/material";


type LessonEditorProps = {
  lesson: Lesson;
  onSaved: (lesson: Lesson) => void;
  onCancel: () => void
}

export default function LessonEditor({ lesson, onCancel, onSaved }: LessonEditorProps) {

  console.log("Lesson being edited", lesson);

  const [title, setTitle] = useState(lesson.title);
  const [subject, setSubject] = useState(lesson.subject);
  const [topic, setTopic] = useState(lesson.topic);
  const [grade, setGrade] = useState(lesson.grade);
  const [duration, setDuration] = useState(lesson.duration_minutes);
  const [objectives, setObjecctives] = useState(lesson.objectives);
  const [priorknowledge, setPriorknowledge] = useState(lesson.prior_knowledge);
  const [materials, setMaterials] = useState(lesson.materials);
  const [activities, setActivities] = useState(lesson.activities);

  async function handleSave() {
    const updatedLesson: Lesson = {
      ...lesson,
      title,
      subject,
      topic,
      grade,
      duration_minutes: duration,
      objectives: objectives.map((objective) => objective.trim()).filter(Boolean),
      prior_knowledge: priorknowledge.map((prior) => prior.trim()).filter(Boolean),
      materials: materials.map((material) => material.trim()).filter(Boolean),
      activities: activities.map((activity) => ({
        ...activity,
        name: activity.name.trim(),
        instructions: activity.instructions.trim(),
      })).filter((activity) => activity.name || activity.instructions),
    };
    onSaved(updatedLesson)
  }

  return (
    <Box component="main" sx={{ py: 3 }}>
      <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: ".14em" }}>Lesson workspace</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2.2rem", md: "3rem" } }}>Edit Lesson</Typography>
        </Stack>

        <Stack spacing={2.5}>
          <Paper component="section" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5">01. Lesson details</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Give this lesson a clear identity.</Typography>
            <Stack spacing={2}>
              <TextField label="Title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)} />
              <TextField label="Subject"
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)} />
              <TextField label="Topic"
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField fullWidth label="Grade"
                  type="number"
                  value={grade}
                  onChange={e => setGrade(Number(e.target.value))} />
                <TextField fullWidth label="Duration (minutes)"
                  type="number"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))} />
              </Stack>
            </Stack>
          </Paper>

          <Paper component="section" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5">02. Objectives</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>What should students know or be able to do?</Typography>
            <Stack spacing={2}>

              {objectives.map((objecctive, index) => (
                <TextField label={`Objective ${index + 1}`}
                  type="text"
                  key={index}
                  value={objecctive}
                  onChange={e => {
                    const updated = [...objectives];
                    updated[index] = e.target.value;
                    setObjecctives(updated)
                  }} />
              ))}
            </Stack>
          </Paper>

          <Paper component="section" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5">03. Prior knowledge</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Connect the lesson to what students already know.</Typography>
            <Stack spacing={2}>

              {priorknowledge.map((prior, index) => (
                <TextField label={`Prior knowledge ${index + 1}`}
                  type="text"
                  key={index}
                  value={prior}
                  onChange={e => {
                    const updated = [...priorknowledge];
                    updated[index] = e.target.value;
                    setPriorknowledge(updated)
                  }} />
              ))}
            </Stack>
          </Paper>

          <Paper component="section" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5">04. Materials</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Keep the preparation list practical and specific.</Typography>
            <Stack spacing={2}>

              {materials.map((material, index) => (
                <TextField label={`Material ${index + 1}`}
                  type="text"
                  key={index}
                  value={material}
                  onChange={e => {
                    const updated = [...materials];
                    updated[index] = e.target.value;
                    setMaterials(updated)
                  }} />
              ))}
            </Stack>
          </Paper>

          <Paper component="section" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5">05. Activities</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Organize the flow of the class from start to finish.</Typography>

            {activities.map((activity, index) => (
              <ActivityEditor
                key={index}
                activity={activity}
                onChange={(updatedActivity) => {
                  const updatedActivities = [...activities];
                  updatedActivities[index] = updatedActivity;
                  setActivities(updatedActivities)
                }}
              />
            ))}
          </Paper>

          <Divider />
          <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          </Stack>
        </Stack>
      </Container>

    </Box>
  );
}