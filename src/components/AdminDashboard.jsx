import { useEffect, useState } from "react";
import {
  fetchUsers,
  toggleBlockUser,
  deleteUser,
  editUser,
  register,
} from "../api/authApi";
import socket from "../socket";
import { toast } from "react-toastify";

function AdminDashboard({ user }) {
  const [players, setPlayers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    username: "",
    bananaClickCount: 0,
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "player",
  });

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await fetchUsers(user?.userToken);
        if (isMounted) {
          setPlayers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    loadUsers();

    socket.on("updateRank", (players) => {
      if (isMounted) {
        setPlayers(players);
      }
    });

    socket.on("updateUserStatus", ({ userId, isActive }) => {
      if (isMounted) {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === userId ? { ...player, isActive } : player
          )
        );
      }
    });

    return () => {
      isMounted = false;
      socket.off("updateRank");
      socket.off("updateUserStatus");
    };
  }, [user?.userToken]);

  const handleBlockToggle = async (id) => {
    try {
      await toggleBlockUser(id, user?.userToken);
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === id
            ? { ...player, isBlocked: !player.isBlocked }
            : player
        )
      );
    } catch (error) {
      console.error("Failed to toggle block status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id, user?.userToken);
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player._id !== id)
      );
      toast.success(' deleted successfully')
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleEditClick = (player) => {
    setEditingUserId(player._id);
    setEditedUserData({
      username: player.username,
      bananaClickCount: player.bananaClickCount,
    });
  };

  const handleSave = async (id) => {
    try {
      const updatedUser = await editUser(
        id,
        {
          username: editedUserData.username,
          bananaClickCount: editedUserData.bananaClickCount,
        },
        user?.userToken
      );

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === id
            ? {
                ...player,
                username: updatedUser.data.username,
                bananaClickCount: updatedUser.data.bananaClickCount,
              }
            : player
        )
      );
      setEditingUserId(null);
      setEditedUserData({ username: "", bananaClickCount: 0 });
      toast.success(" edited successfully!");
    } catch (error) {
      console.error("Failed to save user edit:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register({
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });
      if (response.data) {
        setPlayers((prevPlayers) => [...prevPlayers, response.data]);
      }

      toast.success("User registered successfully!");
      setFormData({
        username: "",
        password: "",
        role: "player", 
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Failed to register user.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, 
    }));
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-teal-100 min-h-screen p-4 md:p-8">
      <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
        Admin Dashboard
      </h2>

      {/* Registration Form */}
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Register New User
        </h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border rounded px-4 py-2 shadow-sm focus:ring-green-300 focus:ring-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded px-4 py-2 shadow-sm focus:ring-green-300 focus:ring-2"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border rounded px-4 py-2 shadow-sm focus:ring-green-300 focus:ring-2"
            required
          >
            <option value="player">Player</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-6 bg-green-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 focus:ring focus:ring-green-300"
        >
          Register
        </button>
      </form>

      {/* Players Table */}
      <div className="bg-white rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Users List</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200 text-left text-gray-700">
            <thead>
              <tr className="bg-gradient-to-r from-green-200 to-teal-200">
                <th className="border border-gray-200 px-4 py-2">Username</th>
                <th className="border border-gray-200 px-4 py-2">
                 Count
                </th>
                <th className="border border-gray-200 px-4 py-2">Status</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players
                .sort((a, b) => b.bananaClickCount - a.bananaClickCount)
                .filter((p) => p.role !== "admin")
                .map((player) => (
                  <tr
                    key={player._id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="border border-gray-200 px-4 py-2">
                      {editingUserId === player._id ? (
                        <input
                          type="text"
                          value={editedUserData.username}
                          onChange={(e) =>
                            setEditedUserData((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1 shadow-sm focus:ring-green-300 focus:ring-2"
                        />
                      ) : (
                        player.username
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {editingUserId === player._id ? (
                        <input
                          type="number"
                          value={editedUserData.bananaClickCount}
                          onChange={(e) =>
                            setEditedUserData((prev) => ({
                              ...prev,
                              bananaClickCount: parseInt(e.target.value, 10),
                            }))
                          }
                          className="border rounded px-2 py-1 shadow-sm focus:ring-green-300 focus:ring-2"
                        />
                      ) : (
                        `${player.bananaClickCount} `
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <span
                        className={`inline-block w-4 h-4 rounded-full ${
                          player.isActive
                            ? "bg-green-500"
                            : "bg-red-500 animate-pulse"
                        }`}
                      ></span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2 flex flex-wrap gap-1 justify-start  text-center">
                      {editingUserId === player._id ? (
                        <button
                          onClick={() => handleSave(player._id)}
                          className="bg-green-800  text-white px-4 py-1 rounded-md  hover:bg-green-700"
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(player)}
                            className="bg-yellow-500  text-white px-4 py-1 rounded-md hover:bg-yellow-400 "
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(player._id)}
                            className="bg-red-500  text-white px-4 py-1 rounded-md hover:bg-red-400"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleBlockToggle(player._id)}
                            className={`${
                              player.isBlocked
                                ? "bg-blue-500 hover:bg-blue-400"
                                : "bg-green-600 hover:bg-green-500"
                            } text-white px-4 py-1 rounded-md `}
                          >
                            {player.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
