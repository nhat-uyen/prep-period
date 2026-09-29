import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { Problem } from "../types/lesson";

type SkillProblemsViewProps = {
  skill: string;
  problems: Problem[];
  onBack?: () => void;
};

export default function SkillProblemsView({ skill, problems, onBack }: SkillProblemsViewProps) {
  return (
    <Stack spacing={2}>
      {onBack && (
        <Button onClick={onBack} variant="text" sx={{ alignSelf: "flex-start" }}>
          ← All skills
        </Button>
      )}
      <Typography variant="h2" sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}>{skill}</Typography>
      {problems.length === 0 ? <Typography color="text.secondary">No problems found for this skill.</Typography>
        : problems.map((problem) => (
          <Card key={`${skill}-${problem.id ?? problem.question}`} variant="outlined">
            <CardContent>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{problem.question}</Typography>
                <Typography color="text.secondary">{problem.instructions}</Typography>
                <Typography><strong>Answer:</strong> {problem.answer}</Typography>
                <Typography><strong>Explanation:</strong> {problem.explanation}</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  {(problem.skills ?? []).map((tag) => <Chip key={tag} size="small" label={tag} variant="outlined" />)}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
    </Stack>
  );
}
