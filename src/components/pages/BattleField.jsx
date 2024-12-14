import React, { useEffect, useState, useCallback } from "react";
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import axios from "axios";
import Markdown from "marked-react";
import CodeEditor from "../CodeEditor";
import Cookies from "js-cookie";
import { useWebSocket } from "@/components/customHook/WebSocket";
import MatchLog from "../MatchLog";
import FinishGame from "../FinishGame";
// import PersistentTimer from "../PersistentTimer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PersistentTimer from "../PersistentTimer";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { OctagonX, PartyPopper } from "lucide-react";

const BattleField = () => {
  const username = localStorage.getItem("username:");

  const [opponentData, setopponentData] = useState({});

  const [battleState, setBattleState] = useState({
    isLoading: true,
    error: null,
    matchDetails: JSON.parse(localStorage.getItem("matchDetails")) || null,
    code: localStorage.getItem("code") || "print('Hello')",
    startTime: null,
    endTime: null,
    status: "PENDING",
    result: null,
    playerResults: {}, // Track player results
  });
  // const [pass, setPass] = useState(false)
  const navigate = useNavigate();
  const { id: matchID } = useParams();
  const { socket, isConnected } = useWebSocket(
    matchID ? `${import.meta.env.VITE_WEBSOCKET_URL}/${matchID}` : null
  );

  const [allPass, setallPass] = useState(localStorage.getItem("passedAll"));
  const [submitResults, setsubmitResults] = useState(null);
  const handleWebSocketMessage = useCallback((event) => {
    try {
      // console.log("event", event.data);
      const data = JSON.parse(event.data);

      // if (data.message && data.userId) {
      // 	// Extract score from message if it contains test results
      // 	const scoreMatch = data.message.match(/passed (\d+) \/ (\d+)/);
      // 	if (scoreMatch) {
      // 		const [, passed, total] = scoreMatch;
      // 		setBattleState((prev) => ({
      // 			...prev,
      // 			playerResults: {
      // 				...prev.playerResults,
      // 				[data.userId]: {
      // 					passed: parseInt(passed),
      // 					total: parseInt(total),
      // 					timestamp: new Date().toISOString(),
      // 				},
      // 			},
      // 		}));
      // 	}
      // 	if (battleState.playerResults[data.userId]?.passed === battleState.playerResults[data.userId]?.total) {
      // 		// Finish Game Button
      // 		localStorage.setItem("passedAll", true)
      // 	}
      // }else
      if (data.message == "MATCH_END") {
        navigate(`/match-summary/${sessionStorage.getItem("matchID: ")}`);
        console.log("Game finished!");
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }, []);

  useEffect(() => {
    console.log("Battlefield mounted");
    const response = axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/match/${matchID}`
    );
    console.log(response);
    return () => {
      console.log("Battlefield unmounted");
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    console.log("iam here");
    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
    };
  }, [socket, handleWebSocketMessage]);

  // ... (keep existing fetchMatchDetails useEffect)
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const startTime = new Date().toISOString();
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/match/${matchID}`,
          {
            params: { startTime },
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );

        const matchDetails = response?.data;

        if (response.data) {
          //supposed set states here
          console.log("hgghg");
          if (username == matchDetails.player1Name) {
            setopponentData({
              name: matchDetails?.player2Name,
              rating: matchDetails?.player2Rating,
            });
          } else if (username == matchDetails.player2Name) {
            setopponentData({
              name: matchDetails?.player1Name,
              rating: matchDetails?.player1Rating,
            });
          }
        }
        // console.log(response.data);

        setBattleState((prev) => ({
          ...prev,
          matchDetails,
          code: matchDetails.solutionTemplate || prev.code,
          startTime,
          status: "IN_PROGRESS",
          isLoading: false,
          error: null,
        }));

        localStorage.setItem("matchDetails", JSON.stringify(matchDetails));
        localStorage.setItem(
          "battleState",
          JSON.stringify({
            startTime,
            status: "IN_PROGRESS",
            code: matchDetails.solutionTemplate,
          })
        );
        localStorage.setItem("code", matchDetails.solutionTemplate);
      } catch (err) {
        setBattleState((prev) => ({
          ...prev,
          error: err.message,
          isLoading: false,
          status: "PENDING",
        }));
        console.error("Match Details fetch Error:", err);
      }
    };

    if (matchID) {
      fetchMatchDetails();
    } else {
      setBattleState((prev) => ({
        ...prev,
        code: localStorage.getItem("code") || prev.code,
        isLoading: false,
      }));
    }
  }, [matchID]);

  const handleEndMatch = useCallback(() => {
    const endTime = new Date().toISOString();

    setBattleState((prev) => ({
      ...prev,
      endTime,
      status: "COMPLETED",
    }));

    if (socket?.readyState === WebSocket.OPEN) {
      socket.close();
    }

    localStorage.removeItem("matchDetails");
    localStorage.removeItem("code");
    localStorage.removeItem("battleState");
    sessionStorage.removeItem("matchID: ");

    localStorage.removeItem("timer-end-time");

    navigate("/home");
  }, [socket, navigate]);

  const handleCodeChange = useCallback((newCode) => {
    setBattleState((prev) => ({ ...prev, code: newCode }));
    localStorage.setItem("code", newCode);
  }, []);

  const handleSubmitCode = useCallback(async () => {
    try {
      const data = {
        code: localStorage.getItem("code"),
        language: "python",
        matchId: matchID,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/submit`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log(response.data);
      setsubmitResults(response.data);
      if (response.data.total_testcases === response.data.passed) {
        setallPass(true);
        localStorage.setItem("passedAll", true);
      } else {
        setallPass(false);
        localStorage.setItem("passedAll", false);
      }
      // setBattleState((prev) => ({
      // 	...prev,
      // 	status: "SUBMITTED",
      // }));
    } catch (error) {
      console.error("Error submitting code:", error);
      setBattleState((prev) => ({
        ...prev,
        error: "Failed to submit code",
      }));
    }
  }, [matchID]);

  const handleFinishGame = useCallback(() => {
    navigate(`/match-summary/${sessionStorage.getItem("matchID: ")}`);
    console.log("Game finished!");
  }, []);

  // if (!battleState.matchDetails) {
  // 	return <NotFound />;
  // }

  return (
    <div className="h-screen w-full">
      {/* <div><PersistentTimer/></div> */}
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel defaultSize={25}>
          <div className="  p-2 border-b border-border opopnet data w-full">
            {/* <p>Opponent</p> */}
            <p className="p-2  text-md px-3 font-medium w-fit text-center mx-auto ">
              Opponent :{" "}
              <span className="bg-destructive p-1 px-3 rounded-md">
                {opponentData?.name} ({opponentData?.rating})
              </span>
              {/* {JSON.stringify(opponentData)} */}
            </p>
          </div>
          <ResizablePanelGroup direction="vertical" className="w-full">
            <ResizablePanel defaultSize={25}>
              <section className=" overflow-auto h-full">
                <div className=" p-3 h-full">
                  <p className="text-2xl font-semibold">Problem Statement</p>
                  <Markdown className="p-3 bg-blue-600 overflow-auto">
                    {battleState?.matchDetails?.problemStatement}
                  </Markdown>
                </div>
              </section>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={25}>
              <section className="logs h-full ">
                <div className="h-full ">
                  <MatchLog socket={socket} />
                </div>
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            <div className=" flex items-center justify-between p-2 gap-3">
              <div className="timer  text-center  rounded-md flex-1  flex items-center justify-center">
                <PersistentTimer />
              </div>

              <Button
                onClick={handleEndMatch}
                variant={"destructive"}
                className=""
                size={"sm"}
                disabled
              >
                End match
              </Button>
            </div>

            <ResizablePanel defaultSize={25}>
              <div className="code-editor h-full w-full bg-teal -500 p- 1">
                <CodeEditor
                  className=""
                  code={battleState.code}
                  onChange={handleCodeChange}
                  readOnly={battleState.status === "SUBMITTED"}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={25} className="h-full">
              <section className="h-full">
                <div className="bg-red -900 p-1 py-2 w-full flex items-center justify-end gap-3">
                  <Button onClick={handleSubmitCode} className="" size={"sm"}>
                    Run code
                  </Button>

                  <FinishGame
                    handleFinishGame={handleFinishGame}
                    pass={localStorage.getItem("passedAll") === "true"}
                  />
                </div>

                <Separator className="" />

                <div className="p-5 overflow-auto h-full  ">
                  <p className="font-bold text-lg">Submission results</p>
                  {submitResults ? (
                    <div className="">
                      <div className="flex items-center  gap-3 text-secondary-foreground/50 text-sm">
                        <p className="capitalize">
                          Execution status :{" "}
                          <span
                            className={`${
                              submitResults?.execution_status == "completed"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {submitResults?.execution_status}
                          </span>
                        </p>
                        <p className="">
                          Execution Time:{" "}
                          <span className="text-primary">
                            {submitResults?.execution_time_ms?.toFixed(2)}ms{" "}
                          </span>
                        </p>
                      </div>

                      <div className="p-2 mt-3 bg-re d-900 h-full space-y-3">
                        <p
                          className={`${
                            submitResults?.passed > 0
                              ? "bg-green-700"
                              : "bg-destructive"
                          } px-4 rounded-sm py-3 `}
                        >
                          Passed {submitResults?.passed}/
                          {submitResults?.total_testcases} cases
                        </p>
                        {submitResults?.details?.length > 0 ? (
                          <div>
                            <p className="font-medium">Details</p>
                            <div>
                              <p>
                                Input:{" "}
                                <span>{JSON.stringify(submitResults?.details[0]?.input)}</span>
                              </p>
                              <p>
                                Expected:{" "}
                                <span>
                                  {JSON.stringify(submitResults?.details[0]?.expected)}
                                </span>
                              </p>
                              <p>
                                Your output:{" "}
                                <span>{JSON.stringify(submitResults?.details[0]?.output)}</span>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full bg-red -900 flex items-center justify-center">
                            <div>
                              <div className=" font-bold  flex items-center justify-center gap-5">
                                <PartyPopper
                                  size={75}
                                  opacity={0.7}
                                  color="green"
                                />
                                <div>
                                  <p className="text-primary/50">
                                    You have cleared all the testcases
                                  </p>
                                  <p>
                                    {" "}
                                    Click the Finish Game button to secure the
                                    win
                                  </p>
                                </div>
                              </div>
                              <span></span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center mt-5 text-primary/50">
                      <div className="flex gap-3 items-center">
                        <OctagonX size={20} />
                        <p>No results yet. Run code to see results</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>


    </div>
  );
};

export default BattleField;
{/* <div className="battlefield-container bg-red-9 00 p-1 h-screen">
<div className="battlefield-header m-4 bg -green-300">
  <div className="connection-status">
    Status: {isConnected ? "Connected" : "Disconnected"}
  </div>
  <div className="battlefield-actions space-x-4">
    <button
      onClick={() => navigate("/home")}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      Back
    </button>
    <button
      onClick={handleEndMatch}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      End match
    </button>
    <button
      onClick={handleSubmitCode}
      className="px-4 py-2 bg-gr een-500 text-white rounded hover:bg-green-600"
    >
      Submit
    </button>
    <FinishGame handleFinishGame={handleFinishGame} pass={allPass} />
  </div>
</div>
  
<div className=" gap-4 m-4 flex bg-pink -600 p-1">
  <div className="problem-statement lg:w-1/3 flex-col">
    <div className="h-2/3">
      <Markdown>{battleState?.matchDetails?.problemStatement}</Markdown>
    </div>
    <div className="match-log-container m-4 h-1/3">
      <MatchLog socket={socket} />
    </div>
  </div>

  <div className="code-editor lg:w-2/3 bg-teal-500 p-1">
    <CodeEditor
      code={battleState.code}
      onChange={handleCodeChange}
      readOnly={battleState.status === "SUBMITTED"}
    />
  </div>
</div>
</div> 
*/}