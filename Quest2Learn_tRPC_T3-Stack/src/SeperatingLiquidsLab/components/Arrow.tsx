import React from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface ArrowProps {
  position: [number, number, number]; // Position as an array
  pointingDirection: "up" | "down" | "left" | "right";
}

const Arrow: React.FC<ArrowProps> = ({ position, pointingDirection }) => {
  const getRotation = () => {
    switch (pointingDirection) {
      case "up":
        return "rotate-0";
      case "down":
        return "rotate-180";
      case "left":
        return "-rotate-90";
      case "right":
        return "rotate-90";
      default:
        return "rotate-0";
    }
  };

  return (
    <Html position={new THREE.Vector3(...position)} transform rotation-y={3.14/2} scale={0.7}>
      <div
        className={`w-16 h-16 flex items-center justify-center ${getRotation()}`}
        style={{
          background: "linear-gradient(45deg, #6dd5ed, #2193b0)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      >
      </div>
    </Html>
  );
};

export default Arrow;
