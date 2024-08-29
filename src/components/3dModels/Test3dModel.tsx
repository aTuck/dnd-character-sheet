import React, { useState, useEffect, useRef } from "react";
import Model from "./Model";
import { TextureLoader } from "three";
// @ts-ignore
import { STLLoader } from "../../statics/STLLoader";
import { useFrame, useThree } from "@react-three/fiber";
// @ts-ignore
import { getParticleSystem } from "../../getParticleSystem";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

interface Test3dModelProps {
  position: [number, number, number];
}

const Test3dModel: React.FC<Test3dModelProps> = ({ position }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [fireTexture, setFireTexture] = useState<THREE.Texture | null>(null);
  const emitterRef = useRef<THREE.Group | null>(null);
  const fireEffectRef = useRef<any>(null); // If possible, type this more specifically
  const starsRef = useRef<THREE.Points | null>(null);
  const { scene, camera } = useThree();

  useEffect(() => {
    const loader = new STLLoader();
    // @ts-ignore
    loader.load("./geometries/test.stl", (geo) => {
      setGeometry(geo);
      console.log("loaded stl geometry", geo);
    });

    const textureLoader = new TextureLoader();
    textureLoader.load("./textures/fire.png", (texture) => {
      setFireTexture(texture);
      fireEffectRef.current = getParticleSystem({
        emitter: emitterRef.current,
        parent: scene,
        camera: camera,
        rate: 10,
        texture: texture,
      });
      console.log(texture);
    });
  }, [camera, scene]);

  useFrame(() => {
    if (fireEffectRef.current) {
      fireEffectRef.current.update(0.016);
    }

    if (starsRef.current) {
      starsRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={emitterRef} position={position}>
      {geometry && <Model geometry={geometry} />}
      <Stars
        ref={starsRef}
        radius={15}
        depth={1}
        count={5000}
        factor={4}
        saturation={1}
      />
    </group>
  );
};

export default Test3dModel;
