import React, { useEffect, useState } from "react";
import { getData } from "../utils/fetch-api-data";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";

const Profile = () => {
  const [profileData, setprofileData] = useState();
  const [allMatchData, setallMatchData] = useState();
  const [openSheet, setopenSheet] = useState(false);
  const [matchDetails, setmatchDetails] = useState("");
  const [playerType, setplayerType] = useState(-1);

  const [matchStatus, setmatchStatus] = useState("draw");

  const userId = localStorage.getItem("_id:");
  const username = localStorage.getItem("username:");

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    // Format the date as a readable string
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format (e.g., AM/PM)
    });
  }

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

  const getMatchDetails = async (id, extraData) => {
    setopenSheet(true); // Open the sheet UI
    try {
      const res = await getData(`match/${id}`);
      if (res.response.status === 200) {
        const data = res.response.data;
        // Combine match details and extraData
        const matchData = { ...data, ...extraData };
        setmatchDetails(matchData); // Update match details

        // Determine player type
        if (userId === matchData.player1Id) {
          setplayerType(1);
        } else if (userId === matchData.player2Id) {
          setplayerType(2);
        }
      } else {
        console.error("Failed to fetch match details: Invalid status code");
        toast.error("Failed to fetch match details");
      }
    } catch (error) {
      console.error("Failed to get match details: ", error);
      toast.error("Failed to get match details");
    }
  };

  const getAllMatches = async () => {
    try {
      const res = await getData("match/all");
      // console.log(res.response)
      if (res.response.status == 200) {
        console.log(res.response.data.matches);
        setallMatchData(res.response.data.matches);
      }
    } catch (error) {
      console.error("Failed to get profile : ", error);

      toast.error("Failed to get profile");
    }
  };

  useEffect(() => {
    getProfile();
    getAllMatches();
  }, []);

  useEffect(() => {
    if (matchDetails && playerType !== -1) {
      console.log("Player Type:", playerType);
      console.log("Match Details:", matchDetails);

      if (playerType === 1 && matchDetails.p1DeltaRating > 0) {
        setmatchStatus("won");
      } else if (playerType === 2 && matchDetails.p2DeltaRating > 0) {
        setmatchStatus("won");
      } else if (playerType === 1 && matchDetails.p1DeltaRating < 0) {
        setmatchStatus("defeat");
      } else if (playerType === 2 && matchDetails.p2DeltaRating < 0) {
        setmatchStatus("defeat");
      } else {
        setmatchStatus("draw");
      }
    }
  }, [matchDetails, playerType]);
  const navigate=useNavigate()


  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("username:");
    localStorage.removeItem("_id:");
    toast.success("Logged out successfully!");
    navigate("/");
  };
  return (
    <div className="h-screen w-full pt-2 p-9">
      <div className="pb-5 flex items-center justify-between">
        <Button onClick={()=>navigate("/home")} className="bg-transparent text-primary flex hover:bg-primary/10 items-center gap-3 "><ArrowLeft />Back</Button>
        <Button onClick={handleLogout} variant={"destructive"} className="bg-transparent text-red-500">Logout</Button>
      </div>
      <div>
        <p className="text-5xl font-bold">Profile</p>
        <div className="py-5 flex items-center justify-center gap-5 w-fit">
          <div>
            <p>
              <span className="text-gray-400 text-2xl">Username :</span>{" "}
              {profileData?.username}
            </p>
            <p>
              <span className="text-gray-400 text-2xl">Wins :</span>{" "}
              {profileData?.wins}
            </p>
            <p>
              <span className="text-gray-400 text-2xl">Losses :</span>{" "}
              {profileData?.losses}
            </p>
            <p>
              <span className="text-gray-400 text-2xl">Rating :</span>{" "}
              {profileData?.rating}
            </p>
            <p>
              <span className="text-gray-400 text-2xl">Rank :</span>{" "}
              {profileData?.rank}
            </p>
          </div>
          <div className="aspect-[9/16] w-20">
            <img src={`src/assets/badges/${profileData?.rank}.png`} alt="" />
          </div>
        </div>

        <div className=" py-5 overflow-auto ">
          <p className=" text-2xl mb-5">My Matches</p>
          {allMatchData?.map((item, idx) => (
            <div
              key={idx}
              className="bg-card border border-border p-3 rounded-md hover:bg-primary/10 transition-colors duration-300 my-1"
              onClick={() => getMatchDetails(item._id, item)}
            >
              <div className="flex items-center justify-between">
                <p>
                  <span className="">Match </span>
                  {idx + 1}
                </p>

                <p className="text-gray-400 text-sm">
                  {formatDate(item.player2StartTime || item.player1StartTime)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Sheet open={openSheet} onOpenChange={setopenSheet}>
        <SheetContent
          className={`${
            matchStatus === "won"
              ? "bg-green-900"
              : matchStatus === "defeat"
              ? "bg-red-900"
              : "bg-blue-900"
          } overflow-auto`}
        >
          {/* Match Status Header */}
          <SheetHeader className="text-center">
            <SheetTitle className="text-2xl font-extrabold uppercase text-white mb-4 tracking-wide">
              {matchStatus}
            </SheetTitle>
          </SheetHeader>

          {/* Player Names */}
          <div className="text-white flex items-center justify-center mb-8">
            <span className="mr-4 text-xl font-extrabold text-gray-100">
              {matchDetails?.player1Name}
            </span>
            <span className="text-2xl text-yellow-300 font-bold">VS</span>
            <span className="ml-4 text-xl font-extrabold text-gray-100">
              {matchDetails?.player2Name}
            </span>
          </div>

          {/* Player Details */}
          <div className="mt-5 space-y-8">
            {/* Player 1 Details */}
            <div>
              <p className="text-2xl font-semibold text-center text-gray-50 underline underline-offset-4 mb-3">
                Player 1 Details
              </p>
              <ul className="text-lg text-gray-200 space-y-2">
                <li>
                  <span className="font-bold">Rank:</span>{" "}
                  {matchDetails?.player1Rank}
                </li>
                <li>
                  <span className="font-bold">Execution Time:</span>{" "}
                  {matchDetails?.p1ExecutionTime}
                </li>
                <li>
                  <span className="font-bold">Test Cases Passed:</span>{" "}
                  {matchDetails?.player1Passed}/
                  {matchDetails?.player1TotalTestCases}
                </li>
                <li>
                  <span className="font-bold">Delta Rating:</span>{" "}
                  {matchDetails?.p1DeltaRating}
                </li>
              </ul>
            </div>

            {/* Separator */}
            <hr className="border-t border-gray-500 mx-10" />

            {/* Player 2 Details */}
            <div>
              <p className="text-2xl font-semibold text-center text-gray-50 underline underline-offset-4 mb-3">
                Player 2 Details
              </p>
              <ul className="text-lg text-gray-200 space-y-2">
                <li>
                  <span className="font-bold">Rank:</span>{" "}
                  {matchDetails?.player2Rank}
                </li>
                <li>
                  <span className="font-bold">Execution Time:</span>{" "}
                  {matchDetails?.p2ExecutionTime}
                </li>
                <li>
                  <span className="font-bold">Test Cases Passed:</span>{" "}
                  {matchDetails?.player2Passed}/
                  {matchDetails?.player2TotalTestCases}
                </li>
                <li>
                  <span className="font-bold">Delta Rating:</span>{" "}
                  {matchDetails?.p2DeltaRating}
                </li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Profile;
