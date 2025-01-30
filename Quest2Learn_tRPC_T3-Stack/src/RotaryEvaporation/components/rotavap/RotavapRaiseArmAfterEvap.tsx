import React, { useState, useEffect, useRef } from "react";
import { useGLTF, useAnimations, Box } from "@react-three/drei";
import { GroupProps, Vector3 } from "@react-three/fiber";
import * as THREE from "three";

export function RotavapRaiseArmAfterEvap(props: GroupProps) {
  const [isFirstAnimationPlayed, setIsFirstAnimationPlayed] = useState(false);

  // Load the first animation
  const { scene: scene1, animations: animations1 } = useGLTF("./12-raise side arm (after evaporation).glb");
  const clonedScene1 = scene1.clone(); // Clone the scene for isolated use
  const { actions: actions1 } = useAnimations(animations1, clonedScene1);

  // Load the second animation
  const { scene: scene2, animations: animations2 } = useGLTF("./9-start rotating.glb");
  const clonedScene2 = scene2.clone();
  const { actions: actions2 } = useAnimations(animations2, clonedScene2);

  const mixerRef = useRef<THREE.AnimationMixer | undefined>();

  // Play the first animation
  const playFirstAnimation = () => {
    const action = actions1["Animation"]; // Replace "Animation" with the actual name of the first animation
    if (action) {
      mixerRef.current = action.getMixer();
      action.reset().play();
      action.setEffectiveTimeScale(0.75);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.getMixer().addEventListener('finished', () => setIsFirstAnimationPlayed(true));
    }
  };

  // Play the second animation
  const playSecondAnimation = () => {
    const action = actions2["Animation"]; // Replace "SecondAnimation" with the actual name of the second animation
    if (action) {
      mixerRef.current = action.getMixer();
      action.reset().play();
      // Set any specific properties for the second animation if required
    }
  };

  useEffect(() => {
    if (isFirstAnimationPlayed) {
      playSecondAnimation();
    }
  }, [isFirstAnimationPlayed]);

  const hitboxPosition: Vector3 = [-1.4, 4, 2.3];
  const hitboxScale: Vector3 = [2, 6, 2];

  return (
    <group {...props}>
      <primitive object={isFirstAnimationPlayed ? clonedScene2 : clonedScene1} scale={0.8} opacity={0.8} />
      {/* Invisible Box for Click Interactions */}
      <Box position={hitboxPosition} scale={hitboxScale} onClick={playFirstAnimation}>
        <meshStandardMaterial transparent opacity={0.0} />
      </Box>
    </group>
  );
}

useGLTF.preload("./12-raise side arm (after evaporation).glb");
useGLTF.preload("./9-start rotating.glb");
