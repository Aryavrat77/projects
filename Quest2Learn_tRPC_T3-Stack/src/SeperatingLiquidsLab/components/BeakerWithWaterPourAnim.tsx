import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface HundredMLFlaskWithFillAnimationProps {
  startAnimationDelay?: number; // Delay in seconds
  [key: string]: any; // To allow for other props like position, scale, etc.
}

export function WaterBeakerWithPourAnimation({ startAnimationDelay = 0, ...props }: HundredMLFlaskWithFillAnimationProps) {
  const { scene, animations } = useGLTF("./3-beaker with water in it.glb");
  const clonedScene = scene.clone(); 
  const { actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    console.log(actions);

    const timer = setTimeout(() => {
      console.log("Attempting to start animation after delay...");
      const animation = actions["Animation"];
      if (animation) {
        console.log("Playing animation...");
        animation.reset().play();
        animation.setEffectiveTimeScale(1);
        animation.setLoop(THREE.LoopOnce, 1); // Set the animation to loop only once
        animation.clampWhenFinished = true; // Ensure it clamps when finished
      }
    }, startAnimationDelay * 1000); // Convert seconds to milliseconds

    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, [startAnimationDelay, actions]);

  return (
    <primitive {...props} object={clonedScene} scale={10} opacity={0.8} />
  );
}
// 3-beaker with water in it.glb
useGLTF.preload("./3-beaker with water in it.glb");
