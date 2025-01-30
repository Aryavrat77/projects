import React, { useEffect, forwardRef } from "react";
import { setNextEnabled } from "../Experience";
import { RBFlaskWithEvaporatedProduct } from "../round-bottom-flasks/RBFlaskWithEvapProduct";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step20Conclusion = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    useEffect(() => {
      // Enable the next button after 3 seconds
      const timer = setTimeout(() => {
        if (nextButtonRef && nextButtonRef.current) {
          setNextEnabled(nextButtonRef);
        }
      }, 3000);

      // Clear the timeout if the component unmounts
      return () => clearTimeout(timer);
    }, [nextButtonRef]);

    return (
      <group>
        <RBFlaskWithEvaporatedProduct position={[0,4.9,3.7]} />
      </group>
    );
  },
);

export default Step20Conclusion;
