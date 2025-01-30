import React, { useState, useEffect, useRef } from "react";
import { useGLTF, Box } from "@react-three/drei";
import { GroupProps, Vector3, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function RotavapSubmerge(props: GroupProps) {
  const gltf1 = useGLTF("./10-submerge flask.glb");
  const gltf2 = useGLTF("./11-evaporating.glb");
  const [isFirstModel, setIsFirstModel] = useState(true);
  const mixer1 = useRef(new THREE.AnimationMixer(gltf1.scene));
  const mixer2 = useRef(new THREE.AnimationMixer(gltf2.scene));

  const playFirstAnimation = () => {
    const action = mixer1.current.clipAction(gltf1.animations[0] as THREE.AnimationClip);
    action.reset().play();
    action.setEffectiveTimeScale(0.75);

    setTimeout(() => {
      setIsFirstModel(false);
    }, action.getClip().duration * 1000);
  };

  useEffect(() => {
    if (!isFirstModel) {
      const action = mixer2.current.clipAction(gltf2.animations[0] as THREE.AnimationClip);
      action.reset().play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    }
  }, [isFirstModel]);

  // Update the mixers every frame
  useFrame((_, delta) => {
    mixer1.current.update(delta);
    mixer2.current.update(delta);
  });

  const hitboxPosition: Vector3 = [-1.5, 4.0, 2.5];
  const hitboxScale: Vector3 = [2, 6, 2];

  return (
    <group {...props}>
      {isFirstModel ? (
        <primitive object={gltf1.scene} scale={0.8} opacity={0.8} />
      ) : (
        <primitive object={gltf2.scene} scale={0.8} opacity={0.8} />
      )}
      <Box position={hitboxPosition} scale={hitboxScale} onClick={playFirstAnimation}>
        <meshStandardMaterial transparent opacity={0.0} />
      </Box>
    </group>
  );
}

useGLTF.preload("./10-submerge flask.glb");
useGLTF.preload("./11-evaporating.glb");
