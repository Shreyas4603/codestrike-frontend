// New file for the WebSocket hook
import { useState, useEffect } from "react";

export const useWebSocket = (url) => {
	const [socket, setSocket] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!url) return;

		const ws = new WebSocket(url);

		ws.onopen = () => {
			setSocket(ws);
			setIsConnected(true);
			console.log("WebSocket Connected");
		};

        ws.onmessage=()=>{
            ws.onmessage = (event) => {
                console.log("Message: ", event.data);
            };
        }
		ws.onclose = () => {
			setIsConnected(false);
			console.log("WebSocket Disconnected");
		};

		ws.onerror = (error) => {
			console.error("WebSocket Error:", error);
			setIsConnected(false);
		};

		return () => ws?.close();
	}, [url]);

	return { socket, isConnected };
};
