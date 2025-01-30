import React, { useState, useEffect, forwardRef } from "react";
import { RotavapWithHeatBathAnim } from "../rotavap/RotavapWithHeatOnAnim";
import { HundredMLFlask } from "../round-bottom-flasks/100mlRBFlask";
import { Html } from "@react-three/drei";
import { setNextEnabled } from "../Experience";
import { BumpTrap } from "../BumpTrap";
import { KeckClip } from "../KeckClip";

interface Step2LabTasksProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const Step8TurnOnCondensorAndVacuum = forwardRef<HTMLDivElement, Step2LabTasksProps>(
  ({ nextButtonRef }, ref) => {
    const [isCondensorOn, setCondensorOn] = useState(false);
    const [isVacuumOn, setVacuumOn] = useState(false);

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

    const toggleCondensor = () => {
      setCondensorOn(!isCondensorOn);
    };

    const toggleVacuum = () => {
      setVacuumOn(!isVacuumOn);
    };

    return (
      <group>
        <RotavapWithHeatBathAnim position={[0, 5, 0]} scale={0.8}/>
        <HundredMLFlask position={[2.2, 5, .4]} />
        <group position={[0.4, 5, -3.8]}>
          <KeckClip position={[0, 0, 0.6]} />
          <KeckClip />
        </group>
        <BumpTrap position={[-0.5, 5.25, -4.2]} rotation-x={3.14 / 2} />

        {/* Condensor Toggle Button */}
        <Html position={[2, 10, -2]} transform rotation-y={3.14/2}>
          <div className="flex flex-col items-center justify-center">
            <button onClick={toggleCondensor} className={`w-10 h-10 rounded-full p-1 mb-2 select-none ${isCondensorOn ? 'bg-green-400' : 'bg-red-400'} transform transition duration-300 ease-in-out flex items-center justify-center`}>
              <span className={`text-lg ${isCondensorOn ? 'block' : 'hidden'}`}>&#x25CF;</span>
              <span className={`text-lg ${isCondensorOn ? 'hidden' : 'block'}`}>&#x2014;</span>
            </button>
            <span className="text-sm select-none bg-slate-800 rounded-md p-1 text-white">Condensor</span>
          </div>
        </Html>

        {/* Vacuum Toggle Button */}
        <Html position={[2, 10, 2]} transform rotation-y={3.14/2}>
          <div className="flex flex-col items-center justify-center">
            <button onClick={toggleVacuum} className={`w-10 h-10 rounded-full p-1 mb-2 select-none ${isVacuumOn ? 'bg-green-400' : 'bg-red-400'} transform transition duration-300 ease-in-out flex items-center justify-center`}>
              <span className={`text-lg ${isVacuumOn ? 'block' : 'hidden'}`}>&#x25CF;</span>
              <span className={`text-lg ${isVacuumOn ? 'hidden' : 'block'}`}>&#x2014;</span>
            </button>
            <span className="text-sm select-none bg-slate-800 rounded-md p-1 text-white">Vacuum</span>
          </div>
        </Html>
      </group>
    );
  }
);

export default Step8TurnOnCondensorAndVacuum;
