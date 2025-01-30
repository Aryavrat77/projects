import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function OrganicProductBeaker(props: any) {
  const beaker = useGLTF("./beaker with original solution.glb"); // This needs to be replaced by the correct model.
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

useGLTF.preload("./beaker with original solution.glb");