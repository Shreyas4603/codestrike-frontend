import React from "react";

const StartMatchButton = ({handleStartMatch}) => {
  return (
    <button
      onClick={handleStartMatch}
      className="text-center bg-green-700 mx-auto w-1/2 text-md py-3 px-4"
    >
      Start Match
    </button>
  );
};

export default StartMatchButton;
