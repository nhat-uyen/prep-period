import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { Problem } from "../types/lesson";
import SkillProblemsView from "./SkillProblemsView";
import { searchProblemsBySkillName } from "../api/problems";

type SearchProblemsTabProps = {
  onEdit: (problem: Problem) => Promise<boolean>;
  onDelete: (problem: Problem) => void;
};

export default function SearchProblemsTab({ onEdit, onDelete }: SearchProblemsTabProps) {
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [form, setForm] = useState({ searchQuery: "" });

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setSubmittedQuery(form.searchQuery.trim());
  }

  // Search for problems by skill only
  // save the search results in a memoized value to avoid redundant API calls
  // the responsemodel return a tuple of one or multiple skills and their corresponding problems
  const normalizedQuery = submittedQuery.toLocaleLowerCase();
  const {
    data: searchResultsBySkill = [],
    isFetching: isSearching,
    isError,
  } = useQuery<[string, Problem[]][]>({
    queryKey: ["searchResultsBySkill", normalizedQuery],
    queryFn: () => searchProblemsBySkillName(normalizedQuery),
    enabled: normalizedQuery.length > 0,
  });

  return (
    <Stack spacing={2}>
      <Stack
        component="form"
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Search by skill name"
          placeholder="e.g. equivalent fractions"
          value={form.searchQuery}
          onChange={(e) => setForm({ searchQuery: e.target.value })}
        />
        <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
          Search
        </Button>
      </Stack>
      {!normalizedQuery ? <Typography color="text.secondary">Enter a skill name and select Search.</Typography>
        : isSearching ? <Typography color="text.secondary">Loading problems...</Typography>
          : isError ? <Typography color="error">Could not search skills. Please try again.</Typography>
            : searchResultsBySkill.length === 0 ? <Typography color="text.secondary">No problems match that search.</Typography>
              : searchResultsBySkill.map(([skillName, problems]) => (
                <Accordion key={skillName} disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{skillName}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <SkillProblemsView
                      skill={{ name: skillName }}
                      problems={problems}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </AccordionDetails>
                </Accordion>
              ))
      }
    </Stack>
  );
}
