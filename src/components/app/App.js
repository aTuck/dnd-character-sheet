import "./App.css";
import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";

import SpellCard from "../spells/SpellCard";
import Test3dModel from "../3dModels/Test3dModel";
import SpellSlot3dModel from "../3dModels/SpellSlot3dModel";
import Draggable from "../Draggable";
import Slottable from "../Slottable";
import SpellCard3dModel from "../3dModels/SpellCard3dModel";

import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SlotGroup from "../SlotGroup";
import SlotItem from "../SlotItem";
import SlotSlot from "../SlotSlot";

function App() {
  const [isGlowing, setIsGlowing] = useState(false);

  const handleSlot = (card, slot) => {
    console.log("Card slotted!", card, slot);
  };

  const handleHoveringEffect = (object) => {
    setIsGlowing(true);
  };

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
          width: "1920px",
          height: "1080px",
          margin: "auto",
          position: "relative",
          zIndex: "0",
        }}
      >
        <Canvas
          orthographic
          camera={{
            zoom: 5, // Adjust zoom to control the size of objects
            position: [0, 0, 100], // Position the camera to look directly at the origin
            near: 0.1,
            far: 1000,
          }}
          style={{ border: "1px solid black" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight color="white" position={[0, 5, 5]} />
          <directionalLight color="white" position={[5, 5, 5]} />
          <directionalLight color="red" position={[5, 0, 5]} />
          <directionalLight color="blue" position={[0, 5, 5]} />
          <SlotGroup>
            <SlotItem>
              <Draggable rotatesWithCursor position={[20, 0, 0]}>
                <SpellCard3dModel />
              </Draggable>
            </SlotItem>
            <SlotItem>
              <Draggable rotatesWithCursor position={[100, 0, 0]}>
                <SpellCard3dModel />
              </Draggable>
            </SlotItem>
            <SlotItem>
              <Draggable rotatesWithCursor>
                <SpellCard3dModel />
              </Draggable>
            </SlotItem>
            <SlotSlot>
              <SpellSlot3dModel />
            </SlotSlot>
            <SlotSlot>
              <SpellSlot3dModel position={[100, -50, 0]} />
            </SlotSlot>
            <SlotSlot>
              <SpellSlot3dModel position={[100, 50, 0]} />
            </SlotSlot>
          </SlotGroup>
          <Test3dModel position={[-100, 0, 0]} />
          <Stats />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
