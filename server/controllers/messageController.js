import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getIo, getSocketId } from "../lib/socket.js";

// GET /api/messages/users  [Protected]
// Get all users except current user, with unread message counts
export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get all users except current user
    const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");

    // For each user, count unseen messages sent to current user
    const usersWithUnread = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          receiverId: currentUserId,
          seen: false,
        });
        return {
          ...user.toObject(),
          unreadCount,
        };
      })
    );

    res.status(200).json(usersWithUnread);
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/messages/:userId  [Protected]
// Get all messages between current user and specified user
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/messages/send/:userId  [Protected]
// Send a message to a user
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message must have text or image" });
    }

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chatapp/messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId: userId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();

    // Emit real-time event to receiver if online
    const receiverSocketId = getSocketId(userId);
    if (receiverSocketId) {
      getIo().to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/messages/mark/:userId  [Protected]
// Mark all messages from userId as seen
export const markMessagesSeen = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    await Message.updateMany(
      { senderId: userId, receiverId: currentUserId, seen: false },
      { seen: true }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Mark seen error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
