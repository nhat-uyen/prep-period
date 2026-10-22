import type { SxProps, Theme } from "@mui/material";

// Page-wide rules (@page can't live in sx, so it stays in a global stylesheet)
export const printGlobalStyles = {
  "@page": { size: "letter", margin: "0.75in" },
  body: { background: "#fff", color: "#000" },
};

// Per-element styles used by PrintLessonView
export const printSx = {
  page: { maxWidth: "7in", mx: "auto", p: 2, fontSize: "12pt", lineHeight: 1.5 },
  header: { display: "flex", justifyContent: "space-between", mb: 2 },
  activity: { mb: 3 },
  activityTitle: { breakAfter: "avoid" },
  problem: { breakInside: "avoid", mb: "1.25rem" },
  problemRow: { display: "flex", gap: 1 },
  workspace: { height: "1.2in" },
  answer: { color: "#555" },
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
} satisfies Record<string, SxProps<Theme>>;