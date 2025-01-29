import React from 'react';

interface TabProps {
  label: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tab: React.FC<TabProps> = ({ label, activeTab, setActiveTab }) => (
  <button
    className={`px-4 py-2 font-semibold ${activeTab === label ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
    onClick={() => setActiveTab(label)}
  >
    {label}
  </button>
);

export default Tab;