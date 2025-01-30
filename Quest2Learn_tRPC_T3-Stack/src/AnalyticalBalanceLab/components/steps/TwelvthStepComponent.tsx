import React, {
    useRef,
    useEffect,
    useImperativeHandle,
    forwardRef,
    useState,
  } from "react";
  import * as TWEEN from "@tweenjs/tween.js";
  import * as THREE from "three";
  import BalanceWithAnimations, { BalanceWithAnimationsHandles } from "../BalanceWithAnimations";
  import WeighingPaper from "../WeighingPaper";
  import { Bottle } from "../Bottle";
  import { BottleCap } from "../BottleCap";
  import { Spatula } from "../Spatula";
  import { Sphere } from "@react-three/drei";
  import AnswerBox from "../AnswerBox";
  import { Beaker } from "../Beaker";
import chartImg from './chart.jpg';
import { BalanceReadingRef } from "../BalanceReading";
import { setNextDisabled, setNextEnabled } from "../Experience";
  
interface TwelvthStepComponentProps {
  nextButtonRef: React.RefObject<HTMLButtonElement>;
}

const TwelvthStepComponent = forwardRef<THREE.Group, TwelvthStepComponentProps>(
  ({ nextButtonRef }, ref) => {
    const balanceWithAnimationsRef = useRef<BalanceWithAnimationsHandles>(null);
    const weighingPaperRef = useRef<THREE.Group>(null);
    const sphereRef = useRef<THREE.Mesh>(null);
    const [initialWeighingPaperPosition] = useState(new THREE.Vector3(0.6, 5.6, -0.02));
    const [initialWeighingPaperRotation] = useState(new THREE.Euler(0, 3.14 / 180 * 180, 0));
    const [initialSpherePos] = useState(new THREE.Vector3(0.01, 0.1, 0));
    const [sphereScale, setSphereScale] = useState(0);
    useEffect(() => {
      updateBalanceReadingAfterAddingPowder(0.0012);
      if (nextButtonRef && nextButtonRef.current) {
        setNextDisabled(nextButtonRef);
      }
    }, []);
  
    const updateBalanceReadingAfterAddingPowder = (num: number) => {
      if (balanceWithAnimationsRef.current) {
        balanceWithAnimationsRef.current.updateBalanceReading(num);
      }
    };
  
    return (
      <group>
        <BalanceWithAnimations
          isOpen={true}
          position={[0, 4.55, 0]}
          ref={balanceWithAnimationsRef}
        />
        <group position={[0.6, 5.6, -0.02]} ref={weighingPaperRef}>
          <WeighingPaper folded={true} rotation-y={(3.14 / 180) * 180} />
          <Sphere
            ref={sphereRef}
            scale={0.0}
            position={[0.01, 0.1, 0]}
            visible={true}
          />
        </group>
        <group>
          <BottleCap position={[2, 5.1, -2]} />
        </group>
        <group position={[2, 5, -2]}>
          <Bottle />
        </group>
        <group>
          <Spatula
            rotation-y={(3.14 / 180) * 90}
            scale={0.5}
            position={[2.5, 5, 0]}
          />
          <Sphere scale={0.05} position={[0, 0.05, 0.68]} />
        </group>
        <group position={[2.6, 4.9, -3]}>
          <Beaker rotation-y={(-3.14 / 180) * 90} />
          <Sphere position={[-0.6, 0, -0.2]} scale={0.2} />
        </group>
        <group position={[0, 7, 3]} scale={0.5}>
        <AnswerBox
          question="Using the following information you gathered, what was the net weight of the sample powder only?"
          correctAnswers={["0.5005 g", ".5005 g", "0.5005", ".5005", "0.5005g", ".5005g"]}
          onCorrectAnswer={() => {
            if (nextButtonRef && nextButtonRef.current) {
              setNextEnabled(nextButtonRef);
            }
          }}
          imageUrl="https://media.discordapp.net/attachments/773313587141672961/1173949610700578936/Screenshot_2023-11-14_060341.png?ex=6565d0c6&is=65535bc6&hm=a242149e5db348711ecbbc3fbc33965267783aca17c0f3914d5dd1aff0c01ae1&=&width=273&height=102"
        />
      </group>
      </group>
    );
  });
  
  export default TwelvthStepComponent;
  