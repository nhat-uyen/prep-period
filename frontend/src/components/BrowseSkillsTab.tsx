import { useState } from "react";
import { Alert, Box, Button, Card, CardActionArea, CardContent, CircularProgress, Grid, Stack, Typography, } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import type { Problem, Skill } from "../types/lesson";
import SkillProblemsView from "./SkillProblemsView";

type BrowseSkillsTabProps = {
  skills: Skill[];
  problemsBySkill: Problem[];
  loading: boolean;
  onSkillSelected: (skillId: number) => Promise<void>;
  onEdit: (problem: Problem) => Promise<boolean>;
  onDelete: (problem: Problem) => void;
};

export default function BrowseSkillsTab({ skills, problemsBySkill, loading, onSkillSelected, onEdit, onDelete, }: BrowseSkillsTabProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [loadingProblems, setLoadingProblems] = useState(false);

  if (selectedSkill) {
    if (loadingProblems) {
      return (
        <Stack spacing={2}>
          <Button onClick={() => setSelectedSkill(null)} startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "flex-start" }}>
            All skills
          </Button>
          <Stack direction="row" spacing={1.5} sx={{ py: 3, alignItems: "center" }}>
            <CircularProgress size={22} aria-label="Loading problems" />
            <Typography color="text.secondary">Loading problems for {selectedSkill.name}...</Typography>
          </Stack>
        </Stack>
      );
    }

    return (
      <SkillProblemsView
        skill={selectedSkill}
        problems={problemsBySkill}
        onBack={() => setSelectedSkill(null)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.4rem", md: "1.7rem" }, mb: 0.5 }}>
          Browse by skill
        </Typography>
        <Typography color="text.secondary">
          Choose a skill to see the saved problems teachers have tagged with it.
        </Typography>
      </Box>

      {loading ? (
        <Stack direction="row" spacing={1.5} sx={{ py: 3, alignItems: "center" }}>
          <CircularProgress size={22} aria-label="Loading skills" />
          <Typography color="text.secondary">Loading skills...</Typography>
        </Stack>
      ) : skills.length === 0 ? (
        <Alert severity="info">
          No skills yet. Add a problem with skill tags to start building your library.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {skills.map((skill) => (
            <Grid key={skill.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", transition: "border-color 160ms, transform 160ms", "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)" } }}>
                <CardActionArea
                  onClick={() => {
                    setSelectedSkill(skill);
                    setLoadingProblems(true);
                    void onSkillSelected(skill.id).finally(() => setLoadingProblems(false));
                  }}
                  aria-label={`Browse problems for ${skill.name}`}
                  sx={{ height: "100%" }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, minHeight: 92 }}>
                    <Typography variant="h3" sx={{ fontSize: "1.05rem", flexGrow: 1 }}>
                      {skill.name}
                    </Typography>
                    <ArrowForwardRoundedIcon color="action" fontSize="small" />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
