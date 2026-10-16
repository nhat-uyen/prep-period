import { useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Card, CardActionArea, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography, } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import type { Page, Problem, Skill } from "../types/lesson";
import SkillProblemsView from "./SkillProblemsView";

type BrowseSkillsTabProps = {
  skills: Skill[];
  problemsBySkill: Problem[];
  loading: boolean;
  onSkillSelected: (skillId: number, offset: number) => Promise<Page<Problem> | null>;
  onEdit: (problem: Problem) => Promise<boolean>;
  onDelete: (problem: Problem) => void;
};

export default function BrowseSkillsTab({ skills, problemsBySkill, loading, onSkillSelected, onEdit, onDelete, }: BrowseSkillsTabProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [pageInfo, setPageInfo] = useState<Pick<Page<Problem>, "limit" | "offset" | "has_more"> | null>(null);
  const problemPageRequestId = useRef(0);
  const [skillSort, setSkillSort] = useState<"default" | "alphabetical">("default");
  const displayedSkills = useMemo(() => skillSort === "alphabetical"
    ? [...skills].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    : skills,
    [skills, skillSort],
  );

  async function loadSkillProblems(skillId: number, offset: number) {
    const requestId = ++problemPageRequestId.current;
    setLoadingProblems(true);
    try {
      const page = await onSkillSelected(skillId, offset);
      if (requestId === problemPageRequestId.current) {
        setPageInfo(page);
      }
    } finally {
      if (requestId === problemPageRequestId.current) {
        setLoadingProblems(false);
      }
    }
  }

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
        pagination={pageInfo ?? undefined}
        onPageChange={(offset) => void loadSkillProblems(selectedSkill.id, offset)}
        onBack={() => {
          problemPageRequestId.current += 1;
          setSelectedSkill(null);
          setPageInfo(null);
        }}
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
        <>
          <FormControl size="small" sx={{ minWidth: 200, alignSelf: "flex-start" }}>
            <InputLabel id="skill-sort-label">Sort skills</InputLabel>
            <Select
              labelId="skill-sort-label"
              id="skill-sort"
              value={skillSort}
              label="Sort skills"
              onChange={(event) => setSkillSort(event.target.value as "default" | "alphabetical")}
            >
              <MenuItem value="default">Default order</MenuItem>
              <MenuItem value="alphabetical">Alphabetical (A to Z)</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            {displayedSkills.map((skill) => (
              <Grid key={skill.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%", transition: "border-color 160ms, transform 160ms", "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)" } }}>
                  <CardActionArea
                    onClick={() => {
                      setSelectedSkill(skill);
                      setPageInfo(null);
                      void loadSkillProblems(skill.id, 0);
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
        </>
      )}
    </Stack>
  );
}
