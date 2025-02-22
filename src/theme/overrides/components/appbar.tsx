import { Theme } from "@mui/material/styles";
import shadows from "@mui/material/styles/shadows";

// ----------------------------------------------------------------------

export function appBar(theme: Theme) {
  return {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // boxShadow: "none",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: theme?.palette.background.paper || "white",
          color: theme?.palette.text.primary || "black",
        },
      },
    },
  };
}
