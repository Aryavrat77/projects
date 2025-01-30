import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Table(props : any) {
  const { nodes, materials } : any = useGLTF("./TeaTable01.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tea_Table_1.geometry}
        material={materials["Tea Table"]}
        scale={0.01}
      />
    </group>
  );
}

useGLTF.preload("./TeaTable01.glb");
