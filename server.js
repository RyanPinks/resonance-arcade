// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public-facing folder
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/games/online-tic-tac-toe.html');
});

let games = {}; // roomId → board state

io.on('connection', (socket) => {
  console.log('A player connected');

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

  socket.on('disconnect', () => {
    console.log('A player disconnected');
  });
});

server.listen(3000, () => {
  console.log('Resonance Arcade server is running on http://localhost:3000');
});

