import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import muiTheme from "./theme.mui";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material";

const fontSans = Outfit({
  // Google Font
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Hazari - A Card Game",
  description:
    "Hazari is a card game that you can play with your friends online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.className} antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
