"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "unset",
  },
  palette: {
    primary: {
      50: "#8ab987",
      100: "#73ab6e",
      200: "#5b9d56",
      300: "#2c8126",
      400: "#15730e",
      500: "#115c0b",
      600: "#0f510a",
      700: "#0d4508",
      800: "#0b3a07",
      900: "#082e06",
      main: "#15730e",
      dark: "#0d4508",
      light: "#448f3e",
    },
  },
});

export default theme;
