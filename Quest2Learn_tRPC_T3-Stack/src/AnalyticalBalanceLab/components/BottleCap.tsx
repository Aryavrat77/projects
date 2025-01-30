import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function BottleCap(props: any) {
  const beaker = useGLTF("./sample bottle cap.gltf");
  const clonedScene = beaker.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      scale={1.3}
      opacity={0.8}
      rotation-y={[3.14/180 * 90]}
    />
  );
}

useGLTF.preload("./sample bottle cap.gltf")