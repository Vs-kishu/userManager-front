import { useState, useEffect } from "react";
import socket from "../socket";
import RankPage from "./RankPage";
import { toast } from "react-toastify";
import Confetti from "react-confetti";

function PlayerDashboard({ user }) {
  const [rankData, setRankData] = useState([]); 
  const [isConfettiVisible, setConfettiVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); 
  const [windowHeight, setWindowHeight] = useState(window.innerHeight); 

  useEffect(() => {
    socket.emit("joinGame", user?.userId);
    socket.emit("getRank"); 

    socket.on("updateRank", (players) => {
      setRankData(players);
    });

    socket.on("userBlocked", () => {
      toast.error("You have been blocked by the admin.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    });

    socket.on("topRankReached", () => {
      setConfettiVisible(true);
      setTimeout(() => setConfettiVisible(false), 5000); 
    });

    return () => {
      socket.off("updateRank");
      socket.off("userBlocked");
      socket.off("topRankReached");
    };
  }, [user]);

  const handleBananaClick = () => {
    socket.emit("playerClick", user?.userId);
    toast.info("Banana Clicked! 🍌", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  // Resize window for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-green-100 flex flex-wrap gap-10 items-start justify-around p-2 sm:p-6">
      {/* Confetti Animation */}
      {isConfettiVisible && <Confetti width={windowWidth} height={windowHeight} />}
      
      <div className="flex flex-col items-center mt-10 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        {/* Header */}
        <div className="bg-green-800 text-white rounded-xl shadow-xl p-4 sm:p-8 w-full mb-8 text-center">
          <h2 className="text-xl sm:text-3xl font-semibold">Welcome, {user?.username}</h2>
        </div>

        {/* Banana Click Button */}
        <img
          onClick={handleBananaClick}
          className="w-20 sm:w-28 hover:scale-105 cursor-pointer transition-all duration-300"
          src="/banana.png"
          alt="banana"
        />
      </div>

      {/* Rank Page */}
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white p-2 sm:p-6 rounded-xl shadow-xl mt-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Leaderboard</h3>
        <RankPage players={rankData} userToken={user} />
      </div>
    </div>
  );
}

export default PlayerDashboard;
