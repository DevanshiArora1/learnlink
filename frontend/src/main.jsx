import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// src/main.jsx (CORRECTED)
import { AuthProvider } from "./context/AuthProvider"; // <-- Import the component from its own file
// and import the hook and context from the other file if needed in main.jsx.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
