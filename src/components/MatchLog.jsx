import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const MatchLog = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("_id:");

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
    <div className="match-log overflow-y-auto p-2 w-full h-full overflow-auto gap-2">
      <p className="text-center p-1 text-lg font-bold mb-5">Match updates</p>
      {messages.length === 0 ? (
        <div className="text-gray-500 text-center">No match updates yet</div>
      ) : (
        messages.map((msg, index) => (
          <motion.div
            key={`${index}-${msg.timestamp}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
              msg.userId == userId
                ? "bg-primary text-background"
                : "bg-destructive text-background-foreground"
            } text-background rounded-md p-3 mb-2`}
          >
            <div
              className={`text-sm ${
                msg.userId == userId
                  ? " text-background"
                  : " text-white"
              }`}
            >
              {msg.message}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default MatchLog;
