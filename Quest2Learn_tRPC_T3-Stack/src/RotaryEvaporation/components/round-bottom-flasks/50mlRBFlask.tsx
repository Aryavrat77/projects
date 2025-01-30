import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function FiftyMLFlask(props: any) {
  const beaker = useGLTF("./round-bottomed flask 50ml.gltf"); // This needs to be replaced by the correct model.
  const clonedScene = beaker.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      scale={.8}
      opacity={0.8}
    />
  );
}

useGLTF.preload("./round-bottomed flask 50ml.gltf");