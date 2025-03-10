// Button.js
import React from 'react';

const Button = ({ text, backgroundColor }) => {
  return (
    <button
      className={`text-white py-2 px-5 rounded hover:bg-opacity-80 focus:outline-none ${backgroundColor}`}
    >
      {text}
    </button>
  );
};

export default Button;
