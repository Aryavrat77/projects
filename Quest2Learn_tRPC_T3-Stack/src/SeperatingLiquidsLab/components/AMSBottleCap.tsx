import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import { GroupProps } from "@react-three/fiber";

export const AMSBottleCap = forwardRef<Object3D, GroupProps>((props, ref) => {
  const bottleCap = useGLTF("./anhydrous magnesium sulfate bottle cap.gltf");
  const clonedScene = bottleCap.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      ref={ref}
      scale={1.3}
      opacity={0.8}
      rotation-y={[3.14 / 180 * 90]}
    />
  );
});

useGLTF.preload("./anhydrous magnesium sulfate bottle cap.gltf");
