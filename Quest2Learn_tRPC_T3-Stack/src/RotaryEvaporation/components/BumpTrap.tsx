import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function BumpTrap(props: any) {
  const beaker = useGLTF("./bump trap.gltf"); // This needs to be replaced by the correct model.
  const clonedScene = beaker.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      scale={3}
      opacity={0.8}
    />
  );
}

useGLTF.preload("./bump trap.gltf");