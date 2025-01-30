import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Html } from '@react-three/drei';

// Define a type for the component's ref methods
export interface BalanceReadingRef {
  addWeight: (weight: number) => void;
  setWeight: (weight: number) => void;
}

// Define a type for the props if needed, here it's an empty interface as there are no props used
interface BalanceReadingProps {}

const BalanceReading = forwardRef<BalanceReadingRef, BalanceReadingProps>((props, ref) => {
  const [displayedWeight, setDisplayedWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomVariation = Math.random() * 0.01 - 0.005;
      setDisplayedWeight(prevWeight => prevWeight + randomVariation);

      const convergenceRate = 0.98800;
      setDisplayedWeight(prevWeight => prevWeight + (targetWeight - prevWeight) * convergenceRate);
    }, 200);

    return () => clearInterval(interval);
  }, [targetWeight]);

  const addWeight = (weight: number) => {
    setTargetWeight(prevWeight => prevWeight + weight);
  };
  const setWeight = (weight: number) => {
    setTargetWeight(weight);
  };

  useImperativeHandle(ref, () => ({
    addWeight, 
    setWeight
  }));

  return (
    <Html occlude position={[1.9, .86, 0]} transform rotation-y={Math.PI / 180 * 90} rotation-x={Math.PI / 180 * 0} scale={0.2} zIndexRange={[10,1]}>
      <div className="bg-blue-300 bg-opacity-40 w-60 text-white p-4 rounded-3xl select-none">
        <h2 className="text-xl mb-2 whitespace-pre-wrap text-center">{displayedWeight.toFixed(4)} g</h2>
        {/* Commented buttons */}
      </div>
    </Html>
  );
});

export default BalanceReading;
