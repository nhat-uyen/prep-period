import type { Problem } from "../types/lesson";

export const initialProblemsState: Problem[] = [];

const findProblemById = (problems: Problem[], id: number) => {
  return problems.find((p) => p.id === id);
};

type ProblemsAction =
  | { type: "SET_PROBLEMS"; problems: Problem[] }
  | { type: "ADD_PROBLEM"; problem: Problem }
  | { type: "UPDATE_PROBLEM"; problem: Problem }
  | { type: "DELETE_PROBLEM"; id: number }
  | { type: "CLEAR_ALL_PROBLEMS" };

export const problemsReducer = (state: Problem[] = initialProblemsState, action: ProblemsAction): Problem[] => {
  switch (action.type) {
    case "SET_PROBLEMS":
      return action.problems;
    case "ADD_PROBLEM":
      if (action.problem.id !== undefined && findProblemById(state, action.problem.id)) {
        return state;
      }
      return [...state, action.problem];
    case "UPDATE_PROBLEM": {
      if (action.problem.id === undefined) {
        return state;
      }
      return state.map((problem) => (problem.id === action.problem.id ? action.problem : problem));
    }
    case "DELETE_PROBLEM":
      return state.filter((problem) => problem.id !== action.id);
    case "CLEAR_ALL_PROBLEMS":
      return [];
    default:
      return state;
  }
};
