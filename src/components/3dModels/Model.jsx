import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Model({ geometry, texture }) {
  return (
    <>
      <mesh>
        <bufferGeometry attach="geometry" {...geometry} />
        <meshStandardMaterial attach="material" map={texture} />
      </mesh>
    </>
  );
}

export default Model;
