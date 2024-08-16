import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
import Spell from "./Spell";

function Model({ geometry, texture, isFlipped }) {
  const spriteRef = useRef();
  const meshRef = useRef();
  const tempPosition = new THREE.Vector3([123, 321, 123]);

  const { rotationY } = useSpring({
    rotationY: isFlipped ? Math.PI : 0,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  useFrame(() => {
    if (geometry && spriteRef.current && meshRef.current) {
      // Extract the position of the first vertex
      const positionAttribute = geometry.attributes.position;
      tempPosition.fromBufferAttribute(positionAttribute, 0);
      tempPosition.applyMatrix4(meshRef.current.matrixWorld);

      // Set the sprite's position to this vertex position
      spriteRef.current.position.copy(tempPosition);
    }
  });
  return (
    <>
      {texture && (
        <sprite ref={spriteRef} scale={[20, 20, 1]}>
          <spriteMaterial map={texture} />
        </sprite>
      )}
      <a.mesh rotation-y={rotationY}>
        <primitive object={geometry} />
        <meshStandardMaterial color="#cccccc" />
      </a.mesh>
    </>
  );
}

function App() {
  const [geometry, setGeometry] = useState();
  const [texture, setTexture] = useState();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load("./test.stl", (geo) => {
      setGeometry(geo);
      console.log("loaded stl geometry", geo);
    });

    const textureLoader = new TextureLoader();
    textureLoader.load("./textures/sword.png", (texture) => {
      setTexture(texture);
      console.log("loaded texture", texture);
    });
  }, []);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
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
        <button onClick={toggleFlip}>
          {isFlipped ? "Face Camera" : "Face Away"}
        </button>
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
        <Spell />
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
          {geometry && (
            <Model
              geometry={geometry}
              texture={texture}
              isFlipped={isFlipped}
            />
          )}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
