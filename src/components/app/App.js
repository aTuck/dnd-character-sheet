import "./App.css";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import SpellCard from "../spells/SpellCard";
import Test3dModel from "../3dModels/Test3dModel";
import SpellSlot3dModel from "../3DModels/SpellSlot3dModel";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "10px",
        }}
      >
        <button onClick={() => console.log("Barbarian clicked")}>
          Barbarian
        </button>
        <button onClick={() => console.log("Bard clicked")}>Bard</button>
        <button onClick={() => console.log("Cleric clicked")}>Cleric</button>
        <button onClick={() => console.log("Druid clicked")}>Druid</button>
        <button onClick={() => console.log("Fighter clicked")}>Fighter</button>
        <button onClick={() => console.log("Monk clicked")}>Monk</button>
        <button onClick={() => console.log("Paladin clicked")}>Paladin</button>
        <button onClick={() => console.log("Ranger clicked")}>Ranger</button>
        <button onClick={() => console.log("Rogue clicked")}>Rogue</button>
        <button onClick={() => console.log("Sorcerer clicked")}>
          Sorcerer
        </button>
        <button onClick={() => console.log("Warlock clicked")}>Warlock</button>
        <button onClick={() => console.log("Wizard clicked")}>Wizard</button>
        <SpellCard />
      </div>

      <div
        style={{
          width: "50%",
          height: "50%",
          margin: "auto",
          position: "relative",
          zIndex: "0",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 90] }}
          style={{ border: "1px solid black" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight color="white" position={[0, 5, 5]} />
          <directionalLight color="white" position={[5, 5, 5]} />
          <directionalLight color="white" position={[5, 0, 5]} />
          <directionalLight color="white" position={[0, 5, 5]} />
          <Test3dModel />
          <SpellSlot3dModel />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
