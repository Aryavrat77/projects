import { GroupProps, ThreeEvent } from "@react-three/fiber";
import { Object3D } from "three";

// Use the following interface to generate lab components for a lab that is based on ______.
export interface Props extends GroupProps {
  startAnimationDelay?: number;
  animationHasAlreadyPlayed?: boolean;
  onClick?: ((event: ThreeEvent<MouseEvent>) => void) | undefined;
  // Add more props here 
}

export interface StepProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>; // pass in the next step button reference
  // maybe look into a previous step button?
  prevButtonRef?: React.RefObject<HTMLButtonElement>; // pass in the previous step button reference
}