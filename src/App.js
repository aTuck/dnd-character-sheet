import "./App.css";
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "@react-three/drei";

function App() {
  const [geometry, setGeometry] = useState();

  useEffect(() => {
    const loader = new STLLoader();
    loader.load("./test.stl", (geo) => {
      setGeometry(geo);
      console.log("loaded stl geometry", geo);
    });
  }, []);

  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(-2);
  const [rotationZ, setRotationZ] = useState(0);

  const handleRotationXChange = (event) => {
    setRotationX(event.target.value);
  };

  const handleRotationYChange = (event) => {
    setRotationY(event.target.value);
  };

  const handleRotationZChange = (event) => {
    setRotationZ(event.target.value);
  };

  return (
    <div
      id="canvas-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        paddingLeft: "20%",
        paddingRight: "20%",
        background:
          "linear-gradient(red, red) top left / 20% 100%, linear-gradient(red, red) top right / 20% 100%, linear-gradient(red, red) bottom left / 20% 100%, linear-gradient(red, red) bottom right / 20% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 0, 100% 0, 0 100%, 100% 100%",
      }}
    >
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <label htmlFor="rotationX">Rotation X:</label>
        <input
          type="range"
          id="rotationX"
          name="rotationX"
          min={-Math.PI}
          max={Math.PI}
          step={0.1}
          value={rotationX}
          onChange={handleRotationXChange}
        />
        <span>{rotationX}</span>
      </div>
      <div style={{ position: "absolute", top: "40px", left: "10px" }}>
        <label htmlFor="rotationY">Rotation Y:</label>
        <input
          type="range"
          id="rotationY"
          name="rotationY"
          min={-Math.PI}
          max={Math.PI}
          step={0.1}
          value={rotationY}
          onChange={handleRotationYChange}
        />
        <span>{rotationY}</span>
      </div>
      <div style={{ position: "absolute", top: "70px", left: "10px" }}>
        <label htmlFor="rotationZ">Rotation Z:</label>
        <input
          type="range"
          id="rotationZ"
          name="rotationZ"
          min={-Math.PI}
          max={Math.PI}
          step={0.1}
          value={rotationZ}
          onChange={handleRotationZChange}
        />
        <span>{rotationZ}</span>
      </div>
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 5, 5]} />
        <directionalLight color="white" position={[5, 5, 5]} />
        <directionalLight color="white" position={[5, 0, 5]} />
        <directionalLight color="white" position={[0, 5, 5]} />
        <mesh
          rotation={[rotationX, rotationY, rotationZ]}
          position={[0, -20, -45]}
        >
          <primitive object={geometry} />
          <meshStandardMaterial color="#cccccc" />
          <OrbitControls />
        </mesh>
      </Canvas>
    </div>
  );
}

export default App;
