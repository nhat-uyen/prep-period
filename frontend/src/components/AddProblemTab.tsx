import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export type NewProblemForm = {
  question: string;
  instructions: string;
  answer: string;
  explanation: string;
  skills: string;
};

type AddProblemTabProps = {
  form: NewProblemForm;
  onChange: (field: keyof NewProblemForm, value: string) => void;
  onSubmit: (e: { preventDefault: () => void; }) => void;
};

export default function AddProblemTab({ form, onChange, onSubmit }: AddProblemTabProps) {
  return (
    <Card elevation={0} sx={{ maxWidth: 760 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Add an independent problem</Typography>
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <TextField required label="Question" value={form.question} onChange={(event) => onChange("question", event.target.value)} />
          <TextField required label="Student instructions" value={form.instructions} onChange={(event) => onChange("instructions", event.target.value)} />
          <TextField required label="Answer" value={form.answer} onChange={(event) => onChange("answer", event.target.value)} />
          <TextField required multiline minRows={2} label="Explanation" value={form.explanation} onChange={(event) => onChange("explanation", event.target.value)} />
          <TextField required label="Skills (comma separated)" placeholder="e.g. equivalent fractions, multiplication" value={form.skills} onChange={(event) => onChange("skills", event.target.value)} />
          <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Save Problem</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}