import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Bottle(props: any) {
  const gltf = useGLTF("./sample bottle body.gltf");
  const clonedScene = gltf.scene.clone(); // Clone the scene for isolated use
  // const bottleRef = useRef();

  useEffect(() => {
    // const logPosition = () => {
    //   if (bottleRef.current) {
    //     console.log("Bottle position:", bottleRef.current.position);
    //   }
    // };
    // Log position initially
    // logPosition();
    // Optional: If you expect the position to change, you can set up an interval to log it
    // const intervalId = setInterval(logPosition, 1000); // Log every 1 second
    // Cleanup function
    // return () => clearInterval(intervalId);
  }, []);
  return (
    <primitive
      // ref={bottleRef}
      {...props}
      object={clonedScene}
      scale={1.3}
      opacity={0.8}
      rotation={[0, (3.14 / 180) * 90, 0]}
    />
  );
}

useGLTF.preload("./sample bottle body.gltf")