import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontSize: "16px",
              padding: "16px 20px",
              minWidth: "280px",
              borderRadius: "12px",
            },
          }}
          reverseOrder={false}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
