import React, { useState, useEffect, useRef } from "react";
import { useGLTF, Box } from "@react-three/drei";
import { GroupProps, Vector3, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Arrow from "../Arrow";

export function RotavapTurnOff(props: GroupProps) {
  const initialGltf = useGLTF("./9-start rotating.glb");
  const gltf1 = useGLTF("./13-turn off rotation.glb");
  const gltf2 = useGLTF("./14-turn off heat bath.glb");
  const [animationState, setAnimationState] = useState("initial");

  // Mixers for each GLTF
  const initialMixer = useRef(
    new THREE.AnimationMixer(initialGltf.scene),
  ).current;
  const mixer1 = useRef(new THREE.AnimationMixer(gltf1.scene)).current;
  const mixer2 = useRef(new THREE.AnimationMixer(gltf2.scene)).current;

  // Play the initial animation
  useEffect(() => {
    const action = initialMixer.clipAction(
      initialGltf.animations[0] as THREE.AnimationClip,
    );
    action.play();
  }, [initialGltf.animations, initialMixer]);

  // Function to trigger the first animation
  const playFirstAnimation = () => {
    const action = mixer1.clipAction(
      gltf1.animations[0] as THREE.AnimationClip,
    );
    action.reset().play();
    action.setLoop(THREE.LoopOnce, 1); // Play only once
    setAnimationState("first");
  };

  // Function to trigger the second animation
  const playSecondAnimation = () => {
    const action = mixer2.clipAction(
      gltf2.animations[0] as THREE.AnimationClip,
    );
    action.reset().play();
    action.setLoop(THREE.LoopOnce, 1); // Play only once
    setAnimationState("second");
  };

  // Update mixers every frame
  useFrame((_, delta) => {
    initialMixer.update(delta);
    mixer1.update(delta);
    mixer2.update(delta);
  });

  const hitboxPosition1: Vector3 = [-0.75, 6.35, 2.05];
  const hitboxPosition2: Vector3 = [1.8, 0.85, -0.5];
  const hitboxScale: Vector3 = [0.5, 0.5, 0.5];

  return (
    <group {...props}>
      {animationState === "initial" && (
        <primitive object={initialGltf.scene} scale={0.8} opacity={0.8} />
      )}
      {animationState === "first" && (
        <primitive object={gltf1.scene} scale={0.8} opacity={0.8} />
      )}
      {animationState === "second" && (
        <primitive object={gltf2.scene} scale={0.8} opacity={0.8} />
      )}
      {animationState === "initial" && (
        <Arrow pointingDirection="left" position={[-0.7, 6.3, 1]} />
      )}
      {animationState === "first" && (
        <Arrow pointingDirection="left" position={[1.6, 0.9, -2]} />
      )}
      {animationState === "initial" && (
        <Box
          position={hitboxPosition1}
          scale={hitboxScale}
          onClick={playFirstAnimation}
        >
          <meshStandardMaterial transparent opacity={0.0} />
        </Box>
      )}
      {animationState === "first" && (
        <Box
          position={hitboxPosition2}
          scale={hitboxScale}
          onClick={playSecondAnimation}
        >
          <meshStandardMaterial transparent opacity={0.0} />
        </Box>
      )}
    </group>
  );
}

useGLTF.preload("./9-start rotating.glb");
useGLTF.preload("./13-turn off rotation.glb");
useGLTF.preload("./14-turn off heat bath.glb");
