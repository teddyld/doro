import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <App />
    </NextThemesProvider>
  </React.StrictMode>,
);
