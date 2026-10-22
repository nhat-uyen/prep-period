import { GlobalStyles } from "@mui/material";
import { printGlobalStyles } from "./printStyles";

export default function PrintGlobalStyles() {
  return <GlobalStyles styles={printGlobalStyles} />;
}