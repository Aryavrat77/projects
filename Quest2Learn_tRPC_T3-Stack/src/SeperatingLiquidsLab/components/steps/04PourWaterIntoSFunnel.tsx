import React, { useEffect, forwardRef, useState, useRef } from "react";
import { setNextEnabled } from "../Experience";
import { Html } from "next/document";
import { SeparatingFunnelHolder } from "../seperating_funnel/SeparatingFunnelHolder";
import { RBFlaskWithPourAnimation } from "../RBFlaskWithFillAnim";
import { SFunnelWithFillAnimation } from "../seperating_funnel/SeperatingFunnelWithFillAnimation";
import gsap from "gsap"
import { WaterBeakerWithPourAnimation } from "../BeakerWithWaterPourAnim";
import { SFunnelWithWaterFillAnimation } from "../seperating_funnel/SeperatingFunnelWithWaterPourAnim";
import { Group } from "three";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step4PourWaterToSeperatingFunnel = forwardRef<
  HTMLDivElement,
  Step2LabTasksProps
>(({ nextButtonRef }, ref) => {
    const flaskRef = useRef<Group>(null);

    // TODO: FIX THE ANIMATION!!!
    useEffect(() => {
      if (flaskRef.current) {
        // Ensure the flask is referenced and mounted
        const flask = flaskRef.current;
  
        // GSAP Animation for the flask
        gsap.timeline()
          .to(flask.position, { y: "+=4", duration: 1 })
          .to(flask.position, { x:"+=1.9", z: "-=2.5", duration: 1 })
          .to(flask.position, { delay: 5, x: "-=1.9", y: "-=4", z:"+=2.5", duration: 1 });
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
          <SFunnelWithWaterFillAnimation position={[0, 6, .1]} scale={1.75} rotation-y={-3.14/2} startAnimationDelay={3}/>
        </group>
        <group ref={flaskRef}>

        <WaterBeakerWithPourAnimation  position={[-1,5,2.5]} startAnimationDelay={3} />
        </group>
      </group>
    );
  });
  
  export default Step4PourWaterToSeperatingFunnel;