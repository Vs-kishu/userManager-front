import { useEffect, useState } from "react";
import {
  fetchUsers,
  toggleBlockUser,
  deleteUser,
  editUser,
  register,
} from "../api/authApi";
import socket from "../src/socket";

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

      alert("User registered successfully!");
      setFormData({
        username: "",
        password: "",
        role: "player", // Reset to default role
      });
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register user.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Dynamically update the corresponding field
    }));
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="player">Player</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Banana Click Count</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players
            .sort((a, b) => b.bananaClickCount - a.bananaClickCount)
            .filter((p) => p.role !== "admin")
            .map((player) => (
              <tr key={player._id}>
                <td>
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
                    />
                  ) : (
                    player.username
                  )}
                </td>
                <td>
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
                    />
                  ) : (
                    `${player.bananaClickCount} clicks`
                  )}
                </td>
                <td>
                  <span
                    className={player.isActive ? "activated" : "deactivated"}
                  >
                    {player.isActive ? "🟢" : "🔴"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 5 }}>
                  {editingUserId === player._id ? (
                    <>
                      <button onClick={() => handleSave(player._id)}>
                        Save
                      </button>
                      <button onClick={() => setEditingUserId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleEditClick(player)}>
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleBlockToggle(player._id)}>
                    {player.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    style={{ background: "red" }}
                    onClick={() => handleDelete(player._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
