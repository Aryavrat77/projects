import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import uraniumImg from "../images/uranium.jpg"
import sampleImg from "../images/beakerWithSolution.png"

// Define a type for the chemical item structure
type ChemicalItem = {
  name: string;
  image: StaticImageData;
  isCorrect: boolean;
};

// Define a type for the props
type ChemicalsTabProps = {
  onItemSelect: (itemName: string, isCorrect: boolean) => void;
};

const ChemicalsTab: React.FC<ChemicalsTabProps> = ({ onItemSelect }) => {
  // Use a Record type for managing the selected state of chemical items
  const [selectedChemicals, setSelectedChemicals] = useState<Record<string, boolean>>({});

  const chemicalItems: ChemicalItem[] = [
    { name: 'Product Solution', image: sampleImg, isCorrect: true },
    { name: 'Uranium', image: uraniumImg, isCorrect: false },
    // { name: 'Jason', image: 'https://media.licdn.com/dms/image/D4D03AQGkBsDtj7HvSw/profile-displayphoto-shrink_400_400/0/1692380975651?e=1705536000&v=beta&t=lEbtRpoZUZU3AB5clx-R49G-2ssNasmu7-hjnFPR71M', isCorrect: false },
    // Add more items as needed
  ];

  const handleChemicalClick = (chemical: ChemicalItem) => {
    if (selectedChemicals[chemical.name] === undefined) { // Only allow clicking if not already selected
      setSelectedChemicals((prev) => ({
          ...prev,
          [chemical.name]: chemical.isCorrect,
      }));

      if (onItemSelect) {
          onItemSelect(chemical.name, chemical.isCorrect);
      }
    }
  };

  const getItemClasses = (chemicalName: string): string => {
    let classes = "bg-white p-2 rounded-lg shadow-md cursor-pointer border-2 ";
    if (selectedChemicals[chemicalName] !== undefined) {
      classes += selectedChemicals[chemicalName] ? 'border-green-500 opacity-50 cursor-not-allowed ' : 'border-rose-400 bg-red-200 opacity-50 cursor-not-allowed ';
    } else {
      classes += 'border-transparent ';
    }
    return classes;
  };

  return (
    <div className="grid grid-cols-6 gap-4 p-4 select-none">
        {chemicalItems.map((item, index) => (
          <div 
            key={index} 
            className={getItemClasses(item.name)}
            onClick={() => handleChemicalClick(item)}
          >
            <Image src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2 rounded-md" />
            <p className="text-center">{item.name}</p>
          </div>
        ))}
    </div>
  );
};

export default ChemicalsTab;
