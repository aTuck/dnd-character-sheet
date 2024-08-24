import React, { useState, useEffect, useMemo, useRef } from "react";
import Model from "./Model";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { useModelRegistry } from "../../hooks/useModelRegistry";
import { v4 as uuidv4 } from "uuid";
import { groupBy } from "lodash";

function SpellCard3dModel() {
  const modelRef = useRef();
  const modelId = useMemo(() => `spell-card-${uuidv4()}`, []);
  const [model, setModel] = useModelRegistry(modelId);

  const [geometry, setGeometry] = useState();
  const [texture, setTexture] = useState();

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

    setModel(modelId, modelRef.current);
  }, []);

  useEffect(() => {
    // setModel(modelId, modelRef.current);
  }, [geometry, texture, modelId, setModel]);

  return (
    <>
      {geometry && (
        <Model ref={modelRef} geometry={geometry} texture={texture} />
      )}
    </>
  );
}

export default SpellCard3dModel;
