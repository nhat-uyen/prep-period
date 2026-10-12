import { Button, TextField } from "@mui/material";
import { useState } from "react";
import type { Problem } from "../types/lesson";

type ProblemEditorProps = {
  problem: Problem;
  onSave: (updatedProblem: Problem) => Promise<boolean>;
  onCancel: () => void;
};

export default function ProblemEditor({ problem, onSave, onCancel }: ProblemEditorProps) {
  const [form, setForm] = useState(problem);

  async function handleSave(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const editingProblem: Problem = {
      ...problem,
      question: form.question.trim(),
      instructions: form.instructions.trim(),
      answer: form.answer.trim(),
      explanation: form.explanation.trim(),
      skills: [...new Set(form.skills.map((skill) => skill.trim()).filter(Boolean))],
    };
    await onSave(editingProblem);
  }

  return (
    <form onSubmit={handleSave}>
      <TextField
        required
        label="Question"
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Instructions"
        value={form.instructions}
        onChange={(e) => setForm({ ...form, instructions: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Answer"
        value={form.answer}
        onChange={(e) => setForm({ ...form, answer: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Explanation"
        value={form.explanation}
        onChange={(e) => setForm({ ...form, explanation: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Skills"
        value={form.skills.join(", ")}
        onChange={(e) => setForm({ ...form, skills: e.target.value.split(",").map((s) => s.trim()) })}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Save Changes
      </Button>
      <Button type="button" onClick={onCancel} variant="outlined" color="secondary">
        Cancel
      </Button>
    </form>
  );
}
