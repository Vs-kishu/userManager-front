import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import PlayerDashboard from "./components/PlayerDashboard";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {

  const user=JSON.parse(localStorage.getItem("userToken"));
  return (
    <div className=" ">
      <Navbar user={user}/>
      {!user ? (
        <Login />
      ) : user.userRole === "admin" ? (
        <AdminDashboard user={user}/>
      ) : (
        <PlayerDashboard user={user} />
      )}

<ToastContainer position="top-center" />

    </div>
  );
}

export default App;
