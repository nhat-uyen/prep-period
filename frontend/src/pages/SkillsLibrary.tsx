import { useEffect, useReducer, useState } from "react";

import AddProblemTab, { type NewProblemForm } from "../components/AddProblemTab";
import BrowseSkillsTab from "../components/BrowseSkillsTab";
import SearchProblemsTab from "../components/SearchProblemsTab";
import { Alert, Box, Button, Container, Stack, Tab, Tabs, Typography, } from "@mui/material";
import { createProblem, updateProblem, deleteProblem, getSkills, getProblemsBySkillId } from "../api/problems";
import type { Problem, Skill } from "../types/lesson";
import { Link as RouterLink } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { problemsReducer, initialProblemsState } from "../reducers/problemsReducer";
import { useQueryClient } from "@tanstack/react-query";

const emptyProblem: NewProblemForm = {
  question: "",
  instructions: "",
  answer: "",
  explanation: "",
  skills: "",
};

export default function SkillsLibrary() {
  const queryClient = useQueryClient();
  // for Tab: Browse Problems and Search Problems
  const [problems, dispatch] = useReducer(problemsReducer, initialProblemsState);
  const [skills, setSkills] = useState<Skill[]>([]);

  // for Tab: Add Problem
  const [form, setForm] = useState(emptyProblem);

  //  states of the whole Skills Library page (including all three tabs)
  const [activeTab, setActiveTab] = useState<"add" | "browse" | "search">("add");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all skills for the Browse Problems tab
  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
        const skills = await getSkills();
        setSkills(skills);
      } catch (error) {
        console.error("Failed to load skills", error);
        setError("Failed to load skills.");
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  // Handle selection of a skill in the Browse Problems tab 
  // When this is called, the problems list will be updated to show only problems related to the selected skill.
  async function handleSkillSelected(skillId: number) {
    try {
      setError("");
      // the api call already take care of looking up skillid whether it exists or not
      const problemsBySkill = await getProblemsBySkillId(skillId);
      dispatch({ type: "SET_PROBLEMS", problems: problemsBySkill });
      if (problemsBySkill.length === 0) {
        setError("No problems found for the selected skill.");
      }
    } catch (error) {
      console.error("Failed to load problems for skill", error);
      setError("Failed to load problems for the selected skill.");
    }
  }
  // Handle form submission for adding a new problem in the Add Problem tab
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
      void getSkills().then(setSkills).catch((refreshError) => {
        console.error("Failed to refresh skills", refreshError);
      });
      await queryClient.invalidateQueries({ queryKey: ["searchResultsBySkill"] });
      setForm(emptyProblem);
      setActiveTab("browse");
    } catch (saveError) {
      console.error("Failed to save problem", saveError);
      setError("Could not save the problem. Please try again.");
    }
  }

  // Handle deletion of a problem in SkillProblemsView in Browse and Search tabs
  const handleDeleteProblem = async (problem: Problem): Promise<void> => {
    if (problem.id === undefined) return;

    try {
      setError("");
      await deleteProblem(problem.id);
      dispatch({ type: "DELETE_PROBLEM", id: problem.id });
      await queryClient.invalidateQueries({ queryKey: ["searchResultsBySkill"] });
    } catch (error) {
      console.error("Failed to delete problem", error);
      setError("Could not delete the problem. Please try again.");
    }
  };

  // Handle editing of a problem in SkillProblemsView in Browse and Search tabs
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
      await queryClient.invalidateQueries({ queryKey: ["searchResultsBySkill"] });
      return true;
    } catch (error) {
      console.error("Failed to update problem", error);
      setError("Could not update the problem. Please try again.");
      return false;
    }
  };

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
            skills={skills}
            problemsBySkill={problems}
            loading={loading}
            onSkillSelected={handleSkillSelected}
            onEdit={handleEditProblem}
            onDelete={handleDeleteProblem} />
        </Box>
        <Box hidden={activeTab !== "search"}>
          <SearchProblemsTab
            onEdit={handleEditProblem}
            onDelete={handleDeleteProblem}
          />
        </Box>
      </Container>
    </Box>
  );
}
