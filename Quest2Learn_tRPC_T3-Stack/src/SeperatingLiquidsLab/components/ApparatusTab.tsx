import Image, { ImageProps, StaticImageData } from "next/image";
import React, { useState } from "react";
import chart from "./chart.png";
import beakerImg from "../images/beaker.png";
import sFunnelImg from "../images/separating funnel.png";
import filterFunnelImg from "../images/filter funnel.webp";
import bumpTrapImg from "../images/bump trap.png";
import eyeDropperImg from "../images/eyedropper.png";
import spatulaImg from "../images/spatula.png"
import stopperImg from "../images/stopper.png"
// Define a type for the item structure
type ApparatusItem = {
  name: string;
  image: StaticImageData;
  isCorrect: boolean;
};

// Define a type for the props
type ApparatusTabProps = {
  onItemSelect: (itemName: string, isCorrect: boolean) => void;
};

const ApparatusTab: React.FC<ApparatusTabProps> = ({ onItemSelect }) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );

  const apparatusItems: ApparatusItem[] = [
    { name: "Beaker", image: beakerImg, isCorrect: true },
    { name: "Seperating Funnel", image: sFunnelImg, isCorrect: true },
    // { name: 'Chinat', image: 'https://media.licdn.com/dms/image/D4E03AQE1jXqsDrb6MQ/profile-displayphoto-shrink_400_400/0/1677389871984?e=1705536000&v=beta&t=X3FtVJHOOA6gw6R00K0aigVN2HArylWl7l6-RSghgao', isCorrect: false },
    // { name: 'Eye Dropper', image: 'https://media.discordapp.net/attachments/901998109150834728/954019183279104010/IMG_20220317_093613.jpg?ex=655f5d9a&is=654ce89a&hm=10dc66ed01730eef74cc3279a0c2c2bb7f16c135cc606d039fb5604582244612&=&width=425&height=566', isCorrect: false },
    { name: "Filter Funnel w/ Filter Paper", image: filterFunnelImg, isCorrect: true },
    { name: "Eye Dropper", image: eyeDropperImg, isCorrect: false },
    { name: "Bump Trap", image: bumpTrapImg, isCorrect: false },
    { name: "Stopper", image: stopperImg, isCorrect: true },
    { name: "Spatula", image: spatulaImg, isCorrect: true },
    // { name: 'Siam', image: 'https://media.discordapp.net/attachments/1073485673375481937/1174145955658997821/20230727_090949.jpg?ex=656687a2&is=655412a2&hm=815545f561c09c37b922ce59f01f2ef954007d939f1ebcb8ce3e6eda6f086649&=&width=425&height=566', isCorrect: false },
    // ... more items
  ];

  const handleItemClick = (item: ApparatusItem) => {
    // Prevent item reselection if it's already selected
    if (selectedItems[item.name]) {
      return;
    }

    setSelectedItems((prev) => ({
      ...prev,
      [item.name]: item.isCorrect,
    }));

    if (onItemSelect && typeof onItemSelect === "function") {
      onItemSelect(item.name, item.isCorrect);
    }
  };

  // This function will retrieve the appropriate border color based on the item's selection status
  const getBorderColor = (itemName: string) => {
    if (itemName in selectedItems) {
      return selectedItems[itemName] ? "border-green-500" : "border-rose-400";
    }
    return "border-transparent";
  };

  const getItemClass = (itemName: string) => {
    if (itemName in selectedItems) {
      return selectedItems[itemName]
        ? "border-green-500 opacity-50"
        : "border-rose-400 opacity-50";
    }
    return "border-transparent";
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {apparatusItems.map((item, index) => (
        <div
          key={index}
          className={`cursor-pointer rounded-lg border-2 bg-white p-2 shadow-md ${getItemClass(
            item.name,
          )} select-none`}
          onClick={() => handleItemClick(item)}
        >
          <Image src={item.image} alt=""></Image>
          <p className="pt-2 text-center">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ApparatusTab;
