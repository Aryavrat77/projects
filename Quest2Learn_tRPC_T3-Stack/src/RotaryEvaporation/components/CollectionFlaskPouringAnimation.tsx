import React from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps } from "@react-three/fiber";

interface CollectionFlaskWithWastePourAnimationProps extends GroupProps {
  startAnimation: boolean;
  position?: [number, number, number];
  scale?: number;
  rotationY?: number;
}

export function CollectionFlaskWithWastePourAnimation({
  startAnimation,
  position = [0, 0, 0],
  scale = 1,
  rotationY = 0,
  ...groupProps
}: CollectionFlaskWithWastePourAnimationProps) {
  const { scene, animations } = useGLTF("./collection flask pouring animation.glb");
  const clonedScene = scene.clone(); // Clone the scene for isolated use

  // Apply the position, scale, and rotation to the cloned scene
  clonedScene.position.set(...position);
  clonedScene.scale.set(scale, scale, scale);
  clonedScene.rotation.y = rotationY;

  const { actions } = useAnimations(animations, clonedScene);

  React.useEffect(() => {
    if (startAnimation && actions["Animation"]) {
      const animation = actions["Animation"];
      animation.reset().play();
      animation.setEffectiveTimeScale(1);
      animation.setLoop(THREE.LoopOnce, 1);
      animation.clampWhenFinished = true;
    }
  }, [startAnimation, actions]);

  return <primitive {...groupProps} object={clonedScene} />;
}

useGLTF.preload("./collection flask pouring animation.glb");
