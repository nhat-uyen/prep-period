import type { Lesson } from "./lesson";
import type { WorkSheetItem, WorksheetLayout } from "./print";

// Derived from Lesson type so this works whatever the problem type is called
type Problem = Lesson["activities"][number]["problems"][number];

export type ProblemId = number | string;

// prefer option: the problem id; otherwiseL unmigrated lessons fall back to a position based key
export function problemKey(problem: Problem, activityIndex: number, problemIndex: number): ProblemId {
  return problem.id ?? `a${activityIndex}-p${problemIndex}`;
}

export function buildProblemIndex(lesson: Lesson): Map<ProblemId, Problem> {
  const index = new Map<ProblemId, Problem>();
  lesson.activities.forEach((activity, ai) =>
    activity.problems.forEach((problem, pi) => index.set(problemKey(problem, ai, pi), problem))
  );
  return index;
}

// lesson with no customization from users would just look like how it is generated with default print settings
export function buildDefaultLayout(lesson: Lesson): WorksheetLayout {
  const items: WorkSheetItem[] = [];
  lesson.activities.forEach((activity, ai) => {
    items.push({ kind: "text", variant: "heading", markdown: activity.name });
    if (activity.student_instructions) {
      items.push({ kind: "text", variant: "body", markdown: activity.student_instructions });
    }
    activity.problems.forEach((problem, pi) => {
      items.push({ kind: "problem", problem_id: problemKey(problem, ai, pi) });
    });
  });
  return { items }
}

// Consecutive problems/blocks form one "flow" group, which is what the one- or two-column setting applies to. Text and page breaks span the full width
export type ItemGroup =
  | { kind: "flow"; items: WorkSheetItem[] }
  | { kind: "single"; item: WorkSheetItem };

export function groupItems(items: WorkSheetItem[]): ItemGroup[] {
  const groups: ItemGroup[] = [];
  for (const item of items) {
    if (item.kind === "problem" || item.kind === "block") {
      const last = groups[groups.length - 1];
      if (last?.kind === "flow") last.items.push(item);
      else groups.push({ kind: "flow", items: [item] });
    } else {
      groups.push({ kind: "single", item })
    }
  }
  return groups;
}