const Navbar = ({ user }) => {
  const logout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-green-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">Game</h1>
        {user && (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 focus:outline-none transition duration-300"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
