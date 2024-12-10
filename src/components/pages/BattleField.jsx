import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import axios from 'axios'

const BattleField = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isMatchValid, setIsMatchValid] = useState(true);
	const [socket, setSocket] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const navigate = useNavigate();
	const { matchID } = useParams();

	useEffect(() => {
		const storedMatchID = sessionStorage.getItem("matchID: ");

		if (matchID !== storedMatchID) {
			setIsMatchValid(false);
			return;
		}

		const ws = new WebSocket(
			`${import.meta.env.VITE_WEBSOCKET_URL}/${sessionStorage.getItem("matchID: ")}`
		);

		ws.onopen = () => {
			setSocket(ws);
			setIsConnected(true);
			setIsLoading(false);
			console.log("WebSocket Connected");

			const startTime = new Date().toISOString();
			axios
				.get(`${import.meta.env.VITE_BACKEND_URL}/api/match/${storedMatchID}}`, {
					params: {
						startTime: startTime,
					},
				})
				.then((response) => {
					console.log("API Response:", response.data);
				})
				.catch((error) => {
					console.error("API Error:", error);
				});
		};

		ws.onclose = () => {
			setIsConnected(false);
			console.log("WebSocket Disconnected");
		};

		ws.onerror = (error) => {
			console.error("WebSocket Error:", error);
			setIsConnected(false);
		};

		ws.onmessage = (event) => {
			console.log("Received:", event.data);
		};

		return () => {
			if (ws) {
				ws.close();
			}
		};
	}, [matchID]);

	const handleEndMatch = () => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.close();
			console.log("WebSocket Closed");
		}
		setIsConnected(false);
		sessionStorage.removeItem("matchID: ");
		navigate("/home");
	};

	return (
		<>
			<div>Connection Status: {isConnected ? "Connected" : "Disconnected"}</div>
			<button onClick={() => navigate("/home")}>Back</button>
			<br />
			<button onClick={handleEndMatch}>End match</button>
		</>
	);
};



export default BattleField;
