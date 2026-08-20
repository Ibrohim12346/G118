import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";
import "./admin/styles/base.css";
import "./admin/styles/components.css";
import "./admin/styles/layout.css";
import "./admin/styles/pages.css";
import "./admin/styles/auth.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);