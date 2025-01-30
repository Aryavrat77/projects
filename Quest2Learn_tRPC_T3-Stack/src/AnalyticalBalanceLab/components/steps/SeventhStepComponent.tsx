import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import BalanceWithAnimations from "../BalanceWithAnimations";
import WeighingPaper from "../WeighingPaper";
import { Bottle } from "../Bottle";
import { BottleCap } from "../BottleCap";
import { Spatula } from "../Spatula";
import { Html, Sphere } from "@react-three/drei";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { HtmlProps } from "@react-three/drei/web/Html";
import { setNextEnabled } from "../Experience";

interface SeventhStepComponentProps {
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  nextButtonRef: React.RefObject<HTMLButtonElement>;
  // Include other props as necessary
}
interface BalanceWithAnimationsRef {
  replayAnimation: () => Promise<void>;
  updateBalanceReading: (weight: number) => void; // Assuming it's a function that takes a number
}

interface WeighingPaperRef {
  replayAnimation: () => void;
}
const SeventhStepComponent = forwardRef<unknown, SeventhStepComponentProps>(
  ({ setIsAnimating, nextButtonRef }, ref) => {
    const balanceWithAnimationsRef = useRef<BalanceWithAnimationsRef>(null);
    const weighingPaperRef = useRef<WeighingPaperRef>(null);
    const bottleCapGroup = useRef(new THREE.Group());
    const spatulaGroup = useRef(new THREE.Group());
    const initialBottleCapPosition = new THREE.Vector3(0, 0, 0);
    const initialSpatulaPosition = new THREE.Vector3(2.5, 5.0, 0);
    const [endSpatulaPosition, setEndSpatulaPosition] = useState(
      new THREE.Vector3(),
    );
    const [endSpatulaRotation, setEndSpatulaRotation] = useState(
      new THREE.Euler(),
    );
    const [powderVisible, setPowderVisible] = useState(false);
    const [sphereScale, setSphereScale] = useState(0.0); // Initial scale of the sphere
    const [balanceReading, updateBalanceReading] = useState(0.0012);
    const [animationsCompleted, setAnimationsCompleted] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState({
      add: false,
      remove: false,
    });
    const [activeButton, setActiveButton] = useState<"remove" | "add" | null>(
      null,
    );
    const [netButtonPush, setNetButtonPush] = useState(0);

    const setButtonsDisabled = (disabled: boolean) => {
      setButtonDisabled({ add: disabled, remove: disabled });
    };

    useEffect(() => {
      if (netButtonPush == 5) {
        // Logic to enable the Next button
        // Assuming you have a ref to the Next button
        if (nextButtonRef.current) {
          setNextEnabled(nextButtonRef);
        }
      }
    }, [netButtonPush, nextButtonRef]);

    useEffect(() => {
      if (bottleCapGroup.current) {
      }
      updateBalanceReadingAfterAddingPowder(balanceReading);
      setPowderVisible(false);
      setIsAnimating(true);
      const animate = () => {
        requestAnimationFrame(animate);
        TWEEN.update();
      };
      requestAnimationFrame(animate);

      handleReplayAnimation(); // Start the initial animation sequence
      setIsAnimating(false);
    }, []);

    const updateBalanceReadingAfterAddingPowder = (num: number) => {
      if (balanceWithAnimationsRef.current) {
        balanceWithAnimationsRef.current.updateBalanceReading(num);
      }
      setButtonDisabled({ add: false, remove: num <= 0.0012 });
    };

    const moveBottleCap = () => {
      return new Promise((resolve) => {
        // Bottle cap animation logic
        // Move up
        new TWEEN.Tween(bottleCapGroup.current.position)
          .to({ y: bottleCapGroup.current.position.y + 1 }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() =>
            bottleCapGroup.current.position.copy(
              bottleCapGroup.current.position,
            ),
          )
          .onComplete(() => {
            // Move right
            new TWEEN.Tween(bottleCapGroup.current.position)
              .to({ z: bottleCapGroup.current.position.z - 1 }, 1000)
              .easing(TWEEN.Easing.Quadratic.Out)
              .onUpdate(() =>
                bottleCapGroup.current.position.copy(
                  bottleCapGroup.current.position,
                ),
              )
              .onComplete(() => {
                // Move down
                new TWEEN.Tween(bottleCapGroup.current.position)
                  .to({ y: bottleCapGroup.current.position.y - 2.1 }, 1000)
                  .easing(TWEEN.Easing.Quadratic.Out)
                  .onUpdate(() =>
                    bottleCapGroup.current.position.copy(
                      bottleCapGroup.current.position,
                    ),
                  )
                  .onComplete(resolve)
                  .start();
              })
              .start();
          })
          .start();
      });
    };

    const animateSpatula = () => {
      setIsAnimating(true);
      return new Promise((resolve) => {
        // Spatula animation logic
        // Move spatula up
        new TWEEN.Tween(spatulaGroup.current.position)
          .to({ y: initialSpatulaPosition.y + 2 }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

        // Rotate spatula (executes after moving up)
        setTimeout(() => {
          new TWEEN.Tween(spatulaGroup.current.rotation)
            .to({ x: (Math.PI / 180) * 90 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }, 1000);

        // Move spatula right and then down (executes after rotation)
        setTimeout(() => {
          // const targetXZPosition = initialBottleCapPosition.clone();
          const targetXZPosition = new THREE.Vector3(2, 5.1, -2);
          targetXZPosition.y = spatulaGroup.current.position.y;

          new TWEEN.Tween(spatulaGroup.current.position)
            .to({ x: targetXZPosition.x, z: targetXZPosition.z }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
              new TWEEN.Tween(spatulaGroup.current.position)
                .to({ y: initialSpatulaPosition.y + 1 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                  setPowderVisible(true);
                  setEndSpatulaPosition(spatulaGroup.current.position.clone());
                  setEndSpatulaRotation(spatulaGroup.current.rotation.clone());
                  setIsAnimating(false);
                  resolve(0);
                })
                .start();
            })
            .start();
        }, 2000);
      });
    };

    const handleReplayAnimation = async () => {
      setAnimationsCompleted(false);
      setIsAnimating(true);
      setSphereScale(0);
      updateBalanceReading(0.0012);
      updateBalanceReadingAfterAddingPowder(0.0012);
      bottleCapGroup.current.position.copy(initialBottleCapPosition); // Reset bottle cap position
      spatulaGroup.current.position.copy(initialSpatulaPosition); // Reset spatula position
      spatulaGroup.current.children
        .at(0)!
        .rotation.set(0, (3.14 / 180) * 90, 0); // Reset spatula rotation
      spatulaGroup.current.rotation.set(0, (3.14 / 180) * 0, 0); // Reset spatula rotation
      setPowderVisible(false); // Hide the powder initially

      await moveBottleCap(); // Wait for bottle cap animation to complete
      await animateSpatula(); // Then start spatula animation
      setAnimationsCompleted(true);
      setIsAnimating(false);
    };

    useImperativeHandle(ref, () => ({
      replayAnimation: handleReplayAnimation,
    }));

    const animateSpatulaForAdd = () => {
      setActiveButton("add");
      setIsAnimating(true);
      spatulaGroup.current.position.copy(endSpatulaPosition);
      spatulaGroup.current.rotation.copy(endSpatulaRotation);
      setPowderVisible(true);

      // Move spatula up
      new TWEEN.Tween(spatulaGroup.current.position)
        .to({ y: spatulaGroup.current.position.y + 1.5 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      // Rotate spatula on x axis (executes after moving up)
      setTimeout(() => {
        new TWEEN.Tween(spatulaGroup.current.rotation)
          .to({ y: Math.PI / 2 }, 1000) // 90 degrees
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
      }, 1000);

      setTimeout(() => {
        new TWEEN.Tween(spatulaGroup.current.position)
          .to({ x: 0.2, y: 5.8, z: 0 }, 1000) // Adjust distance as needed
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

        new TWEEN.Tween(spatulaGroup.current.rotation)
          .to({ z: Math.PI / 2 }, 1000) // 90 degrees
          .easing(TWEEN.Easing.Quadratic.Out)
          .onComplete(() => {
            setPowderVisible(false);
            setSphereScale(sphereScale + 0.03);
            const newReading = balanceReading + 0.1001;
            updateBalanceReading(newReading);
            updateBalanceReadingAfterAddingPowder(newReading);
            setIsAnimating(false);
          }) // Hide powder at the end
          .start();
      }, 2000);
      setTimeout(() => {
        setButtonDisabled({ add: false, remove: false });
        setActiveButton(null);
      }, 4000);
    };

    const handleAddWeight = () => {
      // Logic for adding weight
      setButtonsDisabled(true);
      animateSpatulaForAdd();
      setTimeout(() => {
        setButtonsDisabled(false);
      }, 4000);
      setNetButtonPush((prev) => prev + 1); // Adds 1
    };
    const handleAddExtraWeight = () => {
      setActiveButton("add");
      setButtonsDisabled(true);
      setIsAnimating(true);
      spatulaGroup.current.position.copy(endSpatulaPosition);
      spatulaGroup.current.rotation.copy(endSpatulaRotation);
      setPowderVisible(true);

      // Move spatula up
      new TWEEN.Tween(spatulaGroup.current.position)
        .to({ y: spatulaGroup.current.position.y + 1.5 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      // Rotate spatula on x axis (executes after moving up)
      setTimeout(() => {
        new TWEEN.Tween(spatulaGroup.current.rotation)
          .to({ y: Math.PI / 2 }, 1000) // 90 degrees
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
      }, 1000);

      setTimeout(() => {
        new TWEEN.Tween(spatulaGroup.current.position)
          .to({ x: 0.2, y: 5.8, z: 0 }, 1000) // Adjust distance as needed
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

        new TWEEN.Tween(spatulaGroup.current.rotation)
          .to({ z: Math.PI / 2 }, 1000) // 90 degrees
          .easing(TWEEN.Easing.Quadratic.Out)
          .onComplete(() => {
            setPowderVisible(false);
            setSphereScale(sphereScale + 0.06);
            const newReading = balanceReading + 0.2002;
            updateBalanceReading(newReading);
            updateBalanceReadingAfterAddingPowder(newReading);
            setIsAnimating(false);
            setButtonsDisabled(false);
            setNetButtonPush((prev) => prev + 2); // Adds 2
            // setActiveButton(null);
          }) // Hide powder at the end
          .start();
      }, 2000);

      // setTimeout(() => {
      //   // setButtonDisabled({ add: false, remove: false });
      //   setButtonsDisabled(false);
      //   setActiveButton(null);
      // }, 4000);
    };
    const handleRemoveWeight = () => {
      // Disable the add button and enable it after the animation
      setActiveButton("remove");
      setButtonsDisabled(true);

      // Reset spatula position to where the add weight animation ended
      spatulaGroup.current.position.copy(new THREE.Vector3(0.2, 5.8, 0));

      // This Euler thing is likely the most important key
      // to fixing the animations. DO NOT DELETE!
      // spatulaGroup.current.rotation.copy(new THREE.Euler(0, 0, 0)); //
      const newReading =
        balanceReading > 0.0012 ? balanceReading - 0.1001 : 0.0012;

      updateBalanceReading(newReading);
      updateBalanceReadingAfterAddingPowder(newReading);
      // Make the powder visible again
      setSphereScale((prevScale) => (prevScale > 0 ? prevScale - 0.03 : 0));
      setPowderVisible(true);

      // Start by moving the spatula back to its original position before the add weight animation
      new TWEEN.Tween(spatulaGroup.current.position)
        .to(
          {
            x: endSpatulaPosition.x - 0.7,
            y: endSpatulaPosition.y + 0.3,
            z: endSpatulaPosition.z,
          },
          1000,
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      new TWEEN.Tween(spatulaGroup.current.rotation)
        .to({ z: Math.PI / 2 }, 1000) // 90 degrees
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      // Then, reverse the rotation on the x and z axes
      setTimeout(() => {
        new TWEEN.Tween(spatulaGroup.current.rotation)
          .to({ ...endSpatulaRotation }, 1000) // Revert to initial rotation
          .easing(TWEEN.Easing.Quadratic.Out)
          .onComplete(() => {
            setPowderVisible(false);
            setButtonsDisabled(false);
            setActiveButton(null);
            setNetButtonPush((prev) => prev - 1); // Subtracts 1
          })
          .start();
      }, 1000);

      setTimeout(() => {
        // setButtonsDisabled(false);
        // setActiveButton(null);
      }, 3000);
    };

    // const buttonClass = (type) => {
    //   let classes =
    //     "rounded-md p-3 text-sm font-bold text-white shadow-lg transition-transform duration-300 focus:outline-none focus:ring ";
    //   classes += buttonDisabled[type] ? "opacity-50 " : "hover:scale-110 ";
    //   classes +=
    //     activeButton === type
    //       ? "ring-2 ring-offset-2 ring-gradient-to-br from-blue-500 to-purple-600 "
    //       : "";
    //   return classes;
    // };

    return (
      <group>
        <BalanceWithAnimations
          isOpen={false}
          position={[0, 4.55, 0]}
          ref={balanceWithAnimationsRef}
        />
        <group position={[0.6, 5.6, -0.02]}>
          <WeighingPaper
            folded={true}
            ref={weighingPaperRef}
            rotation-y={(3.14 / 180) * 180}
          />
          <Sphere scale={sphereScale} />
        </group>
        <group position={[2, 4.95, -2]}>
          <group ref={bottleCapGroup}>
            <BottleCap />
          </group>
          <Bottle />
        </group>
        <group ref={spatulaGroup} position={[0, 0, 0]}>
          <Spatula rotation-y={(3.14159 / 180) * 90} scale={0.5} />
          {powderVisible && <Sphere scale={0.05} position={[0, 0.05, 0.7]} />}
        </group>
        {animationsCompleted && (
          <Html
            position={[1, 8, 0]}
            transform
            rotation-y={(3.14 / 180) * 90}
            scale={0.4}
          >
            {/* Add Weight Button */}
            <button
              className={`rounded-full p-3 text-sm font-bold text-white shadow-lg transition-transform duration-300 focus:outline-none focus:ring ${
                buttonDisabled.add
                  ? "cursor-not-allowed bg-gray-300 opacity-50"
                  : "bg-gradient-to-br from-green-300 to-green-500 hover:scale-110 hover:from-green-200 hover:to-green-400"
              }`}
              onClick={handleAddExtraWeight}
              disabled={buttonDisabled.add}
            >
              Add+
            </button>

            <button
              className={`ml-4 rounded-full p-3 text-sm font-bold text-white shadow-lg transition-transform duration-300 focus:outline-none focus:ring ${
                buttonDisabled.add
                  ? "cursor-not-allowed bg-gray-300 opacity-50"
                  : "bg-gradient-to-br from-green-300 to-green-500 hover:scale-110 hover:from-green-200 hover:to-green-400"
              }`}
              onClick={handleAddWeight}
              disabled={buttonDisabled.add}
            >
              Add
            </button>

            {/* Remove Weight Button */}
            <button
              className={`ml-4 rounded-full p-3 text-sm font-bold text-white shadow-lg transition-transform duration-300 focus:outline-none focus:ring ${
                buttonDisabled.remove
                  ? "cursor-not-allowed bg-gray-300 opacity-50"
                  : "bg-gradient-to-br from-red-300 to-red-500 hover:scale-110 hover:from-pink-200 hover:to-red-400"
              }`}
              onClick={() => {
                setButtonsDisabled(true);
                handleRemoveWeight();
              }}
              disabled={buttonDisabled.remove}
            >
              Remove
            </button>
          </Html>
        )}
      </group>
    );
  },
);

export default SeventhStepComponent;
