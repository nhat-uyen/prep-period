import { useEffect, useMemo, useState } from "react";

import SkillProblemsView from "../components/SkillProblemsView";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link as MuiLink,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { createProblem, getProblems } from "../api/lessons";
import type { Problem } from "../types/lesson";
import { Link as RouterLink } from "react-router";
import { ArrowBack } from "@mui/icons-material";

const emptyProblem = {
  question: "",
  instructions: "",
  answer: "",
  explanation: "",
  skills: "",
};

export default function SkillsLibrary() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [form, setForm] = useState(emptyProblem);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"add" | "browse" | "search">("add");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getProblems()
      .then((savedProblems) => {
        if (cancelled) return;
        setProblems(savedProblems);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        console.error("Failed to load problems", loadError);
        setError("Could not load the skills library.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const problemsBySkill = useMemo(() => {
    const grouped = new Map<string, Problem[]>();
    for (const problem of problems) {
      const skills = [...new Set((problem.skills ?? []).map((skill) => skill.trim()).filter(Boolean))];
      for (const skill of skills.length ? skills : ["Untagged"]) {
        const group = grouped.get(skill) ?? [];
        group.push(problem);
        grouped.set(skill, group);
      }
    }
    return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [problems]);

  const searchResultsBySkill = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return [];

    return problemsBySkill
      .map(([skill, skillProblems]) => [skill, skillProblems.filter((problem) => [
        skill,
        problem.question,
        problem.instructions,
      ].some((text) => text.toLocaleLowerCase().includes(query))),
      ] as [string, Problem[]])
      .filter(([, skillProblems]) => skillProblems.length > 0);
  }, [problemsBySkill, searchQuery]);

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    try {
      setError("");
      await createProblem({
        question: form.question.trim(),
        instructions: form.instructions.trim(),
        answer: form.answer.trim(),
        explanation: form.explanation.trim(),
        skills: [...new Set(form.skills.split(",").map((skill) => skill.trim()).filter(Boolean))],
      });
      setForm(emptyProblem);
      setLoading(true);
      setRefreshKey((currentKey) => currentKey + 1);
      setActiveTab("browse");
    } catch (saveError) {
      console.error("Failed to save problem", saveError);
      setError("Could not save the problem. Please try again.");
    }
  }

  return (
    <Box component="main" sx={{ py: { xs: 4, md: 7 } }}>
      <Container maxWidth="xl">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Button component={RouterLink} to="/" variant="outlined" color="primary" startIcon={<ArrowBack />} sx={{ alignSelf: "flex-start" }}>
            Back to Home
          </Button>
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>Math resources</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4rem" } }}>Skills Library</Typography>
          <Typography color="text.secondary">Browse saved lesson problems or add reusable problems, organized by skill.</Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Tabs
          value={activeTab}
          onChange={(_, value: "add" | "browse" | "search") => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Skills library sections"
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Add New Problem" value="add" />
          <Tab label="Browse Skills" value="browse" />
          <Tab label="Search Skills or Problems" value="search" />
        </Tabs>

        {activeTab === "add" && (
          <Card elevation={0} sx={{ maxWidth: 760 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>Add an independent problem</Typography>
              <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                <TextField required label="Question" value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} />
                <TextField required label="Student instructions" value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} />
                <TextField required label="Answer" value={form.answer} onChange={(event) => setForm({ ...form, answer: event.target.value })} />
                <TextField required multiline minRows={2} label="Explanation" value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} />
                <TextField required label="Skills (comma separated)" placeholder="e.g. equivalent fractions, multiplication" value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} />
                <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Save Problem</Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {activeTab === "browse" && (
          selectedSkill ? (
            <SkillProblemsView
              skill={selectedSkill}
              problems={problemsBySkill.find(([skill]) => skill === selectedSkill)?.[1] ?? []}
              onBack={() => setSelectedSkill(null)}
            />
          ) : (
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
          )
        )}

        {activeTab === "search" && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Search by skill or problem instructions"
              placeholder="e.g. equivalent fractions or find a common denominator"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            {!searchQuery.trim() ? <Typography color="text.secondary">Enter a skill or problem detail to search.</Typography>
              : loading ? <Typography color="text.secondary">Loading problems…</Typography>
                : problems.length === 0 ? <Typography color="text.secondary">No problems yet. Add one above or generate a lesson with problems.</Typography>
                  : searchResultsBySkill.length === 0
                    ? <Typography color="text.secondary">No problems match that search.</Typography>
                    : searchResultsBySkill.map(([skill, skillProblems]) => (
                      <SkillProblemsView key={skill} skill={skill} problems={skillProblems} />
                    ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
