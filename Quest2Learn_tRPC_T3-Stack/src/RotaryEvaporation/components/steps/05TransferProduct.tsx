// Parent Component
import React, { useState, forwardRef, useEffect } from "react";
import { OrganicProductBeakerWithPourAnimation } from "../BeakerWithPouringAnim";
import { RotavapWithHeatBathAnim } from "../rotavap/RotavapWithHeatOnAnim";
import { HundredMLFlaskWithFillAnimation } from "../round-bottom-flasks/RBFlaskWithFillAnim";
import { BumpTrap } from "../BumpTrap";
import { OrganicProductBeaker } from "../BeakerWithSolution";
import { KeckClip } from "../KeckClip";
import { HundredMLFlask } from "../round-bottom-flasks/100mlRBFlask";
import { TwentyFiveMLFlask } from "../round-bottom-flasks/25mlRBFlask";
import { FiftyMLFlask } from "../round-bottom-flasks/50mlRBFlask";
// Import the components used within this parent component

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step5TransferProducts = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }) => {
    const [startFlaskAnimation, setStartFlaskAnimation] = useState(9999);

    // Function to be called when the beaker is clicked
    const onBeakerClick = () => {
      // Start the beaker animation here if it's controlled within this component
      setStartFlaskAnimation(1.95);
      // Set a timeout to start the flask animation after 2 seconds
      // setTimeout(() => {
      //   setStartFlaskAnimation(true);
      // }, 3400); // Delay of 2 seconds
    };

    return (
      <group>
        <RotavapWithHeatBathAnim position={[0, 5, 0]} scale={0.8} />
        <HundredMLFlaskWithFillAnimation
          startAnimationDelay={startFlaskAnimation}
          position={[2.2, 5, 0.4]}
        />
        <OrganicProductBeakerWithPourAnimation
          onClick={onBeakerClick}
          position={[0, 5, -2.2]}
          rotation-y={(3.14 / 180) * 180}
        />
        <group position={[0.4, 5, -3.8]}>
          <KeckClip position={[0, 0, 0.6]} />
          <KeckClip />
        </group>
        <BumpTrap position={[-0.5, 5.25, -4.2]} rotation-x={3.14 / 2} />
      </group>
    );
  },
);

export default Step5TransferProducts;
