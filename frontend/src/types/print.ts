import type { ResponseArea } from "./lesson";

export type PrintTemplate = "worksheet" | "answer_key"

export interface PrintSettings {
  template: PrintTemplate;
  font_size: "small" | "medium" | "large";
  spacing: "compact" | "normal" | "roomy";
  columns: 1 | 2;
  show_answers: boolean;
  header: { name: boolean; date: boolean; period: boolean };
  paper: "letter" | "a4";
}

export type WorkSheetItem =
  | { kind: "problem"; problem_id: number | string; response_area?: ResponseArea }
  | { kind: "block"; area: ResponseArea; caption?: string }
  | { kind: "text"; variant: "heading" | "body"; markdown: string }
  | { kind: "page_break" };

export interface WorksheetLayout {
  items: WorkSheetItem[];
}