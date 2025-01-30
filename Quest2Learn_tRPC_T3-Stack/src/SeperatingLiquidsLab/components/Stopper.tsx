import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps } from "@react-three/fiber";

// Define the props type if needed, extend it based on the properties you pass to the Stopper
interface StopperProps extends GroupProps {
  position?: [number, number, number];
  scale?: number;
  opacity?: number;
  // Add any other props you might pass to the Stopper component
}

export const Stopper = forwardRef<THREE.Object3D, StopperProps>((props, ref) => {
  const beaker = useGLTF("./stopper_1003.gltf"); // Load the model
  const clonedScene = beaker.scene.clone(); // Clone the scene for isolated use

  return (
    <primitive
      {...props}
      object={clonedScene}
      ref={ref} // Forward the ref here
    />
  );
});

useGLTF.preload("./stopper_1003.gltf");
