import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
	const [ws, setWs] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	const initializeWebSocket = () => {
		const playerId = localStorage.getItem("_id:");
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
	};
	

	useEffect(() => {
		// Attempt to initialize on mount
	  console.log("app mounted");

		initializeWebSocket();

		// Listen for changes to localStorage (e.g., player ID being set)
		const handleStorageChange = (event) => {
			if (event.key === "_id:" && event.newValue) {
				initializeWebSocket();
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			if (ws) ws.close();
		};
	}, []);

	return (
		<WebSocketContext.Provider value={{ ws, isConnected }}>
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
