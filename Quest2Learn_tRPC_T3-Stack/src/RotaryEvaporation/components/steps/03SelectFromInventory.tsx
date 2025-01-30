import React, { forwardRef, useState } from "react";
import InventorySystem from "../InventorySystem";
import { setNextEnabled } from "../Experience";
import { RotavapWithHeatBathAnim } from "../rotavap/RotavapWithHeatOnAnim";
import { KeckClip } from "../KeckClip";
import { HundredMLFlask } from "../round-bottom-flasks/100mlRBFlask";
import { TwentyFiveMLFlask } from "../round-bottom-flasks/25mlRBFlask";
import { FiftyMLFlask } from "../round-bottom-flasks/50mlRBFlask";
import { BumpTrap } from "../BumpTrap";
import { OrganicProductBeaker } from "../BeakerWithSolution";
interface SelectedItems {
  [itemName: string]: boolean;
}
const requiredItems = new Set([
  "Rotary Evaporator",
  "Round-bottomed Flask",
  "Keck Clips",
  "Bump Trap",
  "Product Solution",
]);

const Step3InventorySelection = forwardRef<
  HTMLDivElement,
  { nextButtonRef: React.RefObject<HTMLButtonElement> }
>(({ nextButtonRef }, ref) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

  const handleItemSelection = (itemName: string) => {
    setSelectedItems((prev) => {
      const newSelectedItems = { ...prev, [itemName]: !prev[itemName] };

      // Check if all required items are selected
      const allSelected = Array.from(requiredItems).every(
        (item) => newSelectedItems[item],
      );

      console.log("AllSelected is " + allSelected);
      if (allSelected && nextButtonRef.current) {
        // nextButtonRef.current.disabled = false; // Enable the next
        setNextEnabled(nextButtonRef);
      }
      console.log(newSelectedItems);
      return newSelectedItems;
    });
  };

  return (
    <group>
      <InventorySystem
        onItemSelect={handleItemSelection}
        position={[0, 7.7, 0]}
        scale={0.6}
      />
      {selectedItems["Rotary Evaporator"] && (
        <RotavapWithHeatBathAnim position={[0, 5, 0]} />
      )}
      {selectedItems["Keck Clips"] && (
        <group position={[0.4, 5, -3.8]}>
          <KeckClip position={[0, 0, 0.6]} />
          <KeckClip />
        </group>
      )}
      {selectedItems["Round-bottomed Flask"] && (
        <group>
          <HundredMLFlask
            scale={0.8}
            isEmpty={true}
            position={[2.2, 4.9, -2.2]}
            rotation-y={(3.14 * 1) / 2}
          />
          <FiftyMLFlask position={[2.2, 5, 0]} rotation-y={(3.14 * 1) / 2} />
          <TwentyFiveMLFlask
            position={[2.2, 5, 2.2]}
            rotation-y={(3.14 * 1) / 2}
          />
        </group>
      )}
      {selectedItems["Bump Trap"] && (
        <BumpTrap position={[-0.5, 5.25, -4.2]} rotation-x={3.14 / 2} />
      )}
      {selectedItems["Product Solution"] && (
        <OrganicProductBeaker
          position={[0, 5, -2.2]}
          rotation-y={(3.14 / 180) * 180}
        />
      )}
    </group>
  );
});

export default Step3InventorySelection;
