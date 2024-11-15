import { useState } from "react";
import { login } from "../api/authApi";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
        const userData = { ...response.data.user, token: response.data.token };
        localStorage.setItem(
          "userToken",
          JSON.stringify({
            userToken: userData.token,
            userRole: userData.role,
            userId: userData._id,
            username: userData.username,
          })
        );
        window.location.reload()
    } catch (error) {
      alert(error.response.data);
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
     
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
    
    </div>
  );
}

export default Login;
