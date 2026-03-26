import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../lib/axios.js";
import { useAuth } from "./AuthContext.jsx";

const ChatContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const socketRef = useRef(null);

  // Connect socket when user logs in
  useEffect(() => {
    if (authUser) {
      connectSocket();
      fetchUsers();
    } else {
      disconnectSocket();
      setUsers([]);
      setSelectedUser(null);
      setMessages([]);
      setOnlineUsers([]);
    }
    return () => disconnectSocket();
  }, [authUser]);

  const connectSocket = () => {
    if (socketRef.current?.connected) return;
    socketRef.current = io(SOCKET_URL, {
      query: { userId: authUser._id },
      transports: ["websocket"],
    });

    socketRef.current.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    socketRef.current.on("newMessage", (message) => {
      // Update messages if the conversation is open
      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === message._id);
        if (alreadyExists) return prev;
        return [...prev, message];
      });

      // Update unread count in users list
      setUsers((prev) =>
        prev.map((u) => {
          if (u._id === message.senderId) {
            return { ...u, unreadCount: (u.unreadCount || 0) + 1 };
          }
          return u;
        })
      );
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await axiosInstance.get("/messages/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch users error:", error.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    setIsLoadingMessages(true);
    try {
      const res = await axiosInstance.get(`/messages/${user._id}`);
      setMessages(res.data);
      // Mark messages as seen
      await axiosInstance.put(`/messages/mark/${user._id}`);
      // Reset unread count for this user
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, unreadCount: 0 } : u))
      );
    } catch (error) {
      console.error("Load messages error:", error.message);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async (messageData) => {
    if (!selectedUser) return;
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Send message error:", error.message);
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        users,
        selectedUser,
        messages,
        onlineUsers,
        isLoadingUsers,
        isLoadingMessages,
        selectUser,
        sendMessage,
        fetchUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
