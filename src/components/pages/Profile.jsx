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

const Profile = () => {
  const [profileData, setprofileData] = useState();
  const [allMatchData, setallMatchData] = useState();
  const [openSheet, setopenSheet] = useState(false);
  const [matchDetails, setmatchDetails] = useState("");

  const [matchStatus, setmatchStatus] = useState("win");

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
    setopenSheet(true); // Assuming this opens some UI component
    try {
      const res = await getData(`match/${id}`);
      // Ensure the API call was successful
      if (res.response.status === 200) {
        // Combine match details and extraData correctly
        setmatchDetails({
          ...res.response.data, // Assuming "matches" holds the relevant match details
          ...extraData, // Merge extraData with the match details
        });
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
    console.log(matchDetails);
  }, [matchDetails]);

  return (
    <div className="h-screen w-full p-9">
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
              className="bg-card border border-border p-3 rounded-md hover:bg-primary/10 transition-colors duration-300"
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
          className={`${matchStatus == "win" ? "bg-green-800" : "bg-red-800"}`}
        >
          <SheetHeader>
            <SheetTitle className="capitalize font-bold text-3xl">{matchStatus}</SheetTitle>
          </SheetHeader>{" "}
          <div></div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Profile;
