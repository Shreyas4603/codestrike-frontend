import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster, toast } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster richColors position="bottom-right" />
  </StrictMode>
);
