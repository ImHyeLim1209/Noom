import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listen on http:localhost:3000`);

// 2가지 프로토콜(Http, Websocket)을 같은 포트에서 실행(연결)시키기 위해 아래와 같이 구현.
// 둘을 별개로 구현하는 것도 가능하다.
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // http 서버 위에 websockt 서버 구현

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

function onSocketMessage(message) {
  console.log(message.toString("utf8"));
}

wss.on("connection", (socket) => {
  console.log("Connected to Browser!");

  // Browser 닫으면 close
  socket.on("close", onSocketClose); 

  socket.on("message", onSocketMessage);

  socket.send("hello!!!");
});

server.listen(3000, handleListen);