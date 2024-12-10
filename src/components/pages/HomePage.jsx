import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getData } from "../utils/fetch-api-data";
import axios from "axios";
import LoadingScreen from "../LoadingScreen";
import { Button } from "../ui/button";

const HomePage = () => {
  const [localDateTime, setLocalDateTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchResponse, setMatchResponse] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    const dateTime = new Date().toISOString();
    setLocalDateTime(dateTime);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("_id:");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleTest = async () => {
    const res = await getData("/problem");
    console.log("Res secure : ", res);
  };

  const handleStartMatch = async () => {
    setIsLoading(true);
    const data = { startTime: localDateTime };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/start/match`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setMatchResponse(response.data);
      toast.success("Match started successfully!");
    } catch (error) {
      console.error("Error starting match:", error);
      toast.error("Failed to start match. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="flex justify-center py-2">
                <div className="scale-75">
                  <LoadingScreen />
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartMatch}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Start Match
              </button>
            )}
          </div>

          {matchResponse && (
            <div className="mt-4 p-4 border rounded-md">
              <h2 className="text-lg font-semibold mb-2">Match Status:</h2>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(matchResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
