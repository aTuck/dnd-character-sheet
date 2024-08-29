import React, { useState, useEffect, useMemo, useRef, memo } from "react";
import Model from "./Model";
import { TextureLoader } from "three";
// @ts-ignore
import { STLLoader } from "../../statics/STLLoader";
import * as THREE from "three";
import { nanoid } from "nanoid";
// @ts-ignore
import { TextGeometry } from "../../statics/TextGeometry";
// @ts-ignore
import { FontLoader } from "../../statics/FontLoader";

interface SpellCard3dModelProps {
  sendModelToParent?: (modelId: string, modelRef: THREE.Group | null) => void;
}

const SpellCard3dModel: React.FC<SpellCard3dModelProps> = memo(
  ({ sendModelToParent }) => {
    const modelId = useMemo(() => `spell-card-${nanoid(8)}`, []);
    const modelRef = useRef<THREE.Group | null>(null);

    const [geometry, setGeometry] = useState<THREE.BoxGeometry | null>(null);
    const [texture, setTexture] = useState<THREE.Texture>();
    const [textMesh, setTextMesh] = useState<THREE.Mesh | null>(null);

    useEffect(() => {
      const spellSlotGeometry = new THREE.BoxGeometry(65, 80, 0.5);

      const scaleU = 1;
      const scaleV = 1;
      const translateU = 0.5;
      const translateV = 0.5;

      const uvAttribute = spellSlotGeometry.attributes.uv;
      for (let i = 0; i < uvAttribute.count; i++) {
        const u = uvAttribute.getX(i);
        const v = uvAttribute.getY(i);

        uvAttribute.setXY(i, u * scaleU + translateU, v * scaleV + translateV);
      }
      uvAttribute.needsUpdate = true; // Mark the attribute as needing an update

      setGeometry(spellSlotGeometry);

      const textureLoader = new TextureLoader();
      textureLoader.load("./textures/healing-word.png", (loadedTexture) => {
        loadedTexture.repeat.set(2, 4);
        setTexture(loadedTexture);
        console.log(`${modelId}: loaded texture`, loadedTexture);
      });

      const fontLoader = new FontLoader();
      // @ts-ignore
      fontLoader.load("./textures/helvetiker_regular.typeface.json", (font) => {
        const textGeometry = new TextGeometry(modelId, {
          font: font,
          size: 4,
          height: 1,
          curveSegments: 12,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(textGeometry, textMaterial);
        mesh.position.set(-30, 0, 1); // Adjust the position as needed
        setTextMesh(mesh);
      });
    }, [modelId]);

    useEffect(() => {
      sendModelToParent?.(modelId, modelRef.current);
    }, [geometry, texture, modelId, sendModelToParent]);

    return (
      <>
        {geometry && (
          <group ref={modelRef}>
            <Model geometry={geometry} texture={texture} />
            {textMesh && <primitive object={textMesh} />}
          </group>
        )}
      </>
    );
  }
);

export default SpellCard3dModel;
