import React, { useEffect } from "react";
import { Button } from "./ui/button";

const FinishGame = ({ handleFinishGame, pass }) => {
    
	return (
		<>
			{pass && (
				<Button
					onClick={handleFinishGame}
					size="sm"
					className="bg-green-700 text-white"
				>
					Finish Game
				</Button>
			)}
		</>
	);
};

export default FinishGame;
