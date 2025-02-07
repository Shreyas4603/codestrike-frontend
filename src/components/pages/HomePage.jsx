import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getData } from "../utils/fetch-api-data";
import axios from "axios";
import LoadingScreen from "../LoadingScreen";
import { Button } from "../ui/button";
import StartMatchButton from "../StartMatchButton";
import CancelMatchButton from "../CancelMatchButton";
import { useWebSocket } from "../userOnline";
import styles from "../pages/styles/HomePage.module.css";

const HomePage = () => {
	const [localDateTime, setLocalDateTime] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [abortController, setAbortController] = useState(null);
	const [profileData, setProfileData] = useState(null);
	const navigate = useNavigate();
	const token = Cookies.get("token");

	const getProfile = async () => {
		try {
			const res = await getData("users/profile");
			if (res.response.status === 200) {
				setProfileData(res.response.data);
			}
		} catch (error) {
			console.error("Failed to get profile:", error);
			toast.error("Failed to get profile");
		}
	};

	useEffect(() => {
		getProfile();
		setLocalDateTime(new Date().toISOString());

		// Initialize canvas-based purple gradient spotlight background:
		const canvas = document.getElementById("gradientCanvas");
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		// Function to resize the canvas and draw the spotlight
		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			drawPurpleSpotlight();
		}

		// Draw a purple gradient spotlight
		function drawPurpleSpotlight() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			// Calculate radius as the distance to the farthest corner
			const radius = Math.sqrt(centerX * centerX + centerY * centerY);
			// Create a radial gradient: bright purple at the center fading to dark at the edges
			const gradient = ctx.createRadialGradient(
				centerX,
				centerY,
				0,
				centerX,
				centerY,
				radius
			);
			gradient.addColorStop(0, "rgb(137, 27, 177)"); // Bright purple center
			gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)"); // Dark edge
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		// Clean up on unmount
		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	const handleTest = async () => {
		const res = await getData("/problem");
		console.log("Res secure:", res);
	};

	const handleStartMatch = async () => {
		setIsLoading(true);
		const controller = new AbortController();
		setAbortController(controller);

		const data = { startTime: localDateTime };
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/start/match`,
				data,
				{
					headers: { Authorization: `Bearer ${token}` },
					signal: controller.signal,
				}
			);

			if (response.data === "CANCELLED") {
				window.location.reload();
				return;
			}

			if (
				response.data === "Match creation failed." ||
				response.data === "Match cancelled due to opponent disconnect"
			) {
				toast.error("Match creation failed. Please try again.");
			} else {
				toast.success("Match started successfully!");
				sessionStorage.setItem("matchID: ", response.data);
				navigate(`/match/${sessionStorage.getItem("matchID: ")}`);
			}
		} catch (error) {
			if (error.name === "CanceledError") {
				toast.info("Match request cancelled");
			} else {
				console.error("Error starting match:", error);
				toast.error("Failed to start match. Please try again.");
			}
		} finally {
			setIsLoading(false);
			setAbortController(null);
		}
	};

	const handleCancelMatch = () => {
		if (abortController) {
			abortController.abort();
		}
	};

	function getRandomNumber() {
		return Math.floor(Math.random() * 10);
	}

	const matchID = sessionStorage.getItem("matchID: ");

	return (
		<div className={styles.container}>
			{/* Canvas Background with Purple Gradient Spotlight */}
			<canvas id="gradientCanvas" className={styles.backgroundCanvas}></canvas>

			{/* Existing Homepage Content */}
			<div className="mx-auto w-fit relative">
				<Button
					onClick={() => navigate("/profile")}
					className="w-52 text-xl rounded-none relative"
				>
					Profile
				</Button>
				<div className="w-0 h-80 absolute z-10 bottom-0 left-0 border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-background"></div>
				<div className="w-0 h-80 absolute z-10 bottom-0 right-0 border-l-[20px] border-l-transparent border-r-transparent border-b-[20px] border-background"></div>
			</div>
			<div className="h-full flex items-center justify-center">
				<div className="w-full max-w-md p-8 xl:pt-10 bg-re d-900 h-full">
					<div className="mb-5">
						<div className="ring-1 ring-primary/10 mx-auto w-fit relative p-1">
							<img
								src={`src/assets/playerCards/card_${getRandomNumber()}.webp`}
								alt=""
								className="xl:w-60 lg:w-40 aspect-[0.41875]"
							/>
							<div className="bg-background rounded aspect-square p-1 absolute -top-4 left-1/2 -translate-x-1/2 ring-1 ring-primary/10">
								<img
									src={`src/assets/badges/${profileData?.rank}.png`}
									className="w-6"
									alt=""
								/>
							</div>
							<div className="w-full bg-gray-200 text-black text-center absolute left-0 top-3/4 drop-shadow-lg">
								{profileData?.username}
							</div>
						</div>
					</div>
					<div className="space-y-16">
						<div className="relative w-full flex items-center justify-between">
							{isLoading ? (
								<CancelMatchButton handleCancelMatch={handleCancelMatch} />
							) : matchID ? (
								<button
									onClick={() => navigate(`/match/${matchID}`)}
									className="text-center bg-yellow-700 mx-auto w-1/2 text-md py-3 px-4"
								>
									Continue Match
								</button>
							) : (
								<StartMatchButton handleStartMatch={handleStartMatch} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
