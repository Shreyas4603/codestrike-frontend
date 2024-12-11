import React, { useState, useEffect, useCallback } from "react";

const MatchLog = ({ socket }) => {
	const [messages, setMessages] = useState([]);

	const handleMessage = useCallback((event) => {
		try {
			const data = JSON.parse(event.data);
			setMessages((prev) => [
				...prev,
				{
					message: data.message,
					userId: data.userId,
					timestamp: new Date().toISOString(),
				},
			]);
		} catch (error) {
			console.error("Error parsing WebSocket message:", error);
		}
	}, []);

	useEffect(() => {
		if (!socket) return;

		socket.addEventListener("message", handleMessage);

		return () => {
			socket.removeEventListener("message", handleMessage);
		};
	}, [socket, handleMessage]);

	return (
		<div className="match-log overflow-y-auto max-h-[150px] p-4 bg-gray-50 rounded-lg">
			{messages.length === 0 ? (
				<div className="text-gray-500 text-center">No match updates yet</div>
			) : (
				messages.map((msg, index) => (
					<div
						key={`${index}-${msg.timestamp}`}
						className="log-entry mb-2 p-3 bg-white rounded shadow-sm border-l-4 border-blue-500"
					>
						<div className="text-sm text-gray-700">{msg.message}</div>
						<div className="text-xs text-gray-500 mt-1">
							{new Date(msg.timestamp).toLocaleTimeString()}
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default MatchLog;
