import React, { useEffect, useRef, useState } from "react";
import {
  CameraControls,
  CameraControlsProps,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import FirstStepComponent from "./steps/FirstStepComponent";
import SecondStepComponent from "./steps/SecondStepComponent";
import FourthStepComponent from "./steps/FourthStepComponent";
import Table from "./Table";
import { api } from '~/utils/api'
import { useUser } from "@clerk/nextjs";

// ...other necessary imports...

import state from "./state.json";
import InventorySystem from "./InventorySystem";
import ThirdStepComponent from "./steps/ThirdStepComponent";
import FifthStepComponent from "./steps/FifthStepComponent";
import SixthStepComponent from "./steps/SixthStepComponent";
import SeventhStepComponent from "./steps/SeventhStepComponent";
import EightStepComponent from "./steps/EightStepComponent";
import NinthStepComponent from "./steps/NinthStepComponent";
import TenthStepComponent from "./steps/TenthStepComponent";
import EleventhStepComponent from "./steps/EleventhStepComponent";
import TwelvthStepComponent from "./steps/TwelvthStepComponent";
import FinishedStepComponent from "./steps/FinishedStepComponent";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraAdjuster } from "./CameraAdjuster";
import { Camera, Vector3 } from "three";

// Interface for the structure of each step in state.json
interface Step {
  stepTitle: string;
  description: string;
  directions: string;
  objectsInFocus: string[];
  user_instructions?: string;
  mistakes?: {
    mistakeDescription: string;
    context: string;
    correctAnswer: string[];
    category: string;
    count: number;
    userAnswers: string[]; // Adjust as needed for dynamic content
  }[];
}

interface State {
  "1": Step;
  "2": Step;
  "3": Step;
  "4": Step;
  "5": Step;
  "6": Step;
  "7": Step;
  "8": Step;
  "9": Step;
  "10": Step;
  "11": Step;
  "12": Step;
}

type StateKey = keyof State;

// Correctly type your step component refs if they have specific methods or properties
interface StepComponentRef {
  replayAnimation?: () => void;
  // other methods or properties
}
export const getClassNameForNext = (isDisabled : boolean) : string => {
  let str = "mb-2 flex-grow transform rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 px-4 py-2 font-bold text-white transition duration-300 hover:scale-105 ";
  if (isDisabled) str += "cursor-not-allowed bg-gray-400 opacity-50";
  return str;
}

export const setNextDisabled = (nextButtonRef : React.RefObject<HTMLButtonElement>) => {
  if(nextButtonRef && nextButtonRef.current) {
    nextButtonRef.current.disabled = true;
    nextButtonRef.current.className = getClassNameForNext(true);
  }
}

