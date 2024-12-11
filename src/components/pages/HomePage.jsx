import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getData } from "../utils/fetch-api-data";
import axios from "axios";
import LoadingScreen from "../LoadingScreen";
import { Button } from "../ui/button";
// import {useWebSocket} from "@/components/userOnline"

const HomePage = () => {
	const [localDateTime, setLocalDateTime] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [abortController, setAbortController] = useState(null);
	const navigate = useNavigate();
	const token = Cookies.get("token");

  useEffect(() => {
    // const { socket, isConnected } = useWebSocket();
    const dateTime = new Date().toISOString();
    setLocalDateTime(dateTime);
  }, []);

	const handleLogout = () => {
		Cookies.remove("token", { path: "/" });
		localStorage.removeItem("username:")
		localStorage.removeItem("_id:")
		toast.success("Logged out successfully!");
		navigate("/");
	};

  const handleTest = async () => {
    const res = await getData("/problem");
    console.log("Res secure : ", res);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal
        }
      );
      console.log(response)
      if (response.data === "Match creation failed.") {
        toast.error("Match creation failed. Please try again.");
      } else if (response.data === "Match cancelled due to opponent disconnect") {
        toast.error("Match creation failed. Please try again.");
      } else {
        toast.success("Match started successfully!");
        console.log(response.data)
        sessionStorage.setItem("matchID: ", response.data);
        navigate(`/match/${sessionStorage.getItem("matchID: ")}`);
      }
    } catch (error) {
      if (error.name === 'CanceledError') {
        toast.info('Match request cancelled');
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

  const matchID = sessionStorage.getItem("matchID: ");


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>

        <Button onClick={()=>navigate("/profile")}>Profile</Button>
      </div>
      <div className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Game Dashboard</h1>
          {token && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleTest}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Test Connection
          </button>

					<div className="relative">
						{isLoading ? (
							<div className="flex flex-col items-center gap-2 py-2">
								<div className="scale-75">
									<LoadingScreen />
								</div>
								<button
									onClick={handleCancelMatch}
									className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
								>
									Cancel Request
								</button>
							</div>
						) : matchID ? (
							<button
								onClick={() => navigate(`/match/${matchID}`)}
								className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
							>
								Continue Match
							</button>
						) : (
							<button
								onClick={handleStartMatch}
								className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
							>
								Start Match
							</button>
						)}
					</div>

					{/* {matchResponse && (
						<div className="mt-4 p-4 border rounded-md">
							<h2 className="text-lg font-semibold mb-2">Match Status:</h2>
							<pre className="whitespace-pre-wrap text-sm">
								{JSON.stringify(matchResponse, null, 2)}
							</pre>
						</div>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
