import React from "react";
import ReactDOM from "react-dom/client";  // Change this import
import App from "./App";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));  // Create the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
