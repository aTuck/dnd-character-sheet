import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

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

export default Model;
