// Map to track userId -> socketId
export const userSocketMap = {};

let ioInstance;

export const getIo = () => ioInstance;

export const initSocket = (socketIo) => {
  ioInstance = socketIo;
  ioInstance.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Get userId from handshake query
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Broadcast updated online users list to all clients
    ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
      }
      ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

// Helper to get socketId for a user
export const getSocketId = (userId) => {
  return userSocketMap[userId];
};
