import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import BalanceReading from "./BalanceReading";
import { GroupProps } from "@react-three/fiber";

// Define prop types
interface BalanceWithAnimationsProps extends GroupProps {
  isOpen: boolean;
};

// Define ref types
export interface BalanceWithAnimationsHandles {
  replayAnimation: () => Promise<void>;
  updateBalanceReading: (weight: number) => void;
}

const BalanceWithAnimations = forwardRef<BalanceWithAnimationsHandles, BalanceWithAnimationsProps>(
  (props, ref) => {
    const { isOpen } = props;
    const balance = useGLTF("./balanceUpdated.gltf");
    const animations = useAnimations(balance.animations, balance.scene);
    const animationAction = useRef<THREE.AnimationAction | null>(null);
    const balanceReadingRef = useRef<any>(null);

    useEffect(() => {
      const animationToPlay = isOpen ? "glassRAction.002" : "glassR.001Action";
      const action = animations.actions ? animations.actions[animationToPlay] : null;
      if (action) {
        animationAction.current = action;
        animationAction.current.setLoop(THREE.LoopOnce, 1);
      }

      if (balance.scene.children[3]) {
        balance.scene.children[3].visible = isOpen;
      }
      if (balance.scene.children[17]) {
        balance.scene.children[17].visible = !isOpen;
      }

      return () => {
        if (animationAction.current) {
          animationAction.current.fadeOut(0.5);
        }
      };
    }, [isOpen, balance.animations, animations.actions]);

    const handleReplayAnimation = async () => {
      if (animationAction.current) {
        await animationAction.current.reset().fadeIn(0.5).play();
        animationAction.current.clampWhenFinished = true;
      }
    };

    const updateBalanceReading = (weight: number) => {
      if (balanceReadingRef.current) {
        balanceReadingRef.current.setWeight(weight);
      }
    };

    useImperativeHandle(ref, () => ({
      replayAnimation: handleReplayAnimation,
      updateBalanceReading,
    }));

    return (
      <group {...props}>
        <primitive object={balance.scene} scale={0.6} />
        <BalanceReading ref={balanceReadingRef} />
      </group>
    );
  }
);

export default BalanceWithAnimations;

useGLTF.preload("./balanceUpdated.gltf")