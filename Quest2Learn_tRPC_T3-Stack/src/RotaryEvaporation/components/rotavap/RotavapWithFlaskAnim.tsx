import React, { useRef, useState, useEffect } from "react";
import { useGLTF, Box } from "@react-three/drei";
import { GroupProps, Vector3 } from "@react-three/fiber";
import * as THREE from "three";
import { CollectionFlaskWithWastePourAnimation } from "../CollectionFlaskPouringAnimation";

interface RotavapWithFlaskAnimProps extends GroupProps {
  animationTime?: number;
}

export function RotavapWithFlaskAnim({ animationTime = 1, ...props }: RotavapWithFlaskAnimProps) {
  const { scene } = useGLTF("./1-turn on heat bath.glb");
  const clonedScene = scene.clone(); // Clone the scene for isolated use
  const [startFlaskAnimation, setStartFlaskAnimation] = useState(false);

  useEffect(() => {
    // Find and hide the specific flask part
    const flaskPart = clonedScene.children[2]?.children[5];
    if (flaskPart) {
      flaskPart.visible = false;
      // specificFlaskRef.current = flaskPart as THREE.Object3D;
      // specificFlaskRef.current.visible = false;
    }
  }, [clonedScene]);

  const hitboxPosition: Vector3 = [0.0, 2.4, 3.7]; // Adjust this position as needed
  const hitboxScale: Vector3 = [1.5, 1.5, 1.5]; // Adjust this scale as needed

  const playAnimation = () => {
    setTimeout(() => {
      setStartFlaskAnimation(true);
    }, animationTime * 1000);
  };

  return (
    <group {...props}>
      <CollectionFlaskWithWastePourAnimation startAnimation={startFlaskAnimation} position={[0, 2.5, 3.7]} scale={0.8} rotation-y={3.14}/>
      <primitive object={clonedScene} scale={0.8} />
      <Box position={hitboxPosition} scale={hitboxScale} onClick={playAnimation}>
        <meshStandardMaterial transparent opacity={.0} />
      </Box>
    </group>
  );
}

useGLTF.preload("./1-turn on heat bath.glb");
