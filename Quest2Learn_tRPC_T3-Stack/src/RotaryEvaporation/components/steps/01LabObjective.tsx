import { forwardRef } from "react";
import {RotavapWithHeatBathAnim}  from "../rotavap/RotavapWithHeatOnAnim";

const Step1LabObjectives = forwardRef((props, ref) => {
  return (
    <group>
      {/* The balance is positioned at the same coordinates as specified in the FourthStepComponent */}
      <RotavapWithHeatBathAnim position={[0, 5, 0]}  />
      {/* Additional elements specific to the first step can be added here */}
    </group>
  );
});

export default Step1LabObjectives;
