import React, { useState, forwardRef } from "react";
import { Html } from "@react-three/drei";
import { RotavapWithHeatBathAnim } from "../rotavap/RotavapWithHeatOnAnim";
import { setNextEnabled } from "../Experience";
import { HundredMLFlask } from "../round-bottom-flasks/100mlRBFlask";
import { TwentyFiveMLFlask } from "../round-bottom-flasks/25mlRBFlask";
import { FiftyMLFlask } from "../round-bottom-flasks/50mlRBFlask";
import * as THREE from "three";
import { BumpTrap } from "../BumpTrap";
import { KeckClip } from "../KeckClip";
import { OrganicProductBeaker } from "../BeakerWithSolution";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step4SelectFlask = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    const [dialog, setDialog] = useState({
      show: false,
      message: "",
      position: new THREE.Vector3(),
    });

    const handleFlaskClick = (
      flaskSize: number,
      position: [number, number, number],
    ) => {
      let message = "";
      if (flaskSize === 100) {
        setNextEnabled(nextButtonRef);
        message = "Correct! The 100 mL flask is the right choice.";
      } else if (flaskSize === 50) {
        message = "Incorrect. 50mL is not suitable because the solution should be less than half-filled to prevent overflowing during evaporation.";
      } else {
        message = "Incorrect. The 25 mL flask is too small.";
      }

      setDialog({
        show: true,
        message,
        position: new THREE.Vector3(...position),
      });
    };

    return (
      <group>
        <RotavapWithHeatBathAnim position={[0, 5, 0]} scale={0.8} />
        <HundredMLFlask
          scale={0.8}
          isEmpty={true}
          onClick={() => handleFlaskClick(100, [2.2, 6, -2.2])}
          position={[2.2, 4.9, -2.2]}
          rotation-y={(3.14 * 1) / 2}
        />
        <FiftyMLFlask
          onClick={() => handleFlaskClick(50, [2.2, 6, 0])}
          position={[2.2, 5, 0]}
          rotation-y={(3.14 * 1) / 2}
        />
        <TwentyFiveMLFlask
          onClick={() => handleFlaskClick(25, [2.2, 6, 2.2])}
          position={[2.2, 5, 2.2]}
          rotation-y={(3.14 * 1) / 2}
        />
        <OrganicProductBeaker
          position={[0, 5, -2.2]}
          rotation-y={(3.14 / 180) * 180}
        />
        <group position={[0.4, 5, -3.8]}>
          <KeckClip position={[0, 0, 0.6]} />
          <KeckClip />
        </group>
        <group>
          <HundredMLFlask
            scale={0.8}
            isEmpty={true}
            position={[2.2, 4.9, -2.2]}
            rotation-y={(3.14 * 1) / 2}
          />
          <FiftyMLFlask position={[2.2, 5, 0]} rotation-y={(3.14 * 1) / 2} />
          <TwentyFiveMLFlask
            position={[2.2, 5, 2.2]}
            rotation-y={(3.14 * 1) / 2}
          />
        </group>
        <BumpTrap position={[-0.5, 5.25, -4.2]} rotation-x={3.14 / 2} />

        {dialog.show && (
          <Html position={dialog.position}>
            <div className="rounded-lg border border-pink-300 bg-pink-100 p-3 text-pink-700 shadow-md">
              {dialog.message}
            </div>
          </Html>
        )}
      </group>
    );
  },
);

export default Step4SelectFlask;
