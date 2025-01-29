const express = require("express");
const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const router = express.Router();

// Send Friend Request
router.post("/request", async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const request = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });
    await request.save();

    const receiver = await User.findById(receiverId);
    if (receiver) {
      receiver.notifications.push(
        `You have a new friend request from ${senderId}`
      );
      await receiver.save();
    }

    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ error: "Error sending request" });
  }
});

// Accept Friend Request
router.patch("/accept", async (req, res) => {
  const { requestId } = req.body;
  try {
    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $push: { friends: request.receiver },
    });
    await User.findByIdAndUpdate(request.receiver, {
      $push: { friends: request.sender },
    });

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: "Error accepting request" });
  }
});

// Fetch Friend Requests for a User
router.get("/requests/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const requests = await FriendRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "pending",
    }).populate("sender receiver", "name");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching friend requests" });
  }
});

// Fetch Friend Recommendations
router.get("/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("friends");
    if (!user) return res.status(404).json({ error: "User not found" });

    let recommended = await User.find({
      _id: { $ne: userId, $nin: user.friends },
    });
    res.json(recommended);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recommendations" });
  }
});

// Fetch Notifications
router.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

// // Fetch Friends for a specific user
// router.get("/users/:userId/friends", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     // Check if the user exists
//     const user = await User.findById(userId).populate("friends");
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // If user has no friends, return an empty array
//     if (!user.friends || user.friends.length === 0) {
//       return res.json({ message: "No friends found", friends: [] });
//     }

//     res.json(user.friends);
//   } catch (error) {
//     console.error("Error fetching friends:", error);
//     res.status(500).json({ error: "Error fetching friends" });
//   }
// });

// module.exports = router;

module.exports = router;
