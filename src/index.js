import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/app/App.js";
import { SlotItemRegistryProvider } from "./hooks/useSlotItemRegistry.jsx";
import { SlotSlotRegistryProvider } from "./hooks/useSlotSlotRegistry.jsx";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SlotItemRegistryProvider>
      <SlotSlotRegistryProvider>
        <App />
      </SlotSlotRegistryProvider>
    </SlotItemRegistryProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
