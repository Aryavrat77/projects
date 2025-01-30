import React, { useEffect, forwardRef, useState, useRef } from "react";
import { setNextEnabled } from "../Experience";
import { Html } from "next/document";
import { SeparatingFunnelHolder } from "../seperating_funnel/SeparatingFunnelHolder";
import { RBFlaskWithPourAnimation } from "../RBFlaskWithFillAnim";
import { SFunnelWithFillAnimation } from "../seperating_funnel/SeperatingFunnelWithFillAnimation";
import gsap from "gsap";
import { WaterBeakerWithPourAnimation } from "../BeakerWithWaterPourAnim";
import { SFunnelWithWaterFillAnimation } from "../seperating_funnel/SeperatingFunnelWithWaterPourAnim";
import { SFunnelWithDrainAnimation } from "../seperating_funnel/SeparatingFunnelDrainAnim";
import { BeakerFillWithWaterAnimation } from "../BeakerFillWithWater";
import { BeakerFillWithOrganicLayer } from "../BeakerFillingWithOrganicProduct";
import { SFunnelPouringOrganicLayer } from "../seperating_funnel/SeparatingFunnelPouringOrganicLayer";
import { FunnelWithPourAnim } from "../Funnel";
import { Sphere } from "@react-three/drei";
import { BeakerPouringOrganicSolution } from "../BeakerPourOrganicSol";
import { Group, Object3D } from "three";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step13Filter = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    const beakerRef = useRef<Group>(null);
    const [animDelay, setAnimDelay] = useState(9999);
    const [showPowder, setShowPowder] = useState(true);
    const handleBeakerClick = () => {
      const tl = gsap.timeline();
      if (beakerRef.current) {
        // Rise the beaker by 1 unit, then move to the front by 2 units on the x-axis
        tl.to(beakerRef.current.position, { y: "+=2", duration: 1 }).to(
          beakerRef.current.position,
          { x: "+=2", z: "+=.3", duration: 1 },
        );
      }

      setAnimDelay(2);
      setShowPowder(false);
    };
    // TODO: Create animation of beaker pouring into the funnel
    // TODO: Play animation of the funnel
    // TODO: Put beaker back.
    // NOTES:
    // Inside function to pour beaker into funnel,
    // make the spheres disappear halfway thru the thing as well
    return (
      <group>
        <group rotation-y={3.14}>
          <SeparatingFunnelHolder position={[0, 5, 0]} />
          <SFunnelWithFillAnimation
            position={[0, 6, 0.1]}
            scale={1.75}
            rotation-y={-3.14 / 2}
            startAnimationDelay={-1}
          />
        </group>
        {/* <Stopper ref={flaskRef} position={[0,9.05,-0.1]} rotation-x={3.14} startAnimationDelay={0} /> */}
        <FunnelWithPourAnim
          position={[2, 5.5, -2]}
          startAnimationDelay={animDelay + 1}
        />
        <BeakerFillWithOrganicLayer
          startAnimationDelay={animDelay + 1.5}
          position={[2, 5, -2]}
        />
        <group
          ref={beakerRef}
          onClick={() => {
            handleBeakerClick();
          }}
        >
          <BeakerPouringOrganicSolution
            // ref={beakerRef} // Attach the ref to the beaker
            position={[0, 5.0, -3.1]}
            rotation-y={3.14 / 2}
            startAnimationDelay={animDelay}
          />
          <group visible={showPowder}>
            <Sphere position={[0.1, 5.2, -3]} scale={0.03} />
            <Sphere position={[-0.12, 5.3, -3.2]} scale={0.03} />
            <Sphere position={[0.17, 5.1, -3.1]} scale={0.03} />
            <Sphere position={[0.1, 5.1, -3]} scale={0.03} />
            <Sphere position={[-0.15, 5.2, -3.2]} scale={0.03} />
            <Sphere position={[0, 5.1, -3.1]} scale={0.03} />
          </group>
        </group>
      </group>
    );
  },
);

export default Step13Filter;
