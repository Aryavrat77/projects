import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface BeakerWithWasteFillAnimationProps {
  startAnimationDelay?: number; // Delay in seconds
  [key: string]: any; // To allow for other props like position, scale, etc.
}

// TODO: make it so that if the startAnimDelay is negative, then it does not do a set Timeout thing
export function SFunnelWithDrainAnimation({ startAnimationDelay = 0, ...props }: BeakerWithWasteFillAnimationProps) {
  const { scene, animations } = useGLTF("./separating funnel draining water.glb");
  const clonedScene = scene.clone(); // Clone the scene for isolated use
  const { actions } = useAnimations(animations, clonedScene);

  useEffect(() => {
    // Start animation after specified delay
    // 4-separating funnel that currently has orange liquid in it.glb
    const timer = setTimeout(() => {
      const animation = actions["Animation"];
      if (animation) {
        animation.reset().play();
        animation.setEffectiveTimeScale(1);
        animation.setLoop(THREE.LoopOnce, 1);
        animation.clampWhenFinished = true;
      }
    }, startAnimationDelay * 1000); // Convert seconds to milliseconds

    return () => clearTimeout(timer);
  }, [startAnimationDelay, actions]);

  return (
    <primitive {...props} object={clonedScene} />
  );
}

useGLTF.preload("./separating funnel draining water.glb");
