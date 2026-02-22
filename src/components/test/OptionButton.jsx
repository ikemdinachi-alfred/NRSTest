import React from "react";

const OptionButton = ({ option, isSelected, onClick, label }) => {
  return (
    <button
      className={`option-button ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span className="option-label">{label}.</span>
      <span className="option-text">{option}</span>
      {isSelected && <span className="checkmark">✓</span>}
    </button>
  );
};

export default OptionButton;
