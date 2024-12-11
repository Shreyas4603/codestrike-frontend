import React, { useEffect, useState, useCallback } from "react";
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import axios from "axios";
import Markdown from "marked-react";
import CodeEditor from "../CodeEditor";
import Cookies from "js-cookie";
import { useWebSocket } from "@/components/customHook/WebSocket";
import MatchLog from "../MatchLog";

const BattleField = () => {
	const [battleState, setBattleState] = useState({
		isLoading: true,
		error: null,
		matchDetails: JSON.parse(localStorage.getItem("matchDetails")) || null,
		code: localStorage.getItem("code") || "print('Hello')",
		startTime: null,
		endTime: null,
		status: "PENDING",
		result: null,
		playerResults: {}, // Track player results
	});
	const [pass, setPass] = useState(false)
	const navigate = useNavigate();
	const { id:matchID } = useParams();
	const { socket, isConnected } = useWebSocket(
		matchID ? `${import.meta.env.VITE_WEBSOCKET_URL}/${matchID}` : null
	);

	const handleWebSocketMessage = useCallback((event) => {
		try {
			console.log("event", event.data);
			const data = JSON.parse(event.data);
			
			if (data.message && data.userId) {
				// Extract score from message if it contains test results
				const scoreMatch = data.message.match(/passed (\d+) \/ (\d+)/);
				if (scoreMatch) {
					const [, passed, total] = scoreMatch;
					setBattleState((prev) => ({
						...prev,
						playerResults: {
							...prev.playerResults,
							[data.userId]: {
								passed: parseInt(passed),
								total: parseInt(total),
								timestamp: new Date().toISOString(),
							},
						},
					}));
				}
				if (battleState.playerResults[data.userId]?.passed === battleState.playerResults[data.userId]?.total) {
					// Finish Game Button
					setPass("True")
				}
			}else if(data.message == "MATCH_END"){
				navigate(`/match-summary/${sessionStorage.getItem("matchID: ")}`);
				console.log("Game finished!");
			}
		} catch (error) {
			console.error("Error handling WebSocket message:", error);
		}
	}, []);


	useEffect(() => {
	  console.log("Battlefield mounted");
	
	  return () => {
		console.log("Battlefield unmounted");
	  };
	}, []);
	
	useEffect(() => {
		if (!socket) return;
		console.log("iam here")
		socket.addEventListener("message", handleWebSocketMessage);

		return () => {
			socket.removeEventListener("message", handleWebSocketMessage);
		};
	}, [socket, handleWebSocketMessage]);
	

	// ... (keep existing fetchMatchDetails useEffect)

	const handleEndMatch = useCallback(() => {
		const endTime = new Date().toISOString();

		setBattleState((prev) => ({
			...prev,
			endTime,
			status: "COMPLETED",
		}));

		if (socket?.readyState === WebSocket.OPEN) {
			socket.close();
		}

		localStorage.removeItem("matchDetails");
		localStorage.removeItem("code");
		localStorage.removeItem("battleState");
		sessionStorage.removeItem("matchID: ");

		navigate("/home");
	}, [socket, navigate]);

	const handleCodeChange = useCallback((newCode) => {
		setBattleState((prev) => ({ ...prev, code: newCode }));
		localStorage.setItem("code", newCode);
	}, []);

	const handleSubmitCode = useCallback(async () => {
		try {
			const data = {
				code: localStorage.getItem("code"),
				language: "python",
				matchId: matchID,
			};

			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit`, data, {
				headers: {
					Authorization: `Bearer ${Cookies.get("token")}`,
				},
			});
			console.log(response.data.details)
			// setBattleState((prev) => ({
			// 	...prev,
			// 	status: "SUBMITTED",
			// }));
		} catch (error) {
			console.error("Error submitting code:", error);
			setBattleState((prev) => ({
				...prev,
				error: "Failed to submit code",
			}));
		}
	}, [matchID]);

	const handleFinishGame = useCallback(() => {
		navigate(`/match-summary/${sessionStorage.getItem("matchID: ")}`)
		console.log("Game finished!");
	}, []);

	if (!battleState.matchDetails) {
		return <NotFound />;
	}

	return (
		<div className="battlefield-container">
			<div className="battlefield-header m-4">
				<div className="connection-status">
					Status: {isConnected ? "Connected" : "Disconnected"}
				</div>
				<div className="battlefield-actions space-x-4">
					<button
						onClick={() => navigate("/home")}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
					>
						Back
					</button>
					<button
						onClick={handleEndMatch}
						className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					>
						End match
					</button>
					<button
						onClick={handleSubmitCode}
						className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
					>
						Submit
					</button>
					{pass && (
						<button
							onClick={handleFinishGame}
							className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
						>
							Finish Game
						</button>	
					)}
				</div>
			</div>

			<div className=" gap-4 m-4 flex">
				<div className="problem-statement lg:w-1/3 flex-col">
					<div className="h-2/3">
						<Markdown>{battleState.matchDetails.problemStatement}</Markdown>
					</div>
					<div className="match-log-container m-4 h-1/3">
						<MatchLog socket={socket} />
					</div>
					{/* Player Results Section */}
					{/* {Object.entries(battleState.playerResults).length > 0 && (
						<div className="mt-4 p-4 bg-gray-50 rounded-lg">
							<h3 className="text-lg font-semibold mb-2">Player Results</h3>
							{Object.entries(battleState.playerResults).map(([userId, result]) => (
								<div key={userId} className="mb-2">
									<div className="text-sm">Player {userId.slice(-4)}</div>
									<div className="text-sm font-medium">
										Score: {result.passed}/{result.total}(
										{((result.passed / result.total) * 100).toFixed(1)}%)
									</div>
								</div>
							))}
						</div>
					)} */}
				</div>

				<div className="code-editor lg:w-2/3">
					<CodeEditor
						code={battleState.code}
						onChange={handleCodeChange}
						readOnly={battleState.status === "SUBMITTED"}
					/>
				</div>
			</div>
			{/* 
			<div className="match-log-container m-4">
				<MatchLog socket={socket} />
			</div> */}
		</div>
	);
};

export default BattleField;
