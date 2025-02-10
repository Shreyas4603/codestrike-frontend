import React, { useState, useEffect, useRef } from "react";

const PersistentTimer = ({ onTimerEnd }) => {
	const initialTimeInSeconds = 30; // 30 minutes
	// Initialize timeLeft from localStorage (if available)
	const [timeLeft, setTimeLeft] = useState(() => {
		const storedTime = localStorage.getItem("timer-end-time");
		if (storedTime) {
			const remainingTime = Math.max(0, Math.floor((storedTime - Date.now()) / 1000));
			return remainingTime;
		}
		return initialTimeInSeconds;
	});

	// Use a ref to ensure the timer-end callback is called only once
	const timerEndedRef = useRef(false);

	useEffect(() => {
		// If time is up and we haven't yet signaled the parent
		if (timeLeft <= 0 && !timerEndedRef.current) {
			timerEndedRef.current = true;
			localStorage.removeItem("timer-end-time");
			if (onTimerEnd) {
				onTimerEnd();
			}
			return;
		}

		// Set up the interval to count down every second
		const interval = setInterval(() => {
			setTimeLeft((prevTime) => {
				const newTime = prevTime - 1;
				if (newTime <= 0 && !timerEndedRef.current) {
					timerEndedRef.current = true;
					localStorage.removeItem("timer-end-time");
					if (onTimerEnd) {
						onTimerEnd();
					}
					clearInterval(interval);
				}
				return newTime;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [timeLeft, onTimerEnd]);

	// Update the stored timer-end time whenever timeLeft changes
	useEffect(() => {
		if (timeLeft > 0) {
			localStorage.setItem("timer-end-time", Date.now() + timeLeft * 1000);
		}
	}, [timeLeft]);

	return (
		<div>
			{timeLeft > 0 ? (
				<h1 className="bg-primary w-fit text-center px-2 rounded-md text-background text-xl font-medium">
					Time remaining: {Math.floor(timeLeft / 60)} minutes {timeLeft % 60} seconds
				</h1>
			) : (
				<h1>Time's up!</h1>
			)}
		</div>
	);
};

export default PersistentTimer;
