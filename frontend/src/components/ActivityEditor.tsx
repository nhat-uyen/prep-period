
/**
 * ActivityEditor module
 *
 * Provides the `ActivityEditor` React component which renders editable inputs
 * for a single lesson activity. It accepts an `activity` object and an
 * `onChange` handler which is called with the updated `Activity` when fields
 * change.
 */
import type { Activity } from "../types/lesson";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";


type ActivityProp = {
  activity: Activity;
  onChange: (activity: Activity) => void;
  onRemove: () => void;
};

const listFields = [
  { key: "teacher_actions", label: "Teacher actions" },
  { key: "teacher_prompts", label: "Teacher prompts" },
  { key: "look_fors", label: "Look-fors" },
  { key: "teacher_notes_prompts", label: "Teacher notes prompts" },
] as const;

export default function ActivityEditor({ activity, onChange, onRemove }: ActivityProp) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Activity name"
            value={activity.name}
            onChange={e => onChange({ ...activity, name: e.target.value })}
          />
          <TextField
            label="Minutes"
            type="number"
            value={activity.duration_minutes}
            slotProps={{ htmlInput: { min: 1 } }}
            onChange={e => onChange({ ...activity, duration_minutes: Number(e.target.value) })}
            sx={{ minWidth: { sm: 130 } }}
          />
        </Stack>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Student instructions"
          value={activity.student_instructions}
          onChange={e => onChange({ ...activity, student_instructions: e.target.value })}
        />
        {listFields.map(({ key, label }) => (
          <TextField
            key={key}
            fullWidth
            multiline
            minRows={2}
            label={`${label} (one per line)`}
            value={activity[key].join("\n")}
            onChange={e => onChange({
              ...activity,
              [key]: e.target.value.split("\n"),
            })}
          />
        ))}

        <Divider />
        <Box>
          <Stack direction="row" sx={{ mb: 1, justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Problems</Typography>
            <Button onClick={() => onChange({
              ...activity,
              problems: [...activity.problems, {
                question: "",
                instructions: "",
                answer: "",
                explanation: "",
                skills: [],
              }],
            })}>
              Add problem
            </Button>
          </Stack>
          <Stack spacing={2}>
            {activity.problems.map((problem, index) => (
              <Paper key={problem.id ?? index} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1">Problem {index + 1}</Typography>
                    <Button color="error" onClick={() => onChange({
                      ...activity,
                      problems: activity.problems.filter((_, problemIndex) => problemIndex !== index),
                    })}>
                      Remove problem
                    </Button>
                  </Stack>
                  <TextField
                    fullWidth
                    multiline
                    label="Question"
                    value={problem.question}
                    onChange={e => onChange({
                      ...activity,
                      problems: activity.problems.map((item, problemIndex) => problemIndex === index
                        ? { ...item, question: e.target.value }
                        : item),
                    })}
                  />
                  <TextField
                    fullWidth
                    multiline
                    label="Instructions"
                    value={problem.instructions}
                    onChange={e => onChange({
                      ...activity,
                      problems: activity.problems.map((item, problemIndex) => problemIndex === index
                        ? { ...item, instructions: e.target.value }
                        : item),
                    })}
                  />
                  <TextField
                    fullWidth
                    multiline
                    label="Answer"
                    value={problem.answer}
                    onChange={e => onChange({
                      ...activity,
                      problems: activity.problems.map((item, problemIndex) => problemIndex === index
                        ? { ...item, answer: e.target.value }
                        : item),
                    })}
                  />
                  <TextField
                    fullWidth
                    multiline
                    label="Explanation"
                    value={problem.explanation}
                    onChange={e => onChange({
                      ...activity,
                      problems: activity.problems.map((item, problemIndex) => problemIndex === index
                        ? { ...item, explanation: e.target.value }
                        : item),
                    })}
                  />
                  <TextField
                    fullWidth
                    label="Skills (one per line)"
                    value={problem.skills.join("\n")}
                    onChange={e => onChange({
                      ...activity,
                      problems: activity.problems.map((item, problemIndex) => problemIndex === index
                        ? { ...item, skills: e.target.value.split("\n") }
                        : item),
                    })}
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Difficulty"
                      value={problem.difficulty ?? ""}
                      onChange={e => onChange({
                        ...activity,
                        problems: activity.problems.map((item, problemIndex) => problemIndex === index
                          ? { ...item, difficulty: e.target.value || null }
                          : item),
                      })}
                    />
                    <TextField
                      fullWidth
                      label="Problem type"
                      value={problem.problem_type ?? ""}
                      onChange={e => onChange({
                        ...activity,
                        problems: activity.problems.map((item, problemIndex) => problemIndex === index
                          ? { ...item, problem_type: e.target.value || null }
                          : item),
                      })}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
        <Button color="error" onClick={onRemove} sx={{ alignSelf: "flex-end" }}>
          Remove activity
        </Button>
      </Stack>
    </Paper>
  )
}