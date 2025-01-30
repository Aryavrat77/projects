import React, { useEffect, forwardRef, useState, useRef } from "react";
import { SeparatingFunnelHolder } from "../seperating_funnel/SeparatingFunnelHolder";
import gsap from "gsap";
import { BeakerFillWithOrganicLayer } from "../BeakerFillingWithOrganicProduct";
import { SFunnelPouringOrganicLayer } from "../seperating_funnel/SeparatingFunnelPouringOrganicLayer";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step11PourOrganicLayer = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    const funnelRef = useRef<THREE.Object3D>(null); // Ref for the SFunnelPouringOrganicLayer
    const [startAnimationDelay, setStartAnimationDelay] = useState(-999);

    // Function to animate the SFunnelPouringOrganicLayer
    const animateFunnel = () => {
      if (funnelRef.current) {
        gsap
          .timeline()
          .to(funnelRef.current.position, { y: "+=1", duration: .7 }) // Move up 
          .to(funnelRef.current.position, { z: "+=3.7", y:"-=1.7", duration: .7 }); // Move to the right
      }
      setStartAnimationDelay(2);
    };
    return (
      <group>
        <group rotation-y={3.14}>
          <SeparatingFunnelHolder position={[0, 5, 0]} />
          <SFunnelPouringOrganicLayer
            ref={funnelRef}
            position={[0, 6, 0.1]}
            scale={1.75}
            rotation-y={-3.14 / 2}
            startAnimationDelay={startAnimationDelay}
            onClick={() => {
              animateFunnel();
            }} // Add the onClick handler here
          />
        </group>
        {/* <Stopper ref={flaskRef} position={[0,9.05,-0.1]} rotation-x={3.14} startAnimationDelay={0} /> */}
        <BeakerFillWithOrganicLayer
          position={[0, 5.0, -3.1]}
          rotation-y={3.14 / 2}
          startAnimationDelay={startAnimationDelay + 1.5}
        />
      </group>
    );
  },
);

export default Step11PourOrganicLayer;
