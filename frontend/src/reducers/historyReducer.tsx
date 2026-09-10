import type { Lesson } from "../types/lesson";

export const initialHistory: Lesson[] = [];

const findLesson = (lessons: Lesson[], id: string | number) =>
  lessons.find((lesson) => lesson.id === id);

type HistoryAction =
  { type: "SET_HISTORY", lessons: Lesson[] }
  | { type: "ADD_LESSON"; lesson: Lesson }
  | { type: "REMOVE_LESSON"; id: string | number }
  | { type: "EDIT_LESSON"; lesson: Lesson }
  | { type: "CLEAR_HISTORY" };

export function historyReducer(state: Lesson[] = initialHistory, action: HistoryAction): Lesson[] {
  switch (action.type) {
    case "SET_HISTORY":
      return action.lessons;
    case "ADD_LESSON": {
      if (findLesson(state, action.lesson.id)) {
        return state;
      }
      return [action.lesson, ...state];
    }
    case "REMOVE_LESSON":
      return state.filter((lesson) => lesson.id !== action.id);
    case "EDIT_LESSON":
      return state.map((lesson) =>
        lesson.id === action.lesson.id ? action.lesson : lesson,
      );
    case "CLEAR_HISTORY":
      // #TODO: add the backend function to clear history
      return [];
    default:
      return state;
  }
}

