import http from "http";
//import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// 2가지 프로토콜(Http, Websocket)을 같은 포트에서 실행(연결)시키기 위해 아래와 같이 구현.
// 둘을 별개로 구현하는 것도 가능하다.
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
//const wss = new WebSocket.Server({ server }); // http 서버 위에 websockt 서버 구현

// function onSocketClose() {
//   console.log("Disconnected from the Browser ❌");
// }

// function onSocketMessage(message) {
//   console.log(message.toString("utf8"));
// }


wsServer.on("connection", (socket) => {

  // onAny: event를 emit할 때 실행될 리스너 추가
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  // frontend로 부터 함수도 전달받을 수 있다.
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

//const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser!");

//   // Browser 닫으면 close
//   socket.on("close", onSocketClose); 

//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// });

//server.listen(3000, handleListen);