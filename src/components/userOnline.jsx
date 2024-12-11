// WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
	const [ws, setWs] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const playerId = localStorage.getItem("_id:");
        console.log()
		if (playerId) {
			const wsInstance = new WebSocket(
				`${import.meta.env.VITE_ONLINE_STATUS}?playerId=${playerId}`
			);

			wsInstance.onopen = () => {
				console.log("WebSocket Connected");
				setIsConnected(true);
			};

			wsInstance.onclose = () => {
				console.log("WebSocket Disconnected");
				setIsConnected(false);
			};

			wsInstance.onerror = (error) => {
				console.error("WebSocket Error:", error);
				setIsConnected(false);
			};

			setWs(wsInstance);

			return () => {
				if (wsInstance) {
					wsInstance.close();
				}
			};
		}
        console.log(playerId,   isConnected);
	}, []);

	

	return (
		<WebSocketContext.Provider value={{ ws, isConnected}}>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
