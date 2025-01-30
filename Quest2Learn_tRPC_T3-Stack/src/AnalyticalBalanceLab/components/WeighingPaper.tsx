import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps } from "@react-three/fiber";

// Define the prop types
interface WeighingPaperProps extends GroupProps {
  folded: boolean;
  // Include other props as needed
}
export interface WeighingPaperRef {
  replayAnimation: () => void;
}
const WeighingPaper = forwardRef<WeighingPaperRef, WeighingPaperProps>(
  ({ folded, ...props }, ref) => {  const paper = useGLTF('/weighing paper folding animation.gltf');
  const animations = useAnimations(paper.animations, paper.scene);
  const animationAction = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    const action = animations.actions['ArmatureAction']; // Replace with your actual animation name
    if (action) {
      animationAction.current = action;
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      if (folded) {
        // Set the animation time to halfway if folded is true
        action.play();
        action.paused = true; // Pause immediately
        action.time = action.getClip().duration / 2; // Set to halfway
      } else {
        // Otherwise, start paused and fully unfolded
        // action.play();
        // action.time = action.getClip().duration / 2; // Set to halfway
        action.paused = true;
      }
    }
  }, [animations.actions, folded]);

  const handleReplayAnimation = () => {
    const action = animationAction.current;
    
    if (action) {
      action.timeScale = 1; // Play forward
      action.reset().play();

      // After the animation completes, reverse to halfway
      const duration = action.getClip().duration * 1000; // Convert to milliseconds
      setTimeout(() => {
        action.timeScale = -1; // Reverse the animation
        action.play();
        setTimeout(() => {
          action.paused = true; // Pause at halfway
          action.time = action.getClip().duration / 2; // Ensure it's halfway
        }, duration / 2); // Time remaining to halfway
      }, duration);
    }
  };

  useImperativeHandle(ref, () => ({
    replayAnimation: handleReplayAnimation,
  }));

  return (
    <group {...props}>
      <primitive object={paper.scene} scale={0.45} />
      <Html
        position={[0.4, -0.05, 0]}
        transform
        center
        scale={0.2}
        rotation-y={(3.14 / 180) * 90}
      >
        {/* UI buttons if necessary */}
      </Html>
    </group>
  );
});

useGLTF.preload('/weighing paper folding animation.gltf');

export default WeighingPaper;
