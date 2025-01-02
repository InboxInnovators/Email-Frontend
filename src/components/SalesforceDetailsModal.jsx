import React from 'react';

const SalesforceDetailsModal = ({ details, onClose }) => {
  // Split the details string into an array of lines
  const formattedDetails = details.split('\n').map((line, index) => (
    <p key={index} className="whitespace-pre-wrap">{line}</p>
  ));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Salesforce Details</h2>
        <div className="text-sm text-gray-700">
          {formattedDetails}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesforceDetailsModal; 