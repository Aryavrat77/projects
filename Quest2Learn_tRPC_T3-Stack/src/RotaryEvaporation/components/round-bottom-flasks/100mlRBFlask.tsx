import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface HundredMLFlaskProps {
  isEmpty?: boolean;
  [key: string]: any;
}

export function HundredMLFlask({ isEmpty = false, ...props }: HundredMLFlaskProps) {
  const emptyFlask = useGLTF("./round-bottomed flask 100ml.gltf");
  const filledFlask = useGLTF("./rb flask filling animation.glb");
  const clonedScene = isEmpty ? emptyFlask.scene.clone() : filledFlask.scene.clone();
  const { actions } = useAnimations(filledFlask.animations, clonedScene);

  useEffect(() => {
    if (!isEmpty) {
      console.log("it is not empty!");
      const animation = actions['Animation'];
      if (animation) {
        animation.play();
        animation.paused = true; // Pause the animation immediately
        animation.time = animation.getClip().duration;
        animation.enabled = true;
      }
    }
  }, [isEmpty, actions]);

  return (
    <primitive {...props} object={clonedScene} opacity={0.8} />
  );
}

useGLTF.preload("./round-bottomed flask 100ml.gltf");
useGLTF.preload("./rb flask filling animation.glb");
