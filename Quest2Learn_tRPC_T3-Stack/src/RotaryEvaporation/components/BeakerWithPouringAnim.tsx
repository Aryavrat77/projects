import React, { useRef, useEffect, FunctionComponent } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

export function OrganicProductBeakerWithPourAnimation(
  props: GroupProps & { onClick?: () => void },
) {
  const { scene, animations } = useGLTF(
    "./beaker pouring solution animation.glb",
  );
  const clonedScene = scene.clone();
  const { actions } = useAnimations(animations, clonedScene);
  const groupRef = useRef<THREE.Group>(null);

  const { invalidate } = useThree();

  useEffect(() => {
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      TWEEN.update(time);
      invalidate(); // Force re-render in React Three Fiber
    };
    requestAnimationFrame(animate);
  }, [invalidate]);

  const playAnimation = () => {
    if (groupRef.current) {
      const initialPosition = { ...groupRef.current.position };

      new TWEEN.Tween(groupRef.current.position)
        .to({ y: initialPosition.y + 1.02, x: initialPosition.x + 1.4 }, 1000) // Move up and towards
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          // Play GLTF animation
          const animationName = "Animation"; // Replace with your actual animation name
          const action = actions[animationName];
          if (action) {
            action.reset().play();
            action.setEffectiveTimeScale(1);
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;

            // Wait for the GLTF animation to complete
            const animationDuration = action.getClip().duration * 1000;
            new TWEEN.Tween({ t: 0 })
              .to({ t: 1 }, animationDuration) // Duration of the GLTF animation
              .onComplete(() => {
                // Move back to original position
                new TWEEN.Tween(groupRef.current!.position)
                  .to({ ...initialPosition }, 1000) // Move back to original position
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .start();
              })
              .start();
          }
        })
        .start();
    }
  };

  return (
    <group
      {...props}
      ref={groupRef}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
        playAnimation();
      }}
    >
      <primitive object={clonedScene} scale={10} />
    </group>
  );
}

useGLTF.preload("./beaker pouring solution animation.glb");
