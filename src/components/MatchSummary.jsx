import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const MatchSummary = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			const token = Cookies.get("token");
			if (!token) {
				console.error("No token found");
				setLoading(false);
				return;
			}

			try {
				const endpoint = `/api/end/${id}`;
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(response);
				setData(response.data);
				localStorage.removeItem("battleState")
				localStorage.removeItem("matchDetails")
				sessionStorage.removeItem("matchID: ")
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h2>Match Summary</h2>
			<div>
				<p>
					<strong>Match ID:</strong> {data.matchId}
				</p>
				<p>
					<strong>Problem ID:</strong> {data.problemId}
				</p>
			</div>

			{/* Player 1 Info */}
			<div>
				<h3>Player 1</h3>
				<p>
					<strong>ID:</strong> {data.player1Id}
				</p>
				<p>
					<strong>Execution Time:</strong> {data.p1ExecutionTime}
				</p>
				<p>
					<strong>Total Test Cases:</strong> {data.player1TotalTestCases}
				</p>
				<p>
					<strong>Passed:</strong> {data.player1Passed}
				</p>
				<p>
					<strong>Failed:</strong> {data.player1Failed}
				</p>
				<p>
					<strong>Rating Change:</strong> {data.p1DeltaRating}
				</p>
				<p>
					<strong>Result:</strong> {data.p1DeltaRating > 0 ? "WIN" : "LOSE"}
				</p>
			</div>

			{/* Player 2 Info */}
			<div>
				<h3>Player 2</h3>
				<p>
					<strong>ID:</strong> {data.player2Id}
				</p>
				<p>
					<strong>Execution Time:</strong> {data.p2ExecutionTime}
				</p>
				<p>
					<strong>Total Test Cases:</strong> {data.player2TotalTestCases}
				</p>
				<p>
					<strong>Passed:</strong> {data.player2Passed}
				</p>
				<p>
					<strong>Failed:</strong> {data.player2Failed}
				</p>
				<p>
					<strong>Rating Change:</strong> {data.p2DeltaRating}
				</p>
				<p>
					<strong>Result:</strong> {data.p2DeltaRating > 0 ? "WIN" : "LOSE"}
				</p>
			</div>

			{/* Navigation Button */}
			<div>
				<button onClick={() => navigate("/home")}>Go to Home</button>
			</div>
		</div>
	);
};

export default MatchSummary;
