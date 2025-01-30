import React from "react";
import { useGLTF, useAnimations, Box } from "@react-three/drei";
import { GroupProps, Object3DProps, Vector3, Vector3Props } from "@react-three/fiber";
import * as THREE from "three";

export function RotavapWithRaiseArmAnim(props: GroupProps) {
  const { scene, animations } = useGLTF("./3-raise side arm.glb");
  const clonedScene = scene.clone(); // Clone the scene for isolated use
  const { actions } = useAnimations(animations, clonedScene);
  // Function to play the animation
  const playAnimation = () => {
    const animationName = "Animation"; // Replace with your actual animation name
    const action = actions[animationName];
    if (action) {
      action.reset().play();
      action.setEffectiveTimeScale(0.75); // Slowing down the animation to 75% of its original speed
      action.setLoop(THREE.LoopOnce, 1); // Setting the animation to play only once
      action.clampWhenFinished = true; // Clamp the animation at the end state
    }
  };

  // Set position and scale for the hitbox
  const hitboxPosition: Vector3 = [-1.4, 4, 2.3]; // Replace x, y, z with the coordinates near the power button
  const hitboxScale: Vector3 = [2, 6, 2]; // Replace width, height, depth with appropriate dimensions

  return (
    <group {...props}>
      <primitive object={clonedScene} scale={0.8} opacity={0.8} />
      {/* Invisible Box for Click Interactions */}
      <Box position={hitboxPosition} scale={hitboxScale} onClick={playAnimation}>
        <meshStandardMaterial transparent opacity={0.0} /> {/* Invisible material */}
      </Box>
    </group>
  );
}

useGLTF.preload("./3-raise side arm.glb");
