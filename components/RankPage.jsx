function RankPage({ players,userToken }) {
  return (
    <div className="player-rankings">
      <h3>Player Rankings</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Banana Click Count</th>
          </tr>
        </thead>
        <tbody>
          {players
            .sort((a, b) => b.bananaClickCount - a.bananaClickCount) 
            .map((player, index) => (
              <tr
                key={player._id}
                className={player._id === userToken?.userId ? "highlight" : ""} 
              >
                <td>{index + 1}</td> 
                <td>{player.username}</td>
                <td>{player.bananaClickCount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default RankPage;
