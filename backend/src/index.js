"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust this to your frontend URL
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 8000;
let clients = {};
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    clients[socket.id] = { isTyping: false, online: true };
    io.emit('clients', clients);
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete clients[socket.id];
        io.emit('clients', clients);
    });
    socket.on('message', (data) => {
        console.log(`Message from ${socket.id}: ${data.message}`);
        io.emit('message', { client: data.client, message: data.message });
    });
    socket.on('typing', (isTyping) => {
        if (clients[socket.id]) {
            clients[socket.id].isTyping = isTyping;
            io.emit('clients', clients);
        }
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
