import React, { useState, useEffect } from "react";
import Model from "./Model";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

function Test3dModel() {
  const [geometry, setGeometry] = useState();
  const [texture, setTexture] = useState();

  useEffect(() => {
    const loader = new STLLoader();
    loader.load("./geometries/test.stl", (geo) => {
      setGeometry(geo);
      console.log("loaded stl geometry", geo);
    });
  }, []);

  return <>{geometry && <Model geometry={geometry} texture={texture} />}</>;
}

export default Test3dModel;
