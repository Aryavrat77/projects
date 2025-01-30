import React, { useState, useEffect } from "react";
import { useGLTF, useAnimations, Box } from "@react-three/drei";
import { GroupProps, Vector3 } from "@react-three/fiber";
import * as THREE from "three";

export function RotavapTurnOnRotation(props: GroupProps) {
  const gltf1 = useGLTF("./8-turn on roatation.glb");
  const gltf2 = useGLTF("./9-start rotating.glb");
  const [currentModel, setCurrentModel] = useState(gltf1);

  const { scene, animations } = currentModel;
  const clonedScene = scene.clone(); // Clone the scene for isolated use
  const { actions } = useAnimations(animations, clonedScene);

  // Function to play the animation and switch models
  const playAnimation = () => {
    const animationName = "Animation";
    const action = actions[animationName];
    if (action) {
      action.reset().play();
      action.setEffectiveTimeScale(0.75);
    //   action.setLoop(THREE.LoopOnce, 1);
    //   action.clampWhenFinished = true;

      // Assuming the duration of the animation is known
      const animationDuration = 3000; // Duration in milliseconds
      setTimeout(() => {
        setCurrentModel(gltf2); // Switch to the second model after the animation duration
      }, animationDuration);
    }
  };

  useEffect(() => {
    if (currentModel === gltf2) {
      const action = actions["Animation"];
      if (action) {
        action.reset().play();
        action.setLoop(THREE.LoopRepeat, Infinity);
      }
    }
  }, [currentModel, actions]);

  const hitboxPosition : Vector3 = [-.75, 6.35, 2.85];
  const hitboxScale : Vector3 = [.2, .2, .2];

  return (
    <group {...props}>
      <primitive object={clonedScene} scale={0.8} opacity={0.8} />
      <Box position={hitboxPosition} scale={hitboxScale} onClick={playAnimation}>
        <meshStandardMaterial transparent opacity={0.0} />
      </Box>
    </group>
  );
}

useGLTF.preload("./8-turn on roatation.glb");
useGLTF.preload("./9-start rotating.glb");
