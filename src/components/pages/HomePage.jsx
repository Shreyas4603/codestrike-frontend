import React, { useState, useEffect, useContext } from "react";
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
// import {useWebSocket} from "@/components/userOnline"

const HomePage = () => {
  const [localDateTime, setLocalDateTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [profileData, setprofileData] = useState();

  // const { closeWebSocket, isConnected } = useWebSocket();


  const getProfile = async () => {
    try {
      const res = await getData("users/profile");
      if (res.response.status == 200) {
        setprofileData(res.response.data);
      }
    } catch (error) {
      console.error("Failed to get profile : ", error);

      toast.error("Failed to get profile");
    }
  };

  useEffect(() => {
    getProfile();
    // const { socket, isConnected } = useWebSocket();
    const dateTime = new Date().toISOString();
    setLocalDateTime(dateTime);
  }, []);



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
          signal: controller.signal,
        }
      );  
      console.log(response);
      if(response.data=="CANCELLED"){
        window.location.reload()
        return;
      }

      if (response.data === "Match creation failed.") {
        toast.error("Match creation failed. Please try again.");
      } else if (
        response.data === "Match cancelled due to opponent disconnect"
      ) {
        toast.error("Match creation failed. Please try again.");
      } else {
        toast.success("Match started successfully!");
        console.log(response.data);
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
    <div className="h-screen overflow-hidden bg-[url(src/assets/bg.jpg)] bg-cover">
      <div className="mx-auto w-fit relative">
        <Button
          onClick={() => navigate("/profile")}
          className="w-52  text-xl    rounded-none relative"
        >
          Profile
        </Button>
        <div class="w-0 h-80 absolute z-10 bottom-0 left-0  border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-background bg-"></div>
        <div class="w-0 h-80 absolute z-10 bottom-0 right-0 border-l-[20px] border-l-transparent border-r-transparent border-b-[20px] border-background"></div>
      </div>
      <div className="h-full flex items-center justify-center ">
        <div className="w-full max-w-md p-8 xl:pt-10 bg-re d-900 h-full">
          <div className="mb-5">
            <div className="ring-1 ring-primary/10 mx-auto w-fit relative p-1">
              <img
                src={`src/assets/playerCards/card_${getRandomNumber()}.webp`}
                alt=""
                srcset=""
                className="xl:w-60 lg:w-40  aspect-[0.41875]"
              />
              <div className="bg-background rounded aspect-square p-1 absolute -top-4 left-1/2 -translate-x-1/2 ring-1 ring-primary/10">
                <img
                  src={`src/assets/badges/${profileData?.rank}.png`}
                  className="w-6"
                  alt=""
                />
              </div>

              <div className="w-full bg-gray-200 text-black text-center absolute left-0  top-3/4 drop-shadow-lg">
                {profileData?.username}
              </div>
            </div>
          </div>
          {/* <div className="flex justify-between items-center mb-8 ">
            {token && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            )}
          </div> */}

          <div className="space-y-16  ">
            {/* <button
              onClick={handleTest}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Test Connection
            </button> */}

            <div className="relative w-full flex items-center justify-between ">
              {isLoading ? (
                <CancelMatchButton handleCancelMatch={handleCancelMatch}/>
              ) : matchID ? (
                <button
                  onClick={() => navigate(`/match/${matchID}`)}
                  className="text-center bg-yellow-700 mx-auto w-1/2 text-md py-3 px-4"
                >
                  Continue Match
                </button>
              ) : (
                <StartMatchButton handleStartMatch={handleStartMatch}/>
              )}
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default HomePage;
