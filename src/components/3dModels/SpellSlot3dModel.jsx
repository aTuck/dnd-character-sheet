import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";

import Model from "./Model";

const SpellSlot3dModel = forwardRef(({ position, isGlowing }, ref) => {
  const modelId = useMemo(() => `spell-slot-${uuidv4()}`, []);
  const modelRef = useRef();
  useImperativeHandle(ref, () => modelRef.current);

  const [geometry, setGeometry] = useState();
  const [texture, setTexture] = useState();

  useEffect(() => {
    const spellSlotGeometry = new THREE.BoxGeometry(75, 90, 12);

    const uvAttribute = spellSlotGeometry.attributes.uv;
    for (let i = 0; i < uvAttribute.count; i++) {
      const u = uvAttribute.getX(i);
      const v = uvAttribute.getY(i);

      // Modify UV coordinates
      uvAttribute.setXY(i, u * 0.4 + 1, v * 0.2 + 1.25); // Example adjustment
    }
    uvAttribute.needsUpdate = true; // Mark the attribute as needing an update

    setGeometry(spellSlotGeometry);

    const textureLoader = new TextureLoader();
    textureLoader.load("./textures/spell-slot.png", (texture) => {
      texture.repeat.set(2, 4);
      setTexture(texture);
      console.log(`${modelId}: loaded texture`, texture);
    });
  }, []);

  return (
    <>
      {geometry && (
        <group ref={modelRef} position={position || [0, 0, 0]}>
          <Model geometry={geometry} texture={texture} isGlowing={isGlowing} />
        </group>
      )}
    </>
  );
});

export default SpellSlot3dModel;
