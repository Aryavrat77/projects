import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function KeckClip(props: any) {
  const beaker = useGLTF("./keck clip.gltf"); // This needs to be replaced by the correct model.
  const clonedScene = beaker.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      scale={.2}
      opacity={0.8}
    />
  );
}

useGLTF.preload("./keck clip.gltf");