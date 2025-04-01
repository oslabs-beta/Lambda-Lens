import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App/App";
import "./index.css";
import './firebaseConfig'; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
