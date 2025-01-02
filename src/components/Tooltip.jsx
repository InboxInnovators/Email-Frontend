import React, { useState } from 'react';

const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 transition-opacity duration-200 top-full mt-1 left-1/2 transform -translate-x-1/2 z-10">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;