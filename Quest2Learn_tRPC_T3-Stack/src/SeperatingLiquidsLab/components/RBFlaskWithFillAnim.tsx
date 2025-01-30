import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface HundredMLFlaskWithFillAnimationProps {
  startAnimationDelay?: number;
  [key: string]: any;
}

export const RBFlaskWithPourAnimation = forwardRef(({ startAnimationDelay = 0, ...props }: HundredMLFlaskWithFillAnimationProps, ref) => {
  const { scene, animations } = useGLTF("./1-rb flask with liquid in it.glb");
  const clonedScene = scene.clone();
  const { actions } = useAnimations(animations, clonedScene);
  const localRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const animation = actions["Animation"];
      if (animation) {
        animation.reset().play();
        animation.setEffectiveTimeScale(1);
        animation.setLoop(THREE.LoopOnce, 1);
        animation.clampWhenFinished = true;
      }
    }, startAnimationDelay * 1000);

    return () => clearTimeout(timer);
  }, [startAnimationDelay, actions]);

  return (
    <primitive ref={localRef} {...props} object={clonedScene} scale={1.5} opacity={0.8} />
  );
});

useGLTF.preload("./1-rb flask with liquid in it.glb");
