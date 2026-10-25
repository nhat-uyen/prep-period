import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { getLessonByID } from "../api/lessons";
import PrintGlobalStyles from "../components/print/PrintGlobalStyles";
import PrintLessonView from "../components/print/PrintLessonView";
import type { Lesson } from "../types/lesson";
import { decodePrintSettings } from "../components/print/printSettings";

// Testing block

import type { WorksheetLayout } from "../types/print";

const testLayout: WorksheetLayout = {
  items: [
    { kind: "text", variant: "heading", markdown: "Warm-up" },
    {
      kind: "block",
      area: { type: "grid", x_min: 0, x_max: 10, y_min: 0, y_max: 10, step: 1, show_axes: true },
      caption: "Use this grid for the problems below.",
    },
    { kind: "problem", problem_id: 5 },
    { kind: "problem", problem_id: 4 },
    { kind: "page_break" },
    { kind: "text", variant: "heading", markdown: "Challenge" },
    { kind: "problem", problem_id: "does-not-exist" },
  ],
};
// End testing block


export default function PrintLesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [ready, setReady] = useState(false);
  const [searchParams] = useSearchParams();
  const settings = useMemo(() => decodePrintSettings(searchParams.get("settings")), [searchParams]);

  useEffect(() => {
    getLessonByID(Number(id)).then(setLesson)
  }, [id]);

  useEffect(() => {
    if (!lesson) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      })
      );
    });
    return () => { cancelled = true; };
  }, [lesson]);

  return (
    <div data-print-ready={ready ? "true" : "false"}>
      <PrintGlobalStyles paper={settings.paper} />
      {lesson && <PrintLessonView lesson={lesson} settings={settings} layout={testLayout} />}
    </div>
  );
}

// Testing example:
// replace setLesson with
// (l) => {
//       // TEMP: remove after testing
//       l.activities[0].problems[0].response_area = {
//         type: "grid", x_min: -5, x_max: 5, y_min: -5, y_max: 5, step: 1, show_axes: true,
//       };
//       l.activities[1].problems[0].response_area = {
//         type: "table",
//         columns: ["$x$", "$y = 2x + 1$"],
//         rows: 5,
//         prefilled: [["-2", ""], ["-1", ""], ["0", ""], ["1", ""], ["2", ""]],
//       };
//       l.activities[1].problems[1].response_area = {
//         type: "number_line", min: -5, max: 5, step: 1,
//       };
//       l.activities[2].problems[0].response_area = {
//         type: "multiple_choice",
//         choices: ["$\\frac{1}{2}$", "$\\frac{3}{4}$", "$1$", "$\\sqrt{2}$"],
//         layout: "two_column",
//       };
//       setLesson(l);
// }
