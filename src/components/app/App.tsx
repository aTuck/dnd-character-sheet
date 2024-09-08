import "./App.css";
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";

// import SpellCard from "../spells/SpellCard";
import Test3dModel from "../3dModels/Test3dModel";
import SpellSlot3dModel from "../3dModels/SpellSlot3dModel";
import Draggable from "../Draggable";
import SpellCard3dModel from "../3dModels/SpellCard3dModel";
import { useCharacter } from "../../hooks/useCharacter";
import * as THREE from "three";
// @ts-ignore
import SpellGroup from "../SpellGroup";
import SpellCard from "../SpellCard";
import SpellSlot from "../SpellSlot";
import { Character } from "../../types/Character";
import PlayerSetting from "../PlayerSetting";
import SpellCardFace from "../spells/SpellCardFace";
// @ts-ignore

function App() {
  const characterContext = useCharacter();
  const character: Character = characterContext.character!;
  const SpellSlots = Object.values(
    character?.spellcasting?.spell_slots || {}
  ).flatMap((slot, slotLevelIndex) => {
    console.log(slot);
    return Array.from({ length: slot.total }, (_, slotIndex) => (
      <SpellSlot>
        <SpellSlot3dModel
          key={`${slotLevelIndex}-${slotIndex}`}
          slotLevel={slot.slot_level}
          position={[90 * slotLevelIndex, 0, 0]}
        />
      </SpellSlot>
    ));
  });
  console.log(SpellSlots);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* <PlayerSetting character={character} /> */}
      <SpellCardFace />
      {/* <div
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
          <SpellGroup>
            <SpellCard>
              <Draggable rotatesWithCursor>
                <SpellCard3dModel />
              </Draggable>
            </SpellCard>
            {SpellSlots}
          </SpellGroup>
          <Stats />
        </Canvas>
      </div> */}
    </div>
  );
}

export default App;
