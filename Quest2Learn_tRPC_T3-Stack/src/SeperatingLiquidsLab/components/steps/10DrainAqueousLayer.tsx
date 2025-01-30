import React, { useEffect, forwardRef, useRef, useState } from "react";
import gsap from "gsap";
import { setNextEnabled } from "../Experience";
import { SeparatingFunnelHolder } from "../seperating_funnel/SeparatingFunnelHolder";
import { Stopper } from "../Stopper";
import { SFunnelWithDrainAnimation } from "../seperating_funnel/SeparatingFunnelDrainAnim";
import { BeakerFillWithWaterAnimation } from "../BeakerFillWithWater";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step10DrainSFunnel = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    const stopperRef = useRef<THREE.Object3D>(null);
    const [startAnimationDelay, setStartAnimationDelay] = useState(999);
    const animateStopper = () => {
      if (stopperRef.current) {
        gsap
          .timeline()
          .to(stopperRef.current.position, { y: "+=1", duration: 0.5 }) // Move up
          .to(stopperRef.current.position, { z: "-=1.3", duration: 0.5 }) // Move left
          .to(stopperRef.current.position, { y: "-=4.8", duration: 0.5 })
          .then(() => {

            // setStartAnimationDelay(4);
          });
          setStartAnimationDelay(4);

      }
    };

    // useEffect(() => {
    //   if (stopperRef.current) {
    //     // Ensure the stopper is referenced and mounted
    //     const stopper = stopperRef.current;

    //     // GSAP Animation for the stopper
    //     gsap.timeline()
    //       .to(stopper.position, { y: "+=1", duration: 1 }) // Move up by 1 unit
    //       .to(stopper.position, { x: "-=1", duration: 1 }) // Move left by 1 unit
    //       .to(stopper.position, { y: "-=3", duration: 1 }); // Move down by 3 units
    //   }

    //   // Enable the next button after 3 seconds
    //   const nextButtonTimer = setTimeout(() => {
    //     if (nextButtonRef && nextButtonRef.current) {
    //       setNextEnabled(nextButtonRef);
    //     }
    //   }, 3000);

    //   return () => clearTimeout(nextButtonTimer);
    // }, [nextButtonRef]);

    return (
      <group>
        <group rotation-y={3.14}>
          <SeparatingFunnelHolder position={[0, 5, 0]} />
          <SFunnelWithDrainAnimation
            position={[0, 6, 0.1]}
            scale={1.75}
            rotation-y={-3.14 / 2}
            startAnimationDelay={startAnimationDelay}
          />
        </group>
        <Stopper
          ref={stopperRef}
          position={[0, 9.05, -0.1]}
          rotation-x={3.14}
          scale={0.3}
          onClick={() => {
            animateStopper();
          }} // Add the onClick handler here
        />
        <BeakerFillWithWaterAnimation
          position={[0, 5.2, -0.1]}
          rotation-y={3.14 / 2}
          startAnimationDelay={startAnimationDelay}
        />
      </group>
    );
  },
);

export default Step10DrainSFunnel;
