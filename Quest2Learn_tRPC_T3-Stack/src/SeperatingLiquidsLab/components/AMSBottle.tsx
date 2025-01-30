import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface HundredMLFlaskWithFillAnimationProps {
  startAnimationDelay?: number; // Delay in seconds
  [key: string]: any; // To allow for other props like position, scale, etc.
}

export function AMSBottle({ startAnimationDelay = 0, ...props }: HundredMLFlaskWithFillAnimationProps) {
  const { scene, animations } = useGLTF("./bottle body.gltf");
  const clonedScene = scene.clone(); 
  return (
    <primitive {...props} object={clonedScene} scale={1} opacity={0.8} />
  );
}
// anhydrous magnesium sulfate bottle cap.gltf
useGLTF.preload("./bottle body.gltf");
