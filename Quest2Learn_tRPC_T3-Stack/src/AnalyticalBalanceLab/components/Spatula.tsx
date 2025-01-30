import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import { GroupProps } from "@react-three/fiber";

export const Spatula = forwardRef<Object3D, GroupProps>((props, ref) => {
  const spatula = useGLTF("./spatula.gltf");
  const clonedScene = spatula.scene.clone(); // Clone the scene for isolated use

  return <primitive {...props} object={clonedScene} ref={ref as any} />;
});

useGLTF.preload("./spatula.gltf");
