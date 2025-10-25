// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let games = {}; // key: roomId, value: board state

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    socket.join(roomId);
    if (!games[roomId]) {
      games[roomId] = Array(9).fill(null);
    }
    socket.emit('init', games[roomId]);
  });

  socket.on('move', ({ roomId, index, player }) => {
    if (!games[roomId] || games[roomId][index]) return;
    games[roomId][index] = player;
    io.to(roomId).emit('update', { index, player });
  });

  socket.on('chat', (msg) => {
    io.emit('chat', msg);
  });
});

server.listen(3000, () => console.log('Resonance Arcade server running on port 3000'));

app.use(express.static('public'));

