const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const chatRouter = require("./routes/chatRouter");
const { Server } = require("socket.io");
const { createServer } = require("http");
const {createAdapter} = require("@socket.io/redis-streams-adapter");
const { instrument } = require("@socket.io/admin-ui");
const redis = require("./config/redis.config");
const setupSocket = require("./socket");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:3000"],
    credentials: true,
  },
  adapter: createAdapter(redis),
});
instrument(io,{
  auth: false,
  mode: "development",
})
setupSocket(io);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
app.use("/api", chatRouter);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
