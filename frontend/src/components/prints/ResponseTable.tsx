import { Box } from "@mui/material";
import { printSx } from "./printStyles";
import MathText from "../MathText";

interface Props {
  columns: string[];
  rows: number;
  prefilled?: string[][];   // prefilled[row][col]; missing or "" means an empty cell
}

export default function ResponseTable({ columns, rows, prefilled }: Props) {
  return (
    <Box component="table" sx={printSx.table}>
      <thead>
        <tr>
          {columns.map((col, c) => (
            <Box component="th" key={c} sx={printSx.tableHeadCell}>
              <MathText>{col}</MathText>
            </Box>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, r) => (
          <Box component="tr" key={r} sx={printSx.tableRow}>
            {columns.map((_, c) => {
              const value = prefilled?.[r]?.[c] ?? "";
              return (
                <Box component="td" key={c} sx={printSx.tableCell}>
                  {value && <MathText>{value}</MathText>}
                </Box>
              );
            })}
          </Box>
        ))}
      </tbody>
    </Box>
  )
}
