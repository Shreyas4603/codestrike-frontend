import React, { useState, useEffect } from "react";

const PersistentTimer = () => {
  const initialTimeInSeconds = 30 * 60; // 30 minutes
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem("timer-end-time");
    if (storedTime) {
      const remainingTime = Math.max(0, Math.floor((storedTime - Date.now()) / 1000));
      return remainingTime;
    }
    return initialTimeInSeconds;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          localStorage.removeItem("timer-end-time");
          clearInterval(interval);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) {
      localStorage.setItem("timer-end-time", Date.now() + timeLeft * 1000);
    }
  }, [timeLeft]);

  return (
    <div>
      {timeLeft > 0 ? (
        <h1 className="bg-primary w-fit text-center px-2 rounded-md text-background text-xl font-medium">Time remaining : {Math.floor(timeLeft / 60)} minutes {timeLeft % 60} seconds</h1>
      ) : (
        <h1>Time's up!</h1> 
      )}
    </div>
  );
};

export default PersistentTimer;
