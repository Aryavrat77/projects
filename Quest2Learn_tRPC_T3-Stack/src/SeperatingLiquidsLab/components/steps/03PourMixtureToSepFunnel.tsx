import React, { useRef, forwardRef, useEffect } from "react";
import gsap from "gsap";
import { SeparatingFunnelHolder } from "../seperating_funnel/SeparatingFunnelHolder";
import { SFunnelWithFillAnimation } from "../seperating_funnel/SeperatingFunnelWithFillAnimation";
import { RBFlaskWithPourAnimation } from "../RBFlaskWithFillAnim";
import { Group, Object3D } from "three";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step3PourToSeperatingFunnel = forwardRef<
  HTMLDivElement,
  Step2LabTasksProps
>(({ nextButtonRef }, ref) => {
  const flaskRef = useRef<Group>(null);

  useEffect(() => {
    if (flaskRef.current) {
      const timeline = gsap.timeline({ delay: 1 }); // Delay of 1 second before the animation starts
      timeline
        .to(flaskRef.current.position, { y: "+=4", duration: 1 }) // Move up
        .to(flaskRef.current.position, { x:"+=.2" , z: "-=2.6", duration: 1 }); // Move right
    }
  }, []);

  return (
    <group>
      <group rotation-y={3.14}>
        <SeparatingFunnelHolder position={[0, 5, 0]} />
        <SFunnelWithFillAnimation
          position={[0, 6, 0.1]}
          scale={1.75}
          rotation-y={-3.14 / 2}
          startAnimationDelay={4}
        />

      </group>
      <group ref={flaskRef}>
        <RBFlaskWithPourAnimation
          position={[-1, 5, 2.5]}
          startAnimationDelay={4}
        />
      </group>
    </group>
  );
});

export default Step3PourToSeperatingFunnel;
