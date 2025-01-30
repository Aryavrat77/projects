import React, { useEffect, useRef, forwardRef } from "react";
import { Bottle } from "../Bottle";
import { BottleCap } from "../BottleCap";
import { setNextEnabled } from "../Experience";

interface SecondStepComponentProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

// Use forwardRef to forward refs to the component
const SecondStepComponent = forwardRef<HTMLDivElement, SecondStepComponentProps>(
  ({ nextButtonRef }, ref) => {  const bottleRef = useRef();
  const bottleCapRef = useRef();

  useEffect(() => {
    // Enable the next button after 3 seconds
    const timer = setTimeout(() => {
      if (nextButtonRef && nextButtonRef.current) {
        // nextButtonRef.current.disabled = false;
        setNextEnabled(nextButtonRef);
      }
    }, 3000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [nextButtonRef]);

  return (
    <group>
      <Bottle ref={bottleRef} position={[0, 5, 0]} />
      <BottleCap ref={bottleCapRef} position={[0, 5.1, 0]} />
    </group>
  );
});

export default SecondStepComponent;
