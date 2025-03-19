import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App/App";
import "./App/App.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
