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
import { Beaker } from "../Beaker";
import { Bottle } from "../Bottle";
import { BottleCap } from "../BottleCap";
import { Spatula } from "../Spatula";
import { setNextEnabled } from "../Experience";

interface BalanceWithAnimationsRef {
  replayAnimation: () => Promise<void>;
  updateBalanceReading: (weight: number) => void; // Assuming it's a function that takes a number
}

interface WeighingPaperRef {
  replayAnimation: () => void;
}

interface SixthStepComponentProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const SixthStepComponent = forwardRef<{}, SixthStepComponentProps>(
  ({ nextButtonRef }, ref) => {

  const balanceWithAnimationsRef = useRef<BalanceWithAnimationsRef>(null);
  const weighingPaperRef = useRef<WeighingPaperRef>(null);
  const paperGroup = useRef(new THREE.Group());
  const startPos = new THREE.Vector3(0, 1, 0); // Starting position from the end of FifthStepComponent

  const updateBalanceReadingAfterPaperDown = (num: number) => {
    // Update the balance reading when a certain event occurs
    if (balanceWithAnimationsRef.current) {
      balanceWithAnimationsRef.current.updateBalanceReading(num);
    }
  };

  useEffect(() => {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    };
    requestAnimationFrame(animate);

    handleReplayAnimation(); // Start the initial animation sequence
  }, []);

  const movePaperLeft = () => {
    return new Promise((resolve) => {
      const leftPosition = new THREE.Vector3(0.6, 0, 2.98); // Move left by 2 units
      const endPosition = startPos.clone().add(leftPosition);

      new TWEEN.Tween(paperGroup.current.position)
        .to(endPosition, 1700)
        .onUpdate(() => {
          paperGroup.current.position.copy(paperGroup.current.position);
        })
        .onComplete(() => resolve(0))
        .start();
    });
  };

  const movePaperDown = () => {
    return new Promise((resolve) => {
      const downPosition = new THREE.Vector3(0, -0.4, 0); // Move down by 1 unit
      const endPosition = paperGroup.current.position.clone().add(downPosition);

      new TWEEN.Tween(paperGroup.current.position)
        .to(endPosition, 1500)
        .onUpdate(() => {
          paperGroup.current.position.copy(paperGroup.current.position);
        })
        .onComplete(() => resolve(0))
        .start();
    });
  };

  const handleReplayAnimation = async () => {
    updateBalanceReadingAfterPaperDown(0.0);
    paperGroup.current.position.copy(startPos); // Reset to start position
    await movePaperLeft(); // Move left
    await movePaperDown(); // Then move down
    updateBalanceReadingAfterPaperDown(0.0012);
    setNextEnabled(nextButtonRef);
  };

  useImperativeHandle(ref, () => ({
    replayAnimation: handleReplayAnimation,
  }));

  return (
    <group>
      <BalanceWithAnimations
        isOpen={false}
        position={[0, 4.55, 0]}
        ref={balanceWithAnimationsRef}
      />
      <group ref={paperGroup}>
        <WeighingPaper
          folded={true}
          ref={weighingPaperRef}
          position={[0, 5, -3]}
          rotation-y={(3.14 / 180) * 180}
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

export default SixthStepComponent;
