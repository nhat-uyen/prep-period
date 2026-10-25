import type { SxProps, Theme } from "@mui/material";
import type { PrintSettings } from "../../types/print";

const FONT_SIZES = { small: "10.5pt", medium: "12pt", large: "14pt" } as const;

const SPACING = {
  compact: { lineHeight: 1.35, problemGap: "0.75rem", workspace: "0.8in" },
  normal: { lineHeight: 1.5, problemGap: "1.25rem", workspace: "1.2in" },
  roomy: { lineHeight: 1.65, problemGap: "1.75rem", workspace: "1.8in" },
} as const;

const PAGE_WIDTH = { letter: "7in", a4: "172mm" } as const;

// Page-wide rules (@page can't live in sx, so it stays in a global stylesheet)
export function getGlobalStyles(paper: PrintSettings["paper"]) {
  return {
    "@page": { size: paper === "a4" ? "A4" : "letter", margin: "0.75in" },
    body: { background: "#fff", color: "#000" },
  };
}

export function getPageSx(settings: PrintSettings): SxProps<Theme> {
  const space = SPACING[settings.spacing] ?? SPACING.normal;
  return {
    maxWidth: PAGE_WIDTH[settings.paper] ?? PAGE_WIDTH.letter,
    mx: "auto",
    p: 2,
    fontSize: FONT_SIZES[settings.font_size] ?? FONT_SIZES.medium,
    lineHeight: space.lineHeight,
    "--print-problem-gap": space.problemGap,
    "--print-workspace-height": space.workspace,
  } as SxProps<Theme>;
}

export function getProblemsSx(settings: PrintSettings): SxProps<Theme> {
  return settings.columns === 2 ? { columnCount: 2, columnGap: "0.4in" } : {};
}

// Per-element styles used by PrintLessonView
export const printSx = {
  header: { display: "flex", justifyContent: "space-between", gap: 2, mb: 2 },
  activity: { mb: 3 },
  activityTitle: { breakAfter: "avoid" },
  problem: { breakInside: "avoid", mb: "var(--print-problem-gap, 1.25em)" },
  problemRow: { display: "flex", gap: 1 },
  workspace: { height: "var(--print-workspace-height, 1.2in)" },
  answer: { color: "#555", display: "flex", gap: 1 },
  answerKeyLabel: { ml: 2, fontSize: "0.6em", fontWeight: 600, color: "#555", textTransform: "uppercase" },
  writingLine: { borderBottom: "1px solid #999", height: "1.8em" },
  gridWrap: { mt: 1, mb: 1 },
  // tableLayout: fixed --- gives columns equal widths and lets long headers wrap instead of stretching the table.
  table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed", my: 1, },
  tableHeadCell: {
    border: "1px solid #000",
    borderBottomWidth: "2px",
    backgroundColor: "#f0f0f0",
    p: "4px 8px",
    fontWeight: 600,
    textAlign: "center",
    // Below: there because Markdown renderers wrap text in <p>, which adds margins that would blow up your row heights. If MathText doesn’t produce paragraphs, it’s harmless.
    "& p": { m: 0 },
  },
  tableRow: { breakInside: "avoid" },
  tableCell: {
    border: "1px solid #000",
    height: "0.45in",
    p: "4px 8px",
    textAlign: "center",
    verticalAlign: "middle",
    "& p": { m: 0 },
  },
  numberLineWrap: { mt: 1, mb: 1 },
  choices: { mt: 0.5, mb: 1 },
  choice: { display: "flex", gap: 1, mb: 0.5, breakInside: "avoid" },
  choiceLabel: { fontWeight: 600, minWidth: "1.5em" },
  pageBreak: { breakAfter: "page", height: 0 },
  caption: { fontSize: "0.85em", color: "#555", mt: 0.5 },
} satisfies Record<string, SxProps<Theme>>;