import { Button, Card, CardContent, Chip, Stack, Typography, IconButton, Tooltip, } from "@mui/material";
import type { Problem, Skill } from "../types/lesson";
import MathText from "./MathText";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";
import ProblemEditor from "./ProblemEditor";

type SkillProblemsViewProps = {
  skill: Pick<Skill, "name">;
  problems: Problem[];
  onBack?: () => void;
  onEdit?: (problem: Problem) => Promise<boolean>;
  onDelete?: (problem: Problem) => void;
};

export default function SkillProblemsView({ skill, problems, onBack, onEdit, onDelete }: SkillProblemsViewProps) {
  const [editProblem, setEditProblem] = useState<Problem | null>(null);

  return (
    <Stack spacing={2}>
      {onBack && (
        <Button onClick={onBack} variant="text" sx={{ alignSelf: "flex-start" }}>
          Back to all skills
        </Button>
      )}
      <Typography variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}>{skill.name}</Typography>
      {problems.length === 0 ? <Typography color="text.secondary">No problems found for this skill.</Typography>
        : problems.map((problem) => (
          <Card key={problem.id ?? problem.question} variant="outlined">
            <CardContent>
              <Stack spacing={2.5} direction="row" sx={{ justifyContent: "flex-end" }}>
                {onEdit && (
                  <Tooltip title="Edit problem">
                    <IconButton onClick={() => setEditProblem(problem)} aria-label="Edit problem">
                      <EditOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {editProblem && editProblem.id === problem.id && onEdit && (
                  <ProblemEditor
                    key={problem.id}
                    problem={editProblem}
                    onSave={async (updatedProblem) => {
                      const saved = await onEdit(updatedProblem);
                      if (saved) {
                        setEditProblem(null);
                      }
                      return saved;
                    }}
                    onCancel={() => setEditProblem(null)}
                  />
                )}
                {onDelete && (
                  <Tooltip title="Delete problem">
                    <IconButton
                      onClick={() => onDelete(problem)}
                      color="error"
                      aria-label="Delete problem">
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}

              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}><MathText>{problem.question}</MathText></Typography>
              <Typography color="text.secondary"><MathText>{problem.instructions}</MathText></Typography>
              <Typography><strong>Answer: </strong><MathText>{problem.answer}</MathText></Typography>
              <Typography><strong>Explanation:</strong><MathText>{problem.explanation}</MathText></Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {[
                  ...(problem.skills ?? []).map((tag) => (
                    <Chip key={tag} size="small" label={tag} variant="outlined" />
                  )),
                  ...(problem.lesson_id
                    ? [<Chip key={`lesson-${problem.lesson_id}`} size="small" label={`Lesson: ${problem.lesson_id}`} variant="outlined" />]
                    : []),
                ]}
              </Stack>
            </CardContent>
          </Card>
        ))
      }
    </Stack >
  );
}
