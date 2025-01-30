import React, {
  useEffect,
  forwardRef,
  useState,
  useRef,
  useCallback,
} from "react";
import { setNextEnabled } from "../Experience";
import { SeparatingFunnelHolder } from "../seperating_funnel/SeparatingFunnelHolder";
import { RBFlaskWithPourAnimation } from "../RBFlaskWithFillAnim";
import { SFunnelWithFillAnimation } from "../seperating_funnel/SeperatingFunnelWithFillAnimation";
import gsap from "gsap";
import * as TWEEN from "@tweenjs/tween.js";
import { WaterBeakerWithPourAnimation } from "../BeakerWithWaterPourAnim";
import { SFunnelWithWaterFillAnimation } from "../seperating_funnel/SeperatingFunnelWithWaterPourAnim";
import { SFunnelWithDrainAnimation } from "../seperating_funnel/SeparatingFunnelDrainAnim";
import { BeakerFillWithWaterAnimation } from "../BeakerFillWithWater";
import { BeakerFillWithOrganicLayer } from "../BeakerFillingWithOrganicProduct";
import { SFunnelPouringOrganicLayer } from "../seperating_funnel/SeparatingFunnelPouringOrganicLayer";
import { Spatula } from "~/AnalyticalBalanceLab/components/Spatula";
import { AMSBottleCap } from "../AMSBottleCap";
import { AMSBottle } from "../AMSBottle";
import { Sphere, Html } from "@react-three/drei";
import { Group, Mesh, Object3D } from "three";
import { BeakerPouringOrganicSolution } from "../BeakerPourOrganicSol";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step12AddPowder = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    const bottleCapRef = useRef<Object3D>(null);
    const spatulaRef = useRef<Object3D>(null);
    const powderRef = useRef<Mesh>(null);
    const collectionSphereRef = useRef<Mesh>(null);
    const groupSphereRef = useRef<Group>(null);
    const [addCount, setAddCount] = useState(0);

    // Initialize animations
    // useEffect(() => {
    //   console.log("Hellooo");
    //   // Animation for bottle cap
    //   if (bottleCapRef.current) {
    //     gsap.timeline()
    //       .to(bottleCapRef.current.position, { y: "+=1", duration: 0.5 }) // Move up
    //       .to(bottleCapRef.current.position, { x: "-=1", y: "-=2", duration: 0.5 }); // Move back and down
    //   }

    //   // Animation for spatula
    //   if (spatulaRef.current) {
    //     gsap.timeline()
    //       .to(spatulaRef.current.position, { y: "+=2", duration: 1 }) // Move up
    //       .to(spatulaRef.current.rotation, { x: Math.PI / 2, duration: 1 }) // Rotate
    //       .to(spatulaRef.current.position, { z: "-=2", duration: 1 }) // Move right
    //       .to(spatulaRef.current.position, { y: "-=1", duration: 1 }); // Move down
    //   }
    // }, []);
    useEffect(() => {
      const bottleCapTimeline = gsap.timeline();
      const spatulaTimeline = gsap.timeline();

      if (bottleCapRef.current) {
        bottleCapTimeline
          .to(bottleCapRef.current.position, { y: "+=1", duration: 0.5 })
          .to(bottleCapRef.current.position, {
            x: "-=1",
            y: "-=2",
            duration: 0.5,
          });
      }

      if (spatulaRef.current) {
        spatulaTimeline
          .to(spatulaRef.current.position, { y: "+=2", duration: 1 })
          .to(spatulaRef.current.rotation, { x: Math.PI / 2, duration: 1 })
          .to(spatulaRef.current.position, { z: "-=2", duration: 1 })
          .to(spatulaRef.current.position, { y: "-=1", duration: 1 });
      }
      // if (spatulaRef.current && powderRef.current) {
      //   const addTimeline = gsap.timeline();
      //   addTimeline
      //     .to([spatulaRef.current.position, powderRef.current.position], { y: "+=1", duration: 0.5 })
      //     .to([spatulaRef.current.position, powderRef.current.position], { z: "+=1", duration: 0.5 })
      //     .to([spatulaRef.current.position, powderRef.current.position], {
      //       y: "-=1",
      //       duration: 0.5,
      //       onComplete: () => {
      //         if (powderRef.current)
      //         gsap.set(powderRef.current.position, { x: 2, y: 5.5, z: -2 });
      //         if (collectionSphereRef.current) {
      //           gsap.to(collectionSphereRef.current.scale, { x: "+=0.05", y: "+=0.05", z: "+=0.05" });
      //         }
      //       }
      //     });
      // }

      return () => {
        bottleCapTimeline.kill();
        spatulaTimeline.kill();
      };
    }, []);

    const handleAddClick = () => {
      // Animate spatula and powder sphere
      if (spatulaRef.current && powderRef.current) {
        gsap.timeline()
          .to([spatulaRef.current.position, powderRef.current.position], { y: "+=1", duration: 0.5 })
          .to([spatulaRef.current.position, powderRef.current.position], { z: "-=1", duration: 0.5 })
          .to([spatulaRef.current.position, powderRef.current.position], { 
            y: "-=1", 
            duration: 0.5, 
            onComplete: () => {
              gsap.set(powderRef.current!.position, { x: 2, y: 5.5, z: -2 });
              if (collectionSphereRef.current) {
                gsap.to(collectionSphereRef.current.scale, { x: "+=0.05", y: "+=0.05", z: "+=0.05" });
              }
    
              // Update addCount state after animations
              setAddCount(prevCount => prevCount + 1);
            }
          });
      }
    };

    useEffect(() => {
      if (addCount === 3) {
        if (collectionSphereRef.current) {
          collectionSphereRef.current.visible = false;
        }
        if (groupSphereRef.current) {
          groupSphereRef.current.visible = true;
        }
        if (nextButtonRef.current) {
          setNextEnabled(nextButtonRef);
        }
      }
    }, [addCount, nextButtonRef]);
    
    
    // const handleAddClick = () => {
    //   // Ensure no overlapping animations
    //   console.log("Add button clicked", { spatulaRef, powderRef });

    //   gsap.killTweensOf([spatulaRef.current, powderRef.current]);

    //   if (spatulaRef.current && powderRef.current) {
    //     const addTimeline = gsap.timeline();
    //     addTimeline
    //       .to([spatulaRef.current.position, powderRef.current.position], {
    //         y: "+=1",
    //         duration: 0.5,
    //       })
    //       .to([spatulaRef.current.position, powderRef.current.position], {
    //         z: "+=1",
    //         duration: 0.5,
    //       })
    //       .to([spatulaRef.current.position, powderRef.current.position], {
    //         y: "-=1",
    //         duration: 0.5,
    //         onComplete: () => {
    //           if (powderRef.current)
    //             gsap.set(powderRef.current.position, { x: 2, y: 5.5, z: -2 });
    //           if (collectionSphereRef.current) {
    //             gsap.to(collectionSphereRef.current.scale, {
    //               x: "+=0.05",
    //               y: "+=0.05",
    //               z: "+=0.05",
    //             });
    //           }
    //         },
    //       });
    //   }
    //   // setAddCount((prevCount) => {
    //   //   // Update the count and handle visibility of spheres
    //   //   const newCount = prevCount + 1;
    //   //   if (newCount === 3) {
    //   //     if (collectionSphereRef.current) {
    //   //       collectionSphereRef.current.visible = false;
    //   //     }
    //   //     if (groupSphereRef.current) {
    //   //       groupSphereRef.current.visible = true;
    //   //     }
    //   //     if (nextButtonRef.current) {
    //   //       setNextEnabled(nextButtonRef);
    //   //     }
    //   //   }
    //   //   return newCount;
    //   // }
    //   // );
    // };

    // TODO: Create animation for bottle cap opening and spatula going inside
    // TODO: Create animation for spatula picking up powder, and playing swirling animation
    // TODO: Create function such that powder in beaker becomes bigger for the first 2 scoops,
    //       then it breaks up on the 3rd scoop
    // TODO: Next button to be enabled after 3rd scoop
    const animateSpatulaOnClick = useCallback(() => {
      if (spatulaRef.current) {
        gsap.to(spatulaRef.current.position, { y: "+=1", duration: 0.5 });
        gsap.to(spatulaRef.current.position, {
          y: "-=1",
          duration: 0.5,
          delay: 0.5,
        });
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
            startAnimationDelay={999}
          />
        </group>
        {/* <Stopper ref={flaskRef} position={[0,9.05,-0.1]} rotation-x={3.14} startAnimationDelay={0} /> */}
        <Spatula
          ref={spatulaRef}
          position={[2, 5, 0]}
          rotation-y={3.14 / 2}
          scale={0.5}
          onClick={animateSpatulaOnClick} // Attach the onClick handler here
        />
        <AMSBottleCap
          ref={bottleCapRef}
          position={[2, 5, -2]}
          rotation-y={3.14 / 2}
        />
        <Sphere ref={powderRef} position={[2, 5.3, -2]} scale={0.1} />

        <AMSBottle position={[2, 5, -2]} rotation-y={3.14 / 2} />
        <Html transform rotation-y={3.14 / 2} position={[2, 6.5, -2]}  >
          <button
            className="bg-green-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddClick();
            }}
          >
            Add
          </button>
        </Html>
        <group position-x={2}>
          <BeakerPouringOrganicSolution
            position={[0, 4.9, -3.1]}
            rotation-y={3.14 / 2}
            isFilled={true}
            startAnimationDelay={999}
          />
          {/* This is the collection of powder */}
          <Sphere
            ref={collectionSphereRef}
            position={[0, 4.8, -3.1]}
            scale={0.1}
          />
          <group ref={groupSphereRef} visible={false}>
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

export default Step12AddPowder;
