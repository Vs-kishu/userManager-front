
function RankPage({ players, userToken }) {
  return (
    <div className="p-2 sm:p-6 bg-green-50 max-h-screen">
      <h3 className="text-xl sm:text-3xl font-bold text-center text-green-800 mb-6">Player Rankings</h3>
      
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left">Rank</th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left">Username</th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            {players
              .sort((a, b) => b.bananaClickCount - a.bananaClickCount)
              .map((player, index) => (
                <tr
                  key={player._id}
                  className={`transition-all duration-300 ${player._id === userToken?.userId ? "bg-green-200" : "hover:bg-green-100"}`}
                >
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{player.username}</td>
                  <td className="px-6 py-3">{player.bananaClickCount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankPage;
