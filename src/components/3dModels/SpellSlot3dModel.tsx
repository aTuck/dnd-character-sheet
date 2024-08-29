import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { TextureLoader } from "three";
import { nanoid } from "nanoid";
import * as THREE from "three";
import { Html } from "@react-three/drei";

import Model from "./Model";

interface SpellSlot3dModelProps {
  onCast?: (modelId: string, slotLevel: number) => void;
  sendSlotModelToParent?: (modelId: string, modelRef: THREE.Group) => void;
  position?: [number, number, number];
  checkIsGlowing?: (modelId: string) => boolean;
  checkRenderCastButton?: (modelId: string) => boolean;
  slotLevel?: number;
}

const SpellSlot3dModel = forwardRef<THREE.Group, SpellSlot3dModelProps>(
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
    const modelRef = useRef<THREE.Group | null>(null);
    useImperativeHandle(ref, () => modelRef.current!);

    const [geometry, setGeometry] = useState<THREE.BoxGeometry | null>(null);
    const [texture, setTexture] = useState<THREE.Texture | undefined>();

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
      textureLoader.load("./textures/spell-slot.png", (loadedTexture) => {
        loadedTexture.repeat.set(2, 4);
        setTexture(loadedTexture);
        console.log(`${modelId}: loaded texture`, loadedTexture);
      });
    }, [modelId]);

    useEffect(() => {
      console.log('sending mdoel to parent"');
      console.log(modelId, modelRef.current);
      sendSlotModelToParent &&
        sendSlotModelToParent(modelId, modelRef.current!);
    }, [geometry, texture, modelId]);

    return (
      <>
        {geometry && (
          <group ref={modelRef} position={position}>
            <Model
              geometry={geometry}
              texture={texture}
              isGlowing={checkIsGlowing && checkIsGlowing(modelId)}
            />
            {checkRenderCastButton && checkRenderCastButton(modelId) && (
              <Html position={[0, 2, 0]}>
                <button
                  onClick={() => onCast && onCast(modelId, slotLevel || 0)}
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

SpellSlot3dModel.displayName = "SpellSlot3dModel";

export default SpellSlot3dModel;
