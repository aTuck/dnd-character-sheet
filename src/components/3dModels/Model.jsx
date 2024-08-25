import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

function Model({ geometry, texture, isGlowing }) {
  const { emissiveColor, emissiveIntensity } = useSpring({
    emissiveColor: isGlowing
      ? new THREE.Color(0xffd700)
      : new THREE.Color(0xffffff),
    emissiveIntensity: isGlowing ? 0.8 : 0.4,
    config: { tension: 170, friction: 26 }, // Spring configuration
  });

  return (
    <>
      <a.mesh>
        <bufferGeometry attach="geometry" {...geometry} />
        <a.meshStandardMaterial
          attach="material"
          map={texture}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </a.mesh>
    </>
  );
}

export default Model;
