import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Lesson, Reflection } from "../types/lesson";
import { Card, CardContent, Chip, Divider, Stack, TextField, Typography } from "@mui/material";

type LessonReflectionProps = {
  lesson: Lesson;
  onReflectionChange: (reflection: Reflection) => void;
}

export default function LessonReflection({ lesson, onReflectionChange }: LessonReflectionProps) {
  const [objectiveReflect, setObjectiveReflect] = useState("");
  const [priorKnowledgeReflect, setPriorKnowledgeReflect] = useState("");
  const [materialsReflect, setMaterialReflect] = useState("");
  const [activityReflect, setActivityReflect] = useState<string[]>(
    () => lesson.activities.map(() => ""));

  const [keepReflect, setKeepReflect] = useState("");
  const [changeReflect, setChangeReflect] = useState("");



  useEffect(() => {
    const reflection: Reflection = {
      lesson_id: lesson.id,

      objectives_rating: null,
      objectives_notes: objectiveReflect,

      prior_knowledge_rating: null,
      prior_knowledge_notes: priorKnowledgeReflect,

      materials_rating: null,
      materials_notes: materialsReflect,

      activities: activityReflect.map((notes, index) => ({
        activity_index: index,
        rating: null,
        notes: notes,
      })),

      keep_notes: keepReflect,
      change_notes: changeReflect,
    };
    onReflectionChange(reflection);
  }, [lesson.id, onReflectionChange, objectiveReflect, priorKnowledgeReflect, materialsReflect, activityReflect, keepReflect, changeReflect]);

  function handleActivityReflectChange(index: number, value: string) {
    const updatedReflects = [...activityReflect];
    updatedReflects[index] = value;
    setActivityReflect(updatedReflects);
  }

  return (
    <Card elevation={0} sx={{ mt: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}>{lesson.title}</Typography>
          <Typography color="text.secondary">{lesson.subject} · Grade {lesson.grade} · {lesson.duration_minutes} minutes</Typography>
        </Stack>

        <Stack spacing={3}>
          <ReflectionSection title="01. Objectives" items={lesson.objectives} prompt="What did you notice about student understanding?">
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Your reflection"
              value={objectiveReflect}
              onChange={(e) => setObjectiveReflect(e.target.value)}
            />
          </ReflectionSection>

          <ReflectionSection title="02. Prior knowledge" items={lesson.prior_knowledge} prompt="What did you notice about students' prior knowledge?">
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Your reflection"
              value={priorKnowledgeReflect}
              onChange={(e) => setPriorKnowledgeReflect(e.target.value)}
            />
          </ReflectionSection>

          <ReflectionSection title="03. Materials" items={lesson.materials} prompt="What worked well? What could be improved?">
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Your reflection"
              value={materialsReflect}
              onChange={e => setMaterialReflect(e.target.value)}
            />
          </ReflectionSection>

          <Stack spacing={2}>
            <Typography variant="h5">04. Activities</Typography>
            <Typography color="text.secondary">Reflect on each activity separately.</Typography>
            {lesson.activities.map((activity, index) => (
              <Card key={activity.name} variant="outlined">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                      <Typography variant="h6">{activity.name}</Typography>
                      <Chip size="small" label={`${activity.duration_minutes} min`} color="primary" variant="outlined" />
                    </Stack>
                    <Typography color="text.secondary">{activity.instructions}</Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="What happened during this activity?"
                      value={activityReflect[index]}
                      onChange={(e) => handleActivityReflectChange(index, e.target.value)}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <ReflectionSection title="05. Overall reflection" items={[]} prompt="What worked well? (Keep it!)">
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Keep"
              value={keepReflect}
              onChange={e => setKeepReflect(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="What didn't work so well? (Modify it!)"
              value={changeReflect}
              onChange={e => setChangeReflect(e.target.value)}
            />
          </ReflectionSection>
        </Stack>
      </CardContent>
    </Card>
  )
}

type ReflectionSectionProps = {
  title: string;
  items: string[];
  prompt: string;
  children: ReactNode;
};

function ReflectionSection({ title, items, prompt, children }: ReflectionSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h5">{title}</Typography>
      {items.length > 0 && (
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          {items.map((item) => <Chip key={item} label={item} variant="outlined" />)}
        </Stack>
      )}
      <Typography color="text.secondary">{prompt}</Typography>
      {children}
      <Divider />
    </Stack>
  );
}