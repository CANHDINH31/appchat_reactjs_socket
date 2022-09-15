const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const getUserFromSocketId = (socketId) => {
  return users.find((user) => user.socketId === socketId)?.userId;
};

io.on("connection", (socket) => {
  //when connect

  console.log("A user connect " + socket.id);

  //take userid and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //when send and get message
  socket.on(
    "sendMessage",
    ({ conversationId, senderId, receiverId, text, time }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        conversationId,
        senderId,
        text,
        time,
      });
    }
  );

  // when disconnect
  // socket.on("disconnect", () => {
  //   console.log(" a user disconnected");
  //   removeUser(socket.id);
  //   io.emit("getUsers", users);
  // });
});
