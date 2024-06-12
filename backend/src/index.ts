import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for simplicity, adjust as needed
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 8000;

let clients: { [key: string]: { isTyping: boolean; online: boolean } } = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    clients[socket.id] = { isTyping: false, online: true };
    io.emit('clients', clients);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete clients[socket.id];
        io.emit('clients', clients);
    });

    socket.on('message', (message) => {
        console.log(`Message from ${socket.id}: ${message}`);
        io.emit('message', { id: socket.id, message });
    });

    socket.on('typing', (isTyping) => {
        clients[socket.id].isTyping = isTyping;
        io.emit('clients', clients);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
