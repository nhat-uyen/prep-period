import { Box, Typography } from "@mui/material";
import type { Lesson } from "../../types/lesson";
import { getPageSx, getProblemsSx, printSx } from "./printStyles";
import MathText from "../MathText";
import ResponseAreaRenderer from "./ResponseAreaRenderer";
import type { WorkSheetItem, PrintSettings, WorksheetLayout } from "../../types/print";
import { DEFAULT_PRINT_SETTINGS } from "./printSettings";
import { useMemo } from "react";
import { buildDefaultLayout, buildProblemIndex, groupItems } from "../../types/worksheetLayout";

interface Props {
  lesson: Lesson;
  settings?: PrintSettings;
  layout?: WorksheetLayout;
}

export default function PrintLessonView({ lesson, settings = DEFAULT_PRINT_SETTINGS, layout }: Props) {
  const { header, show_answers } = settings;
  const showHeader = header.name || header.date || header.period;

  const resolved = useMemo(() => layout ?? buildDefaultLayout(lesson), [layout, lesson]);
  const problems = useMemo(() => buildProblemIndex(lesson), [lesson]);
  const groups = useMemo(() => groupItems(resolved.items), [resolved])

  // Problems are numbered continuosly across the worksheet
  // References to deleted problems are skipped and don't use up a number
  const numbers = useMemo(() => {
    const map = new Map<WorkSheetItem, number>();
    let n = 0;
    for (const item of resolved.items) {
      if (item.kind === "problem" && problems.has(item.problem_id)) map.set(item, ++n);
    }
    return map;
  }, [resolved, problems])

  const renderFlowItem = (item: WorkSheetItem, i: number) => {
    if (item.kind === "problem") {
      const problem = problems.get(item.problem_id);
      if (!problem) return null;
      return (
        <Box key={i} sx={printSx.problem}>
          <Box sx={printSx.problemRow}>
            <strong>{numbers.get(item)}</strong>
            <Box>
              <MathText>{problem.question}</MathText>
              {problem.instructions && <MathText>{problem.instructions}</MathText>}
            </Box>
          </Box>
          <ResponseAreaRenderer area={item.response_area ?? problem.response_area} />
          {show_answers && (
            <Box sx={printSx.answer}>
              <strong>Answer:</strong>
              <MathText>{problem.answer}</MathText>
            </Box>
          )}
        </Box>
      );
    }
    if (item.kind === "block") {
      return (
        <Box key={i} sx={printSx.problem}>
          <ResponseAreaRenderer area={item.area} />
          {item.caption && (
            <Box sx={printSx.caption}>
              <MathText>{item.caption}</MathText>
            </Box>
          )}
        </Box>
      );
    }
    return null;
  }

  const renderSingle = (item: WorkSheetItem) => {
    switch (item.kind) {
      case "text":
        return item.variant === "heading" ? (
          <Typography variant="h6" component="h2" sx={printSx.activityTitle}>
            <MathText>{item.markdown}</MathText>
          </Typography>
        ) : (
          <MathText>{item.markdown}</MathText>
        );
      case "page_break":
        return <Box sx={printSx.pageBreak} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={getPageSx(settings)}>
      {showHeader && (
        <Box sx={printSx.header}>
          {header.name && <span>Name:_____________________________</span>}
          {header.date && <span>Date:________________</span>}
          {header.period && <span>Period:_________</span>}
        </Box>
      )}

      <Typography variant="h5" component="h1" gutterBottom>
        {lesson.title}
        {show_answers && (
          <Box component="span" sx={printSx.answerKeyLabel}>Answer key</Box>
        )}
      </Typography>

      {groups.map((group, gi) =>
        group.kind === "flow"
          ? (<Box key={gi} sx={getProblemsSx(settings)}>
            {group.items.map(renderFlowItem)}
          </Box>)
          : (<Box key={gi}>{renderSingle(group.item)}</Box>)
      )}
    </Box>
  );
}