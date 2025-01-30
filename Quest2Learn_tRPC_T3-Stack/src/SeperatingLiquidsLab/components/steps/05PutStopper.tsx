import React, { useEffect, forwardRef, useState, useRef } from "react";
import { setNextEnabled } from "../Experience";
import { Html } from "next/document";
import { SeparatingFunnelHolder } from "../seperating_funnel/SeparatingFunnelHolder";
import { RBFlaskWithPourAnimation } from "../RBFlaskWithFillAnim";
import { SFunnelWithFillAnimation } from "../seperating_funnel/SeperatingFunnelWithFillAnimation";
import gsap from "gsap";
import { WaterBeakerWithPourAnimation } from "../BeakerWithWaterPourAnim";
import { SFunnelWithWaterFillAnimation } from "../seperating_funnel/SeperatingFunnelWithWaterPourAnim";
import {Stopper} from "../Stopper";
import { Object3D } from "three";
import { SFunnelWithDrainAnimation } from "../seperating_funnel/SeparatingFunnelDrainAnim";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step5StopperTheSFunnel = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    const stopperRef = useRef<Object3D>(null);
    // TODO: FIX THE ANIMATION!!!
    useEffect(() => {
      if (stopperRef.current) {
        // Ensure the flask is referenced and mounted
        const flask = stopperRef.current;

        // GSAP Animation for the flask
        gsap
          .timeline()
          .to(flask.position, { y: "+=5", duration: 0.5 })
          .to(flask.position, { x: "+=1", duration: 0.5 })
          .to(flask.position, { z: "-=2.6", duration: 0.5 })
          .to(flask.rotation, { x: "3.14", duration: 0.5 })
          .to(flask.position, { y: "-=.95", duration: 0.5 });

      }

      // Enable the next button after 3 seconds
      const nextButtonTimer = setTimeout(() => {
        if (nextButtonRef && nextButtonRef.current) {
          setNextEnabled(nextButtonRef);
        }
      }, 3000);

      return () => clearTimeout(nextButtonTimer);
    }, [nextButtonRef]);

    return (
      <group>
        <group rotation-y={3.14}>
          <SeparatingFunnelHolder position={[0, 5, 0]} />
          <SFunnelWithDrainAnimation
            position={[0, 6, 0.1]}
            scale={1.75}
            rotation-y={-3.14 / 2}
            startAnimationDelay={999}
          />
        </group>
        <Stopper ref={stopperRef} position={[-1, 5, 2.5]} scale={0.4} />
      </group>
    );
  },
);

export default Step5StopperTheSFunnel;
