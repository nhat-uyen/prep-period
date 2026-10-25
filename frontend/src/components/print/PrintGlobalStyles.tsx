import { GlobalStyles } from "@mui/material";
import type { PrintSettings } from "../../types/print";
import { getGlobalStyles } from "./printStyles";

export default function PrintGlobalStyles({ paper }: { paper: PrintSettings["paper"] }) {
  return <GlobalStyles styles={getGlobalStyles(paper)} />;
}