import React, { useRef } from "react";
import { useFBX, useGLTF } from "@react-three/drei";

export function SeparatingFunnelHolder(props: any) {
  const beaker = useGLTF("./separating funnel holder.gltf"); // This needs to be replaced by the correct model.
  const clonedScene = beaker.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      scale={.9}
      opacity={0.9}
    />
  );
}

useGLTF.preload("./separating funnel holder.gltf");