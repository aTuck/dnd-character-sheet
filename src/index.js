import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/app/App";
import { SlotItemRegistryProvider } from "./hooks/useSlotItemRegistry.jsx";
import { SlotSlotRegistryProvider } from "./hooks/useSlotSlotRegistry.jsx";
import { CharacterProvider } from "./hooks/useCharacter.tsx";
import reportWebVitals from "./reportWebVitals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CharacterProvider>
      <SlotItemRegistryProvider>
        <SlotSlotRegistryProvider>
          <App />
        </SlotSlotRegistryProvider>
      </SlotItemRegistryProvider>
    </CharacterProvider>
  </React.StrictMode>
);

reportWebVitals(console.log);
