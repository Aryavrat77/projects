import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import BalanceWithAnimations from "../BalanceWithAnimations";
import WeighingPaper from "../WeighingPaper";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Bottle } from "../Bottle";
import { BottleCap } from "../BottleCap";
import { Spatula } from "../Spatula";
import { Beaker } from "../Beaker";
import { setNextEnabled } from "../Experience";

interface WeighingPaperRef {
  replayAnimation: () => void;
}


interface FifthStepComponentProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}
const FifthStepComponent = forwardRef<{}, FifthStepComponentProps>(
  ({ nextButtonRef }, ref) => {
  const weighingPaperRef = useRef<WeighingPaperRef>(null);
  const paperGroup = useRef(new THREE.Group());
  const originalStartPos = new THREE.Vector3(0, 5, -3); // Initial position

  // If we want it to run as soon as the state loads
  useEffect(() => {
    paperGroup.current.position.copy(originalStartPos); // Ensure initial position is set
    // const animate = () => {
    //   requestAnimationFrame(animate);
    //   TWEEN.update();
    // };
    // requestAnimationFrame(animate);
    // // Start the initial animation sequence
    // movePaperUp().then(() => {
    //   if (weighingPaperRef.current) {
    //     weighingPaperRef.current.replayAnimation();
    //   }
    // });
  }, []);

  const movePaperUp = () => {
    return new Promise((resolve) => {
      const upPosition = new THREE.Vector3(0, 1, 0);
      const moveDuration = 1; // Duration in seconds
      const endPosition = originalStartPos.clone().add(upPosition);

      new TWEEN.Tween(paperGroup.current.position)
        .to(endPosition, moveDuration * 1600)
        .onUpdate(() => {
          paperGroup.current.position.copy(paperGroup.current.position);
        })
        .onComplete(() => resolve(0))
        .start();
    });
  };

  const handleReplayAnimation = async () => {
    paperGroup.current.position.copy(originalStartPos); // Reset position
    await movePaperUp();
    if (weighingPaperRef.current) {
      weighingPaperRef.current.replayAnimation();
    }
  };

  useImperativeHandle(ref, () => ({
    replayAnimation: handleReplayAnimation,
  }));

  return (
    <group>
      <BalanceWithAnimations isOpen={false} position={[0, 4.55, 0]} />
      <group ref={paperGroup}>
        <WeighingPaper
          folded={false}
          ref={weighingPaperRef}
          rotation-y={(3.14 / 180) * 180}
          onClick={() => {
            paperGroup.current.position.copy(originalStartPos); // Ensure initial position is set

            const animate = () => {
              requestAnimationFrame(animate);
              TWEEN.update();
            };
            requestAnimationFrame(animate);

            // Start the initial animation sequence
            movePaperUp().then(() => {
              if (weighingPaperRef.current) {
                weighingPaperRef.current.replayAnimation();
              }
            }).then(() => {
              setNextEnabled(nextButtonRef);
            });
          }}
        />
      </group>
      <Spatula
        rotation-y={(3.14 / 180) * 90}
        scale={0.5}
        position={[2.5, 5, 0]}
      />
      <BottleCap position={[2, 5.1, -2]} />
      <Bottle position={[2, 5, -2]} />
      <Beaker rotation-y={(-3.14 / 180) * 90} position={[2.6, 4.9, -3]} />
    </group>
  );
});

export default FifthStepComponent;
