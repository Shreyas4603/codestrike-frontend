import React, { useEffect } from "react";

const FinishGame = ({ handleFinishGame, pass }) => {
    
	return (
		<>
			{pass && (
				<button
					onClick={handleFinishGame}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
				>
					Finish Game
				</button>
			)}
		</>
	);
};

export default FinishGame;
