import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Global tokens first so section styles can override them.
import "./styles/tokens.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
