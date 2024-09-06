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
// @ts-ignore

function App() {
  const characterContext = useCharacter();
  const character: Character = characterContext.character!;
  const SpellSlots = Object.values(
    character?.spellcasting.spell_slots || {}
  ).flatMap((slot, idx) => {
    console.log(slot);
    return Array.from({ length: slot.total }, (_, index) => (
      <SpellSlot>
        <SpellSlot3dModel
          key={`${idx}-${index}`}
          slotLevel={slot.slot_level}
          position={[130 * index, idx * -30, 0]}
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
      <PlayerSetting character={character} />
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
          <SpellGroup>
            <SpellCard>
              <Draggable rotatesWithCursor position={[20, 0, 0]}>
                <SpellCard3dModel />
              </Draggable>
            </SpellCard>
            <SpellCard>
              <Draggable rotatesWithCursor position={[100, 0, 0]}>
                <SpellCard3dModel />
              </Draggable>
            </SpellCard>
            <SpellCard>
              <Draggable rotatesWithCursor>
                <SpellCard3dModel />
              </Draggable>
            </SpellCard>
            {SpellSlots}
            {/* <SpellSlot>
              <SpellSlot3dModel />
            </SpellSlot>
            <SpellSlot>
              <SpellSlot3dModel position={[100, -50, 0]} />
            </SpellSlot>
            <SpellSlot>
              <SpellSlot3dModel position={[100, 50, 0]} />
            </SpellSlot> */}
          </SpellGroup>
          <Test3dModel position={[-100, 0, 0]} />
          <Stats />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
