import { useState, useEffect } from "react";
import socket from "../src/socket";
import RankPage from "./RankPage";

function PlayerDashboard({ user }) {
  const [rankData, setRankData] = useState([]); // New state for rank data

  useEffect(() => {
    socket.emit("joinGame", user?.userId);
    socket.emit("getRank"); // Request the initial rank data
  
    socket.on("updateClickCount", () => {
    });
  
    socket.on("updateRank", (players) => {
      setRankData(players);
    });

    socket.on("userBlocked", () => {
      alert("You have been blocked by the admin.");
    });
  
    return () => {
      socket.off("updateClickCount");
      socket.off("updateRank");
      socket.off("userBlocked");

    };
  }, [user]);
  

  const handleBananaClick = () => {
    socket.emit("playerClick", user?.userId);
    
  };

  return (
    <div>
      <h2>Welcome, {user?.username}</h2>
      <button onClick={handleBananaClick}>🍌 Banana</button>
      <RankPage players={rankData} userToken={user} />
    </div>
  );
}

export default PlayerDashboard;
