import React, { useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

interface ConfirmationProps {
  message: string,
}

const Confirmation: React.FC<ConfirmationProps> = ({ message }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-green-500 text-white p-4 flex items-center justify-between rounded">
      <div className="flex items-center">
        <FiCheckCircle className="mr-2" />
        <span>{message}</span>
      </div>
      <button onClick={handleClose} className="text-white">
        <FiX />
      </button>
    </div>
  );
};

export default Confirmation;