import React, { useState, useEffect, useRef } from "react";
import Model from "./Model";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { getParticleSystem } from "../../getParticleSystem";
import { Stars } from "@react-three/drei";

function Test3dModel({ position }) {
  const [geometry, setGeometry] = useState();
  const [fireTexture, setFireTexture] = useState();
  const emitterRef = useRef();
  const fireEffectRef = useRef();
  const starsRef = useRef();
  const { scene, camera } = useThree();

  useEffect(() => {
    const loader = new STLLoader();
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
  }, []);

  useFrame(() => {
    if (fireEffectRef.current) {
      fireEffectRef.current.update(0.016);
      // console.log(fireEffectRef.current);
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
}

export default Test3dModel;
