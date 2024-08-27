import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import Model from "./Model";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { nanoid } from "nanoid";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

const SpellCard3dModel = memo(({ sendModelToParent }) => {
  const modelId = useMemo(() => `spell-card-${nanoid(8)}`, []);
  const modelRef = useRef();

  const [geometry, setGeometry] = useState();
  const [texture, setTexture] = useState();
  const [textMesh, setTextMesh] = useState();

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
    textureLoader.load("./textures/healing-word.png", (texture) => {
      texture.repeat.set(2, 4);
      setTexture(texture);
      console.log(`${modelId}: loaded texture`, texture);
    });

    const fontLoader = new FontLoader();
    fontLoader.load("./textures/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry(modelId, {
        font: font,
        size: 4,
        depth: 1,
        curveSegments: 12,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const mesh = new THREE.Mesh(textGeometry, textMaterial);
      mesh.position.set(-30, 0, 1); // Adjust the position as needed
      setTextMesh(mesh);
    });
  }, [modelId, modelRef]);

  useEffect(() => {
    sendModelToParent(modelId, modelRef.current);
  }, [geometry, texture, modelId, modelRef]);

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
});

export default SpellCard3dModel;
