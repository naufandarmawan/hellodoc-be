const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const routes = require("./src/routes/auth");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const authRoutes = require("./src/routes/auth");
const medicineRoutes = require("./src/routes/medicine");
const orderRoutes = require("./src/routes/order");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(routes);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`user joined chat: ${chatId}`);
  });

  socket.on("sendMessage", async ({ chatId, senderId, message }) => {
    const newMessage = await prisma.message.create({
      data: {
        chat_id: chatId,
        sender_id: senderId,
        message: message,
      },
    });
  });

  socket.on('disconnect', ()=> {
    console.log('user disconnected');
    
  })
});

app.get("/", (req, res, next) => {
  res.send("Backend HelloDoc API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
