// Problems

import type { Problem, ProblemInput } from "../types/lesson";
import api from "./lessons";

export async function getProblems(skill?: string): Promise<Problem[]> {
  const response = await api.get<Problem[]>("/problems", { params: skill ? { skill } : {} });
  return response.data;
}

export async function createProblem(problem: ProblemInput): Promise<Problem> {
  const response = await api.post<Problem>("/problems", problem);
  return response.data;
}

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
