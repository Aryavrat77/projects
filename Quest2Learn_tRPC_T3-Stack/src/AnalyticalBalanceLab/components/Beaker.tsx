import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function Beaker(props: any) {
  const beaker = useGLTF("./Beaker.gltf");
  const clonedScene = beaker.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      scale={10}
      opacity={0.8}
    />
  );
}

useGLTF.preload("./Beaker.gltf");