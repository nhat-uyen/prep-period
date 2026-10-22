import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getLessonByID } from "../api/lessons";
import PrintGlobalStyles from "../components/prints/PrintGlobalStyles";
import PrintLessonView from "../components/prints/PrintLessonView";
import type { Lesson } from "../types/lesson";

export default function PrintLesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getLessonByID(Number(id)).then(setLesson);
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
      <PrintGlobalStyles />
      {lesson !== null && <PrintLessonView lesson={lesson} />}
    </div>
  );
}


// Testing example:
// .then((l) => {
//       // TEMP: remove after testing
//       l.activities[0].problems[0].response_area = {
//         type: "grid", xMin: -5, xMax: 5, yMin: -5, yMax: 5, step: 1, showAxes: true,
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
