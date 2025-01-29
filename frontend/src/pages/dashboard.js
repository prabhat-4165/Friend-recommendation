import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css"; // Import CSS

function Dashboard() {
  const [friends, setFriends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = localStorage.getItem("userId"); // Replace with actual user ID from localStorage or context
  const navigate = useNavigate(); // Hook to navigate to other routes

  useEffect(() => {
    // Fetch Friend Recommendations
    const fetchRecommendations = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/friends/recommendations/${userId}`
      );
      setRecommendations(res.data);
    };

    // Fetch Friend Requests
    const fetchRequests = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/friends/requests/${userId}`
      );
      setRequests(res.data);
    };

    fetchRecommendations();
    fetchRequests();
  }, [userId]);

  const sendFriendRequest = async (receiverId) => {
    await axios.post("http://localhost:5000/api/friends/request", {
      senderId: userId,
      receiverId,
    });
    alert("Friend request sent!");
  };

  const acceptRequest = async (requestId) => {
    await axios.patch("http://localhost:5000/api/friends/accept", {
      requestId,
    });
    alert("Friend request accepted!");
    setRequests(requests.filter((request) => request._id !== requestId));
  };

  const searchUsers = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/auth/search?query=${searchQuery}`
    );
    setSearchResults(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="dashboard-container">
      {/* <h2>Friends</h2>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => <li key={friend._id}>{friend.name}</li>)
        ) : (
          <p>You have no friends yet.</p>
        )}
      </ul> */}

      <h2>Friend Recommendations</h2>
      <ul>
        {recommendations.map((user) => (
          <li key={user._id}>
            {user.name}{" "}
            <button onClick={() => sendFriendRequest(user._id)}>
              Add Friend
            </button>
          </li>
        ))}
      </ul>

      <h2>Friend Requests</h2>
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            {request.sender.name}
            <button onClick={() => acceptRequest(request._id)}>Accept</button>
          </li>
        ))}
      </ul>

      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchUsers}>Search</button>
      <ul>
        {searchResults.map((user) => (
          <li key={user._id}>
            {user.name}{" "}
            <button onClick={() => sendFriendRequest(user._id)}>
              Add Friend
            </button>
          </li>
        ))}
      </ul>

      <button className="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
