import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { nanoid } from "nanoid";
import * as THREE from "three";
import { Html } from "@react-three/drei";

import Model from "./Model";

const SpellSlot3dModel = forwardRef(
  (
    {
      onCast,
      sendSlotModelToParent,
      position,
      checkIsGlowing,
      checkRenderCastButton,
      slotLevel,
    },
    ref
  ) => {
    const modelId = useMemo(() => `spell-slot-${nanoid(8)}`, []);
    const modelRef = useRef();
    // useImperativeHandle(ref, () => modelRef.current);

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

    useEffect(() => {
      sendSlotModelToParent(modelId, modelRef.current);
    }, [geometry, texture, modelId, modelRef]);

    return (
      <>
        {geometry && (
          <group ref={modelRef} position={position}>
            <Model
              geometry={geometry}
              texture={texture}
              isGlowing={checkIsGlowing(modelId)}
            />
            {checkRenderCastButton(modelId) && (
              <Html position={[0, 2, 0]}>
                <button
                  onClick={() => onCast(modelId, slotLevel)}
                  style={{
                    position: "absolute",
                    top: "230px", // Position the button above the SlotSlot
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  Cast
                </button>
              </Html>
            )}
          </group>
        )}
      </>
    );
  }
);

export default SpellSlot3dModel;
