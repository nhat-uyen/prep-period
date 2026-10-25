import { Box } from "@mui/material";
import type { ResponseArea } from "../../types/lesson";
import { printSx } from "./printStyles";
import CoordinateGrid from "./CoordinateGrid";
import ResponseTable from "./ResponseTable";
import MathText from "../MathText";
import NumberLine from "./NumberLine";

const BLANK_HEIGHTS = { small: "0.8in", medium: "1.5in", large: "2.5in" };

export default function ResponseAreaRenderer({ area }: { area?: ResponseArea }) {
  if (!area || area.type === "none") return <Box sx={printSx.workspace} />;

  switch (area.type) {
    case "blank":
      return <Box sx={{ height: BLANK_HEIGHTS[area.height] }} />;
    case "lines":
      return (
        <Box>
          {Array.from({ length: area.count }, (_, i) => (
            <Box key={i} sx={printSx.writingLine} />
          ))}
        </Box>
      );
    case "grid":
      return (
        <Box sx={printSx.gridWrap}>
          <CoordinateGrid
            xMin={area.x_min}
            xMax={area.x_max}
            yMin={area.y_min}
            yMax={area.y_max}
            step={area.step}
            showAxes={area.show_axes}
          />
        </Box>
      );
    case "table":
      return (
        <ResponseTable columns={area.columns} rows={area.rows} prefilled={area.prefilled} />
      );
    case "number_line":
      return (
        <Box sx={printSx.numberLineWrap}>
          <NumberLine {...area} />
        </Box>
      );
    case "multiple_choice":
      return (
        <Box sx={{ ...printSx.choices, columnCount: area.layout === "two_column" ? 2 : 1 }}>
          {area.choices.map((choice, i) => (
            <Box key={i} sx={printSx.choice}>
              <Box component="span" sx={printSx.choiceLabel}>
                {String.fromCharCode(65 + i)}.
              </Box>
              <MathText>{choice}</MathText>
            </Box>
          ))}
        </Box>
      );
    default: {
      return null;
    }
  }
}