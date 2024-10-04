import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
