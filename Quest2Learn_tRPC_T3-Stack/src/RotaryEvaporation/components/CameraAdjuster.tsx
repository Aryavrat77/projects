import { useThree, useFrame } from "@react-three/fiber";
import { useEffect } from "react";

export function CameraAdjuster() {
    const { camera } = useThree();
  
    useEffect(() => {
      camera.lookAt(0, 6, 0);
    //   camera.setViewOffset(100,100,0,-10,100,100);
    }, []);
    
    useFrame(() => {
        camera.lookAt(0, 6.5, 0);
        // camera.updateProjectionMatrix();
    });
  
    return null;
  }