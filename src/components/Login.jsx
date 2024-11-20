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
      window.location.reload();
    } catch (error) {
      alert(error.response.data);
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-100">
      <div className="bg-green-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 rounded border-2 border-green-700 bg-green-50 text-gray-900 focus:outline-none focus:border-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded border-2 border-green-700 bg-green-50 text-gray-900 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-500 rounded text-white font-semibold transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
