import React, { useState, useEffect } from "react";
import Model from "./Model";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

function SpellSlot3dModel() {
  const [geometry, setGeometry] = useState();
  const [texture, setTexture] = useState();

  useEffect(() => {
    const loader = new STLLoader();
    loader.load("./test.stl", (geo) => {
      const spellSlotGeometry = new THREE.BoxGeometry(125, 180, 12);
      setGeometry(spellSlotGeometry);
      console.log("loaded stl geometry", geo);
    });

    const textureLoader = new TextureLoader();
    textureLoader.load("./textures/sword.png", (texture) => {
      setTexture(texture);
      console.log("loaded texture", texture);
    });
  }, []);

  return <>{geometry && <Model geometry={geometry} texture={texture} />}</>;
}

export default SpellSlot3dModel;