export const setNextEnabled = (nextButtonRef : React.RefObject<HTMLButtonElement>) => {
  if(nextButtonRef && nextButtonRef.current) {
    nextButtonRef.current.disabled = false;
    nextButtonRef.current.className = getClassNameForNext(false);
  }
}
export default function Experience() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const key = currentStep.toString() as StateKey;
  const stepData = state[key]; // Safe indexing
  const stepRefs = useRef<Record<number, StepComponentRef>>({});
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const replayButtonRef = useRef<HTMLButtonElement>(null);

  const cameraControlsRef = useRef<Camera>(null);
  const [nextButtonTempDisabled, setNextButtonTempDisabled] = useState(false);
  const { mutate: updateProgress } = api.lab.updateLabProgress.useMutation();
  const { user } = useUser();
  const userId = user?.id ?? null;
  const { data: lab, refetch: labRefetch, isLoading: labLoading } = api.lab.getLabById.useQuery({ id: userId+"1" });
  
  // useEffect on first load to extract current step
  useEffect(() => {
    if (!userId || labLoading) return;
    const fetchProgress = async () => {
      labRefetch().then((res) => {
        //console.log(res.data);
        if (res.data) {
          //console.log("Progress: ", res.data.progress);
          setCurrentStep(res.data.progress);
        }
      }).catch((error) => {
        console.error('Error fetching lab progress:', error);
      });
    };
    fetchProgress();
  }, [userId, labLoading]);
  


  const handleNextStep = () => {
    if (currentStep < Object.keys(state).length) {
      setCurrentStep(currentStep + 1);
      //console.log("Current Step: ", currentStep);
      setNextDisabled(nextButtonRef);
      if (userId) {
        updateProgress({ id: userId+"1", userId: userId, progress: currentStep});
      }
      
    }
  };
  // setCurrentStep(currentStep); extracted from backend 
  // empty arr as dependency 

  const handleReplayAnimation = () => {
    const currentStepRef = stepRefs.current[currentStep];
    if (currentStepRef && currentStepRef.replayAnimation) {
      currentStepRef.replayAnimation();
    }
  };

  const stepsWithRefs = new Set([4, 5, 6, 7, 8, 10]); // Add other steps as needed

  // Check if the current step has a replay animation
  const hasReplayAnimation: boolean = stepsWithRefs.has(currentStep);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          // near: 0.1,
          // far: 200,
          position: [11.57, 10.1, -0.314],
        }}
      >
        <CameraAdjuster />
        {/* <CameraControls makeDefault ref={cameraControlsRef} onStart={() => {
          cameraControlsRef.current?.setFocalOffset(0,-2.5,0, true);
        }}/> */}
        <OrbitControls minDistance={9} maxDistance={70} />

        <ambientLight intensity={1.6} />
        <directionalLight
          castShadow
          position={[1, 2, 3]}
          intensity={1.5}
          shadow-normalBias={0.04}
        />

        {/* Common elements like Table */}
        <Table scale={13} position-y={-1} />
        {/* Green-yellow plane */}
        <mesh
          receiveShadow
          position-y={-1}
          rotation-x={-Math.PI * 0.5}
          scale={65}
        >
          <planeGeometry  />
          <meshStandardMaterial color="greenyellow" />
        </mesh>

        {/* Conditional Rendering of Step Components */}
        {currentStep === 1 && <FirstStepComponent />}
        {currentStep === 2 && <SecondStepComponent nextButtonRef={nextButtonRef} />}
        {currentStep === 3 && <ThirdStepComponent nextButtonRef={nextButtonRef} />}
        {currentStep === 4 && (
          <FourthStepComponent
            ref={(el) => (stepRefs.current[4] = el as StepComponentRef)}
            nextButtonRef={nextButtonRef}
            replayAnimButtonRef={replayButtonRef}
          />
        )}
        {currentStep === 5 && (
          <FifthStepComponent
            ref={(el) => (stepRefs.current[5] = el as StepComponentRef)}
          nextButtonRef={nextButtonRef}
          />
        )}
        {currentStep === 6 && (
          <SixthStepComponent
            ref={(el) => (stepRefs.current[6] = el as StepComponentRef)}
            nextButtonRef={nextButtonRef}
          />
        )}
        {currentStep === 7 && (
          <SeventhStepComponent
            ref={(el) => (stepRefs.current[7] = el as StepComponentRef)}
            setIsAnimating={setIsAnimating}
            nextButtonRef={nextButtonRef}
          />
        )}
        {currentStep === 8 && (
          <EightStepComponent
            ref={(el) => (stepRefs.current[8] = el as StepComponentRef)}
            setIsAnimating={setIsAnimating}
            nextButtonRef={nextButtonRef}
          />
        )}
        {currentStep === 9 && (
          <NinthStepComponent nextButtonRef={nextButtonRef} />
        )}
        {currentStep === 10 && (
          <TenthStepComponent
            ref={(el) => (stepRefs.current[10] = el as StepComponentRef)}
            nextButtonRef={nextButtonRef}
          />
        )}
        {currentStep === 11 && (
          <EleventhStepComponent nextButtonRef={nextButtonRef} />
        )}
        {currentStep === 12 && (
          <TwelvthStepComponent nextButtonRef={nextButtonRef} />
        )}
        {currentStep === 13 && <FinishedStepComponent nextButtonRef={nextButtonRef} />}
        {/* ...add more steps as needed... */}
      </Canvas>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <div className="flex items-stretch justify-center">
          <div className="w-lg rounded-lg bg-gray-700 bg-opacity-80 p-6 text-center backdrop-blur-sm">
            <h1 className="mb-2 text-lg text-white">{stepData.stepTitle}</h1>
            <p className="text-white">{stepData.directions}</p>
            <p className=" pt-2 font-mono text-xs font-extralight text-fuchsia-300">
              {"user_instructions" in stepData
                ? stepData.user_instructions
                : null}
            </p>
          </div>
          <div className="ml-4 flex flex-col justify-between self-stretch">
            <button
              onClick={handleNextStep}
              disabled={
                currentStep === 13 || nextButtonTempDisabled
              }
              className={`mb-2 flex-grow transform rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 px-4 py-2 font-bold text-white transition duration-300 hover:scale-105 ${
                 currentStep === 13 || nextButtonTempDisabled
                  ? "cursor-not-allowed bg-gray-400 opacity-50"
                  : ""
              }`}
              ref={nextButtonRef}
            >
              Next Step
            </button>
            <button
              ref={replayButtonRef}
              onClick={handleReplayAnimation}
              disabled={isAnimating || !hasReplayAnimation}
              className={`flex-grow transform rounded-lg px-4 py-2 font-bold text-white transition duration-300 hover:scale-105 ${
                isAnimating || !hasReplayAnimation
                  ? "cursor-not-allowed bg-gray-400 opacity-50"
                  : "bg-gradient-to-r from-green-400 to-blue-500"
              }`}
            >
              Replay Animation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
