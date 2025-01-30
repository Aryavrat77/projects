import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Group } from "three";
import BalanceWithAnimations, {
  BalanceWithAnimationsHandles,
} from "../BalanceWithAnimations";
import WeighingPaper, { WeighingPaperRef } from "../WeighingPaper";
import { Bottle } from "../Bottle";
import { BottleCap } from "../BottleCap";
import { Spatula } from "../Spatula";
import { Html, Sphere } from "@react-three/drei";
import { Beaker } from "../Beaker";
import { setNextEnabled } from "../Experience";

interface EighthStepComponentProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}

interface EighthStepComponentMethods {
  replayAnimation: () => Promise<void>;
}

const EighthStepComponent = forwardRef<
  EighthStepComponentMethods,
  EighthStepComponentProps
>(({ setIsAnimating, nextButtonRef }, ref) => {
  const balanceWithAnimationsRef = useRef<BalanceWithAnimationsHandles>(null);
  const weighingPaperRef = useRef<WeighingPaperRef>(null);
  const groupRef = useRef<Group>(null); // Internal ref for the Group

  useEffect(() => {
    // updateBalanceReadingAfterAddingPowder(0.5017);
    // setIsAnimating(true);
    // handleReplayAnimation(); // Start the initial animation sequence
    // setIsAnimating(false);
  }, []);

  const updateBalanceReadingAfterAddingPowder = (num: number) => {
    if (balanceWithAnimationsRef.current) {
      // Assuming updateBalanceReading is a method of BalanceWithAnimations
      balanceWithAnimationsRef.current.updateBalanceReading(num);
    }
  };

  const handleReplayAnimation = async () => {
    setIsAnimating(true);
    if (balanceWithAnimationsRef.current) {
      // Assuming replayAnimation is a method of BalanceWithAnimations
      await balanceWithAnimationsRef.current.replayAnimation();
    }
    setIsAnimating(false);
  };

  useImperativeHandle(ref, () => ({
    replayAnimation: async () => {
      handleReplayAnimation();
    },
  }));

  return (
    <group ref={groupRef}>
      <BalanceWithAnimations
        isOpen={false}
        position={[0, 4.55, 0]}
        ref={balanceWithAnimationsRef}
        onClick={() => {
          updateBalanceReadingAfterAddingPowder(0.5017);
          setIsAnimating(true);
          handleReplayAnimation(); // Start the initial animation sequence
          // setIsAnimating(false);
          setNextEnabled(nextButtonRef);
        }}
      />
      <group position={[0.6, 5.6, -0.02]}>
        <WeighingPaper
          folded={true}
          ref={weighingPaperRef}
          rotation-y={(3.14 / 180) * 180}
        />
        <Sphere scale={0.1} position={[0.01, 0.1, 0]} />
      </group>
      <group>
        <BottleCap position={[2, 5.1, -2]} />
      </group>
      <group position={[2, 5, -2]}>
        <Bottle />
      </group>
      <group>
        <Spatula
          rotation-y={(3.14 / 180) * 90}
          scale={0.5}
          position={[2.5, 5, 0]}
        />
        <Sphere scale={0.05} position={[0, 0.05, 0.68]} />
      </group>
      <Beaker rotation-y={(-3.14 / 180) * 90} position={[2.6, 4.9, -3]} />
    </group>
  );
});

export default EighthStepComponent;
