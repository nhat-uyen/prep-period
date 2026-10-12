import { useState } from "react";
import { Link as MuiLink, Stack, Typography } from "@mui/material";
import type { Problem } from "../types/lesson";
import SkillProblemsView from "./SkillProblemsView";

type BrowseSkillsTabProps = {
  problemsBySkill: [string, Problem[]][];
  loading: boolean;
  onEdit: (problem: Problem) => Promise<boolean>;
  onDelete: (problem: Problem) => void;
};

export default function BrowseSkillsTab({ problemsBySkill, loading, onEdit, onDelete }: BrowseSkillsTabProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  if (selectedSkill) {
    return (
      <SkillProblemsView
        skill={selectedSkill}
        problems={problemsBySkill.find(([skill]) => skill === selectedSkill)?.[1] ?? []}
        onBack={() => setSelectedSkill(null)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Stack spacing={1}>
      {loading ? <Typography color="text.secondary">Loading skills…</Typography>
        : problemsBySkill.length === 0 ? <Typography color="text.secondary">No skills yet. Add a problem with skill tags to start the library.</Typography>
          : problemsBySkill.map(([skill]) => (
            <MuiLink
              key={skill}
              component="button"
              type="button"
              underline="hover"
              onClick={() => setSelectedSkill(skill)}
              sx={{ alignSelf: "flex-start", fontSize: "1.05rem" }}
            >
              {skill}
            </MuiLink>
          ))}
    </Stack>
  );
}