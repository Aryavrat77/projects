import React, { useEffect, forwardRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface SFunnelPouringOrganicLayerProps {
  startAnimationDelay?: number; // Delay in seconds
  [key: string]: any; // To allow for other props like position, scale, etc.
}

export const SFunnelPouringOrganicLayer = forwardRef<THREE.Object3D, SFunnelPouringOrganicLayerProps>(
  ({ startAnimationDelay = 0, ...props }, ref) => {
    const { scene, animations } = useGLTF("./separating funnel pouring orange solution.glb");
    const clonedScene = scene.clone(); // Clone the scene for isolated use
    const { actions } = useAnimations(animations, clonedScene);

    useEffect(() => {
      // Check if startAnimationDelay is negative
      if (startAnimationDelay < 0) return;

      // Start animation after specified delay
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
      <primitive {...props} object={clonedScene} ref={ref} />
    );
  }
);

useGLTF.preload("./separating funnel pouring orange solution.glb");
