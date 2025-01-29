import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleSaveSignature: (signature: string) => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  isModalOpen,
  handleCloseModal,
  handleSaveSignature,
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg" style={{ width: '100%', maxWidth: '535px' }}>
        <h2 className="text-2xl font-bold mb-4">Sign Below</h2>
        <div>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: 'border border-gray-300' }}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handleCloseModal}>
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={(e) => {
              e.preventDefault(); // Prevent default form submission behavior
              sigCanvas.current?.clear();
            }}
          >
            Clear
          </button>
          <button
            className="bg-black text-white py-2 px-4 rounded"
            onClick={() => {
              const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || '';
              handleSaveSignature(dataURL);
              handleCloseModal();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;