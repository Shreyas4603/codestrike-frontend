import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Home, Award, CheckCircle, XCircle, Code } from "lucide-react";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";

const MatchSummary = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const [matchResult, setMatchResult] = useState(null);
	const [userCode, setUserCode] = useState("");
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
				const endpoint = `api/end/${id}`;
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setData(response.data);
				processMatchResult(response.data);

				const savedCode = localStorage.getItem("code");
				if (savedCode) {
					setUserCode(savedCode);
				}

				
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [matchID]);

	const processMatchResult = (matchData) => {
		const currentPlayerId = localStorage.getItem("_id:");
		const isPlayer1 = matchData.player1Id === currentPlayerId;

		const player = isPlayer1
			? {
					id: matchData.player1Id,
					executionTime: matchData.p1ExecutionTime,
					totalCases: matchData.player1TotalTestCases,
					passed: matchData.player1Passed,
					failed: matchData.player1Failed,
					deltaRating: matchData.p1DeltaRating,
			  }
			: {
					id: matchData.player2Id,
					executionTime: matchData.p2ExecutionTime,
					totalCases: matchData.player2TotalTestCases,
					passed: matchData.player2Passed,
					failed: matchData.player2Failed,
					deltaRating: matchData.p2DeltaRating,
			  };

		const opponent = isPlayer1
			? {
					id: matchData.player2Id,
					executionTime: matchData.p2ExecutionTime,
					totalCases: matchData.player2TotalTestCases,
					passed: matchData.player2Passed,
					failed: matchData.player2Failed,
					deltaRating: matchData.p2DeltaRating,
			  }
			: {
					id: matchData.player1Id,
					executionTime: matchData.p1ExecutionTime,
					totalCases: matchData.player1TotalTestCases,
					passed: matchData.player1Passed,
					failed: matchData.player1Failed,
					deltaRating: matchData.p1DeltaRating,
			  };

		const playerResult =
			player.deltaRating > 0 ? "VICTORY" : player.deltaRating < 0 ? "DEFEAT" : "DRAW";

		setMatchResult({ player, opponent, playerResult });
	};

	const handleNavigateHome = () => {
		localStorage.removeItem("code");
		sessionStorage.removeItem("matchID: ");
		localStorage.setItem("passedAll", false);
		localStorage.removeItem("battleState");
		localStorage.removeItem("matchDetails");
		navigate("/home");
	};

	const getCardStyle = (deltaRating) => {
		if (deltaRating > 0) return "border-green-500 bg-green-100/50";
		if (deltaRating < 0) return "border-red-500 bg-red-100/50";
		return "border-gray-500 bg-gray-100/50";
	};

	const PlayerCard = ({ player, title }) => (
		<Card className={`w-full border-2 ${getCardStyle(player.deltaRating)}`}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Award
						className={
							player.deltaRating > 0
								? "text-green-500"
								: player.deltaRating < 0
								? "text-red-500"
								: "text-gray-500"
						}
					/>
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-2">
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4" />
						<span className="font-medium">Execution Time:</span>
						<span>{player.executionTime}ms</span>
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle className="text-green-500 w-4 h-4" />
						<span className="font-medium">Passed:</span>
						{player.passed}/{player.totalCases}
					</div>
					<div className="flex items-center gap-2">
						<XCircle className="text-red-500 w-4 h-4" />
						<span className="font-medium">Failed:</span>
						{player.failed}/{player.totalCases}
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium">Rating Change:</span>
						<span
							className={player.deltaRating > 0 ? "text-green-500" : "text-red-500"}
						>
							{player.deltaRating > 0 ? "+" : ""}
							{player.deltaRating}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-5xl mx-auto">
				{matchResult && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<PlayerCard player={matchResult.player} title="Your Performance" />
						<PlayerCard player={matchResult.opponent} title="Opponent's Performance" />
					</div>
				)}

				{userCode && (
					<Card className="mb-6">
						<CardContent>
							<Accordion type="single" collapsible>
								<AccordionItem value="code">
									<AccordionTrigger className="flex items-center gap-2">
										<Code className="w-5 h-5" />
										Your Solution
									</AccordionTrigger>
									<AccordionContent>
										<div className="bg-muted rounded-lg p-4 overflow-x-auto">
											<pre className="text-sm">
												<code>{userCode}</code>
											</pre>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</CardContent>
					</Card>
				)}

				<div className="flex justify-center mt-6">
					<Button onClick={handleNavigateHome} className="flex items-center gap-2">
						<Home className="w-4 h-4" />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MatchSummary;
