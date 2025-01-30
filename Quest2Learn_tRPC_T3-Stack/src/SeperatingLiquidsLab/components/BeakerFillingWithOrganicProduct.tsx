import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface HundredMLFlaskWithFillAnimationProps {
  isFilled?: boolean; // Whether the flask should be filled initially
  startAnimationDelay?: number; // Delay in seconds
  [key: string]: any; // To allow for other props like position, scale, etc.
}

export function BeakerFillWithOrganicLayer({ isFilled = false, startAnimationDelay = 0, ...props }: HundredMLFlaskWithFillAnimationProps) {
  const { scene, animations } = useGLTF("./beaker filling with orange solution.glb");
  const clonedScene = scene.clone(); 
  const { actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    console.log(actions);

    if (isFilled) {
      // Immediately set the animation to its end state
      const animation = actions["Animation"];
      if (animation) {
          animation.reset().play();
          animation.paused = true; // Pause the animation
          animation.enabled = true; // Enable the animation
          animation.time = (animation.getClip().duration); // Set to end state
      }
    } else if (startAnimationDelay >= 0) {
      // Start animation after a delay if delay is non-negative
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
    }
  }, [isFilled, startAnimationDelay, actions]);

  return (
    <primitive {...props} object={clonedScene} scale={9} opacity={0.8} />
  );
}

// Preload the GLB file
useGLTF.preload("./beaker filling with orange solution.glb");
