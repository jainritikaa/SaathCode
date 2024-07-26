import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 4000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res).catch((err) => {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    });
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust this based on your client's origin
      methods: ["GET", "POST"],
    },
  });

  let buttonState = false;

  io.on("connection", (socket) => {
    console.log("A new connection");

    // Emit the current button state to the newly connected client
    socket.emit("buttonState", buttonState);

    // Handle button press events from clients
    socket.on("buttonPress", (state) => {
      buttonState = state;
      io.emit("buttonState", buttonState); // Broadcast the updated state to all clients
      console.log(`Button state changed to: ${buttonState}`);
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    // Error handling for socket events
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  httpServer.listen(port, (err) => {
    if (err) {
      console.error("Error starting server:", err);
      process.exit(1);
    }
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
