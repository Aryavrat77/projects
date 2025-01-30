import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  CameraControlsProps,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import Table from "./Table";
// ...other necessary imports...

import state from "../state.json";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraAdjuster } from "./CameraAdjuster";
import { Camera, Vector3 } from "three";
import Step1LabObjectives from "./steps/01LabObjectives";
import Step2InventorySelection from "./steps/02SelectFromInventory";
import Step3PourToSeperatingFunnel from "./steps/03PourMixtureToSepFunnel";
import Step4PourWaterToSeperatingFunnel from "./steps/04PourWaterIntoSFunnel";
import Step5StopperTheSFunnel from "./steps/05PutStopper";
import Step10DrainSFunnel from "./steps/10DrainAqueousLayer";
import Step11PourOrganicLayer from "./steps/11PourOrganicLayer";
import Step12AddPowder from "./steps/12AddPowder";
import Step13Filter from "./steps/13FilterLiquid";
import Step14Finish from "./steps/14ObtainedOrganicProduct";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

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
export const getClassNameForNext = (isDisabled: boolean): string => {
  let str =
    "mb-2 flex-grow transform rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 px-4 py-2 font-bold text-white transition duration-300 hover:scale-105 ";
  if (isDisabled) str += "cursor-not-allowed bg-gray-400 opacity-50";
  return str;
};

export const setNextDisabled = (
  nextButtonRef: React.RefObject<HTMLButtonElement>,
) => {
  if (nextButtonRef && nextButtonRef.current) {
    nextButtonRef.current.disabled = true;
    nextButtonRef.current.className = getClassNameForNext(true);
  }
};

export const setNextEnabled = (
  nextButtonRef: React.RefObject<HTMLButtonElement>,
) => {
  if (nextButtonRef && nextButtonRef.current) {
    nextButtonRef.current.disabled = false;
    nextButtonRef.current.className = getClassNameForNext(false);
  }
};
export default function Experience() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const key = currentStep.toString() as StateKey;
  const stepData = state[key]; // Safe indexing
  const stepRefs = useRef<Record<number, StepComponentRef>>({});
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  // const replayButtonRef = useRef<HTMLButtonElement>(null);

  const cameraControlsRef = useRef<Camera>(null);
  const [nextButtonTempDisabled, setNextButtonTempDisabled] = useState(false);
  const { mutate: updateProgress } = api.lab.updateLabProgress.useMutation();
  const { user } = useUser();
  const userId = user?.id ?? null;
  const { data: lab, refetch: labRefetch, isLoading: labLoading } = api.lab.getLabById.useQuery({ id: userId+"3" });

  useEffect(() => {
    if (!userId || labLoading) return;
    const fetchProgress = async () => {
      labRefetch().then((res) => {
        if (res.data) {
          setCurrentStep(res.data.progress);
          //console.log("Progress: ", res.data.progress);
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
      if (userId) {
        updateProgress({ id: userId+"3", userId: userId, progress: currentStep});
      }
    }
  };

  const [loadingMessage, setLoadingMessage] = useState("Loading Resources");

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400">
          <div className="rounded-lg border border-transparent bg-black bg-opacity-30 p-6 shadow-lg backdrop-blur-lg backdrop-filter">
            <p className="text-lg font-thin text-white">{loadingMessage}</p>
          </div>
        </div>
      }
    >
      <div style={{ position: "relative", height: "100vh" }}>
        <Canvas
          shadows
          camera={{
            fov: 45,
            position: [11.57, 10.1, -0.314],
          }}
        >
          <color attach="background" args={["#404040"]} />
          <CameraAdjuster />
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
            <planeGeometry />
            <meshStandardMaterial color="gray" />
          </mesh>

          {/* Conditional Rendering of Step Components */}
          {currentStep === 1 && <Step1LabObjectives />}
          {currentStep === 2 && (
            <Step2InventorySelection nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 3 && (
            <Step3PourToSeperatingFunnel nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 4 && (
            <Step4PourWaterToSeperatingFunnel nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 5 && (
            <Step5StopperTheSFunnel nextButtonRef={nextButtonRef} />
          )}
          {/* {currentStep === 6 && (
            <Step6EmptyCollectionFlask nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 7 && (
            <Step7TurnOnHotWaterBath nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 8 && (
            <Step8TurnOnCondensorAndVacuum nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 9 && (
            <Step9CloseStopcock nextButtonRef={nextButtonRef} />
          )} */}
          {currentStep === 10 && (
            <Step10DrainSFunnel nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 11 && (
            <Step11PourOrganicLayer nextButtonRef={nextButtonRef} />
          )}
          {currentStep === 12 && (
            <Step12AddPowder nextButtonRef={nextButtonRef} />
          )}

          {currentStep === 13 && <Step13Filter nextButtonRef={nextButtonRef} />}
          {currentStep === 14 && <Step14Finish />}
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
                disabled={currentStep === 21 || nextButtonTempDisabled}
                className={`mb-0 flex-grow transform rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 px-4 py-2 font-bold text-white transition duration-300 hover:scale-105 ${
                  currentStep === 13 || nextButtonTempDisabled
                    ? "cursor-not-allowed bg-gray-400 opacity-50"
                    : ""
                }`}
                ref={nextButtonRef}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
