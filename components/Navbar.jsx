
const Navbar = ({user}) => {
  const logout=()=>{
    localStorage.removeItem("userToken");
    window.location.href = "/"
  }
  return (
    <div>
      <div>Game</div>
      {user &&<button onClick={logout}>LogOut</button>}
    </div>
  );
};

export default Navbar;

