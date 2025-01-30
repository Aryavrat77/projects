import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function RBFlaskWithEvaporatedProduct(props: any) {
  const beaker = useGLTF("./rb flask with evaporated product.glb"); // This needs to be replaced by the correct model.
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

useGLTF.preload("./rb flask with evaporated product.glb");