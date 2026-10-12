import { useEffect, useMemo, useReducer, useState } from "react";

import AddProblemTab, { type NewProblemForm } from "../components/AddProblemTab";
import BrowseSkillsTab from "../components/BrowseSkillsTab";
import SearchProblemsTab from "../components/SearchProblemsTab";
import { Alert, Box, Button, Container, Stack, Tab, Tabs, Typography, } from "@mui/material";
import { createProblem, getProblems, updateProblem, deleteProblem } from "../api/problems";
import type { Problem } from "../types/lesson";
import { Link as RouterLink } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { problemsReducer, initialProblemsState } from "../reducers/problemsReducer";

const emptyProblem: NewProblemForm = {
  question: "",
  instructions: "",
  answer: "",
  explanation: "",
  skills: "",
};

export default function SkillsLibrary() {
  const [problems, dispatch] = useReducer(problemsReducer, initialProblemsState);
  const [form, setForm] = useState(emptyProblem);
  const [activeTab, setActiveTab] = useState<"add" | "browse" | "search">("add");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getProblems()
      .then((savedProblems) => {
        if (cancelled) return;
        dispatch({ type: "SET_PROBLEMS", problems: savedProblems });
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
  }, []);

  const problemsBySkill = useMemo(() => {
    return problems.reduce((acc, problem) => {
      const skill = problem.skills[0]; // Assuming each problem has at least one skill
      if (!acc.some(([s]) => s === skill)) {
        acc.push([skill, []]);
      }
      const skillGroup = acc.find(([s]) => s === skill);
      if (skillGroup) {
        skillGroup[1].push(problem);
      }
      return acc;
    }, [] as [string, Problem[]][]);
  }, [problems]);

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    try {
      setError("");
      const savedProblem = await createProblem({
        question: form.question.trim(),
        instructions: form.instructions.trim(),
        answer: form.answer.trim(),
        explanation: form.explanation.trim(),
        skills: [...new Set(form.skills.split(",").map((skill) => skill.trim()).filter(Boolean))],
      });
      dispatch({ type: "ADD_PROBLEM", problem: savedProblem });
      setForm(emptyProblem);
      setActiveTab("browse");
    } catch (saveError) {
      console.error("Failed to save problem", saveError);
      setError("Could not save the problem. Please try again.");
    }
  }

  async function handleDeleteProblem(problem: Problem) {
    if (problem.id === undefined) return;

    try {
      setError("");
      await deleteProblem(problem.id);
      dispatch({ type: "DELETE_PROBLEM", id: problem.id });
    } catch (error) {
      console.error("Failed to delete problem", error);
      setError("Could not delete the problem. Please try again.");
    }
  }

  const handleEditProblem = async (problem: Problem): Promise<boolean> => {
    if (problem.id === undefined) return false;

    try {
      setError("");
      const updatedProblem = await updateProblem(problem.id, {
        question: problem.question,
        instructions: problem.instructions,
        answer: problem.answer,
        explanation: problem.explanation,
        skills: problem.skills,
        difficulty: problem.difficulty,
        problem_type: problem.problem_type,
      });
      dispatch({ type: "UPDATE_PROBLEM", problem: updatedProblem });
      return true;
    } catch (error) {
      console.error("Failed to update problem", error);
      setError("Could not update the problem. Please try again.");
      return false;
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

        <Box hidden={activeTab !== "add"}>
          <AddProblemTab
            form={form}
            onChange={(field, value) => setForm((currentForm) => ({ ...currentForm, [field]: value }))}
            onSubmit={handleSubmit}
          />
        </Box>
        <Box hidden={activeTab !== "browse"}>
          <BrowseSkillsTab
            problemsBySkill={problemsBySkill}
            loading={loading}
            onEdit={handleEditProblem}
            onDelete={handleDeleteProblem}
          />
        </Box>
        <Box hidden={activeTab !== "search"}>
          <SearchProblemsTab
            problemsBySkill={problemsBySkill}
            loading={loading}
            onEdit={handleEditProblem}
            onDelete={handleDeleteProblem}
          />
        </Box>
      </Container>
    </Box>
  );
}
