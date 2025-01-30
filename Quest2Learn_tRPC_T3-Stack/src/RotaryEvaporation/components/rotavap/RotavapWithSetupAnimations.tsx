import React, { useState, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function RotavapWithSetupAnimations(props: GroupProps) {
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const gltf1 = useGLTF("./4-install bump trap.glb");
  const gltf2 = useGLTF("./5-insert keck clip (bump trap).glb");
  const gltf3 = useGLTF("./6-install rb flask.glb");
  const gltf4 = useGLTF("./7-install keck clip (rb).glb");

  const mixers = [
    useRef(new THREE.AnimationMixer(gltf1.scene)),
    useRef(new THREE.AnimationMixer(gltf2.scene)),
    useRef(new THREE.AnimationMixer(gltf3.scene)),
    useRef(new THREE.AnimationMixer(gltf4.scene))
  ];

  const gltfs = [gltf1, gltf2, gltf3, gltf4];

  const playAnimation = (index : number) => {
    const mixer = mixers[index]!.current;
    const gltf = gltfs[index];
    const action = mixer.clipAction(gltf!.animations[0] as THREE.AnimationClip);
    action.reset().play();
    action.setEffectiveTimeScale(0.75);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;

    const nextIndex = index + 1;
    setTimeout(() => {
      if (nextIndex < mixers.length) {
        setCurrentAnimationIndex(nextIndex);
      }
    }, action.getClip().duration * 1000 / action.getEffectiveTimeScale());
  };

  useEffect(() => {
    playAnimation(currentAnimationIndex);
  }, [currentAnimationIndex]);

  useFrame((_, delta) => {
    mixers.forEach(mixer => mixer.current.update(delta));
  });

  const currentScene = gltfs[currentAnimationIndex]!.scene;

  return (
    <group {...props}>
      <primitive object={currentScene} scale={0.8} opacity={0.8} />
    </group>
  );
}

// Preload all animation files
useGLTF.preload("./4-install bump trap.glb");
useGLTF.preload("./5-insert keck clip (bump trap).glb");
useGLTF.preload("./6-install rb flask.glb");
useGLTF.preload("./7-install keck clip (rb).glb");
