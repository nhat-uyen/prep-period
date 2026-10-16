import { Button, TextField } from "@mui/material";
import { useState } from "react";
import type { Problem } from "../types/lesson";

type ProblemEditorProps = {
  problem: Problem;
  onSave: (updatedProblem: Problem) => Promise<boolean>;
  onCancel: () => void;
};

export default function ProblemEditor({ problem, onSave, onCancel }: ProblemEditorProps) {
  const [question, setQuestion] = useState(problem.question);
  const [instructions, setInstructions] = useState(problem.instructions);
  const [answer, setAnswer] = useState(problem.answer);
  const [explanation, setExplanation] = useState(problem.explanation);
  const [skills, setSkills] = useState(problem.skills.join(", "));

  async function handleSave(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const editingProblem: Problem = {
      ...problem,
      question: question.trim(),
      instructions: instructions.trim(),
      answer: answer.trim(),
      explanation: explanation.trim(),
      skills: [...new Set(skills.split(",").map((skill) => skill.trim()).filter(Boolean))],
    };
    await onSave(editingProblem);
  }

  return (
    <form onSubmit={handleSave}>
      <TextField
        required
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Explanation"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        required
        label="Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
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
