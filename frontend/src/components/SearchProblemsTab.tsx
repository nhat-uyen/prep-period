import { useMemo, useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { Problem } from "../types/lesson";
import SkillProblemsView from "./SkillProblemsView";

type SearchProblemsTabProps = {
  problemsBySkill: [string, Problem[]][];
  loading: boolean;
  onEdit: (problem: Problem) => Promise<boolean>;
  onDelete: (problem: Problem) => void;
};

export default function SearchProblemsTab({ problemsBySkill, loading, onEdit, onDelete }: SearchProblemsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  function handleSearch(event: { preventDefault: () => void; }) {
    event.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  }

  const searchResultsBySkill = useMemo(() => {
    const query = submittedQuery.toLocaleLowerCase();
    if (!query) return [];

    return problemsBySkill.flatMap(([skill, problems]) => {
      const matchingProblems = problems.filter((problem) =>
        [skill, ...(problem.skills ?? []), problem.instructions, problem.question]
          .some((value) => value.toLocaleLowerCase().includes(query)),
      );

      return matchingProblems.length > 0 ? [[skill, matchingProblems] as [string, Problem[]]] : [];
    });
  }, [problemsBySkill, submittedQuery]);

  const hasProblems = problemsBySkill.some(([, problems]) => problems.length > 0);

  return (
    <Stack spacing={2}>
      <Stack
        component="form"
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        onSubmit={handleSearch}
      >
        <TextField
          fullWidth
          label="Search by skill or problem instructions"
          placeholder="e.g. equivalent fractions or find a common denominator"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
          Search
        </Button>
      </Stack>

      {!submittedQuery ? <Typography color="text.secondary">Enter a search term and select Search.</Typography>
        : loading ? <Typography color="text.secondary">Loading problems…</Typography>
          : !hasProblems ? <Typography color="text.secondary">No problems yet. Add one above or generate a lesson with problems.</Typography>
            : searchResultsBySkill.length === 0
              ? <Typography color="text.secondary">No problems match that search.</Typography>
              : searchResultsBySkill.map(([skill, problems]) => (
                <SkillProblemsView key={skill}
                  skill={skill}
                  problems={problems}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
    </Stack>
  );
}