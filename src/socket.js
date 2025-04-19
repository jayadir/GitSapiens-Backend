const { Server } = require("socket.io");
const ChatModel = require("./models/ChatsModel");
const setupSocket = (io) => {
  const roomUsers = {};
  
  io.use((socket, next) => {
    const { room, userId, userName } = socket.handshake.auth;
    
    if (!room) {
      return next(new Error("Invalid room"));
    }
    
    socket.room = room;
    socket.userId = userId || socket.id;
    socket.userName = userName || "Anonymous";
    
    next();
  });

  io.on("connection",async (socket) => {
    const { room, userId, userName } = socket;
    
    if (!roomUsers[room]) {
      roomUsers[room] = new Map();
    }
    
    roomUsers[room].set(userId, {
      id: userId,
      name: userName,
      socketId: socket.id
    });
    socket.join(room);
    try {
      const chatHistory = await ChatModel.find({ groupId: room }).sort({ createdAt: -1 }).lean()
      if(chatHistory) {
        const formattedHistory = chatHistory.map((chat) => ({
          message: chat.message,
          senderId: chat.sender,
          senderName: chat.senderName,
          timestamp: chat.createdAt.toISOString(),
          groupId: chat.groupId
        }));
        socket.emit("previous-messages", formattedHistory.reverse());
        // socket.emit("previous-messages", chatHistory.reverse());
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
    
    console.log(`Client connected: ${socket.id} | User: ${userName} (${userId}) | Room: ${room}`);
    
    updateUserCount(io, room);
    
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id} | User: ${userName} (${userId}) | Room: ${room}`);
      
      if (roomUsers[room]) {
        roomUsers[room].delete(userId);
        
        if (roomUsers[room].size === 0) {
          delete roomUsers[room];
        }
      }
      
      updateUserCount(io, room);
    });
    
    socket.on("message",async (data) => {
      if (!data || typeof data !== 'object' || !data.message) {
        return;
      }
      
      const messageData = {
        message: data.message,
        senderId: data.senderId || userId,
        senderName: data.senderName || userName,
        timestamp: data.timestamp || new Date().toISOString(),
        groupId: data.groupId || room
      };
      try {
        const chat=new ChatModel({
          groupId: room,
          sender: messageData.senderId,
          message: messageData.message,
          senderName: messageData.senderName
        });
        await chat.save();
      } catch (error) {
        console.error("Error saving message:", error);
      }
      console.log(`Message in room ${room}: ${messageData.message} (from ${messageData.senderName})`);
      
      io.to(room).emit("message", messageData);
    });
    
    socket.on("user-typing", (data) => {
      socket.to(room).emit("user-typing", {
        userId: data.userId || userId,
        userName: data.userName || userName
      });
    });
    
    socket.on("get-users", () => {
      const users = Array.from(roomUsers[room]?.values() || []);
      socket.emit("room-users", users);
    });
  });
  
  function updateUserCount(io, room) {
    const count = roomUsers[room]?.size || 0;
    io.to(room).emit("users-online", count);
  }
};

module.exports = setupSocket;