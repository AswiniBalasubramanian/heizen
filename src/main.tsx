import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TemplateProvider } from "./store";
import { AnnotationProvider } from "./store";
import { ToastProvider } from "./toast";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TemplateProvider>
        <AnnotationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AnnotationProvider>
      </TemplateProvider>
    </BrowserRouter>
  </React.StrictMode>
);
