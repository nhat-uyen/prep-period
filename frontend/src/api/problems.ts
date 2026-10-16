// Problems

import type { Page, Problem, ProblemInput, Skill } from "../types/lesson";
import api from "./lessons";

export async function getProblems(skill?: string): Promise<Problem[]> {
  const response = await api.get<Problem[]>("/problems", { params: skill ? { skill } : {} });
  return response.data;
}

export async function createProblem(problem: ProblemInput): Promise<Problem> {
  const response = await api.post<Problem>("/problems", problem);
  return response.data;
}

// Update a problem and return the updated problem and the updated all skills list which is tracked by normalized name
export async function updateProblem(id: number, problem: ProblemInput): Promise<Problem> {
  const response = await api.put<Problem>(`/problems/${id}`, problem);
  return response.data;
}

export async function deleteProblem(id: number): Promise<void> {
  await api.delete(`/problems/${id}`);
}

export async function deleteAllProblems(): Promise<void> {
  await api.delete("/problems");
}

// ------------ Skills--------------

export async function getSkills(): Promise<Skill[]> {
  const response = await api.get<Skill[]>("/skills");
  return response.data;
}

export async function getProblemsBySkillId(skillId: number, limit = 5, offset = 0): Promise<Page<Problem>> {
  const response = await api.get<Page<Problem>>(`/skills/${skillId}/problems`, { params: { limit, offset } });
  return response.data;
}

// return a tuple of skill and its corresponding problems 
// the endpoint return a tuple of one or multiple skills and their corresponding problems
export async function searchProblemsBySkillName(skillName: string): Promise<[string, Problem[]][]> {
  const response = await api.get<[string, Problem[]][]>(`/skills/search`, { params: { skill_name: skillName } });
  return response.data;
}
