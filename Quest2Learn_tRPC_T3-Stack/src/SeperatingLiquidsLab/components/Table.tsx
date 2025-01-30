import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Table(props: any) {
  const { nodes, materials }: any = useGLTF("./TeaTable01.glb");

  const whiteMaterial = materials["Tea Table"].clone();
  // whiteMaterial.color = new THREE.Color('white');
  whiteMaterial.emissive = new THREE.Color("white");
  whiteMaterial.emissiveIntensity = 0.05;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tea_Table_1.geometry}
        material={whiteMaterial}
        scale={0.01}
      />
    </group>
  );
}

useGLTF.preload("./TeaTable01.glb");
