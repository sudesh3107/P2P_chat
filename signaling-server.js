// signaling-server.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active rooms and their participants
const rooms = new Map();

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch(data.type) {
                case 'join':
                    handleJoin(ws, data);
                    break;
                    
                case 'offer':
                case 'answer':
                case 'candidate':
                    handleSignaling(ws, data);
                    break;
                    
                case 'leave':
                    handleLeave(ws, data);
                    break;
                    
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        handleDisconnect(ws);
        console.log('Client disconnected');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function handleJoin(ws, data) {
    const { room, username } = data;
    
    if (!rooms.has(room)) {
        rooms.set(room, new Set());
    }
    
    const roomParticipants = rooms.get(room);
    
    // Store client info
    ws.room = room;
    ws.username = username;
    
    // Notify existing participants about new user
    roomParticipants.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'user-joined',
                username: username,
                room: room
            }));
        }
    });
    
    // Add new participant
    roomParticipants.add(ws);
    
    // Send confirmation to the joining user
    ws.send(JSON.stringify({
        type: 'joined',
        room: room,
        participants: Array.from(roomParticipants).length
    }));
    
    console.log(`${username} joined room ${room}. Total participants: ${roomParticipants.size}`);
}

function handleSignaling(ws, data) {
    const { room } = data;
    
    if (!rooms.has(room)) {
        return;
    }
    
    const roomParticipants = rooms.get(room);
    
    // Forward signaling message to all other participants in the room
    roomParticipants.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                ...data,
                from: ws.username
            }));
        }
    });
}

function handleLeave(ws, data) {
    const { room } = data;
    
    if (rooms.has(room)) {
        const roomParticipants = rooms.get(room);
        roomParticipants.delete(ws);
        
        // Notify others
        roomParticipants.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'user-left',
                    username: ws.username,
                    room: room
                }));
            }
        });
        
        // Clean up empty rooms
        if (roomParticipants.size === 0) {
            rooms.delete(room);
        }
        
        console.log(`${ws.username} left room ${room}`);
    }
}

function handleDisconnect(ws) {
    if (ws.room) {
        handleLeave(ws, { room: ws.room });
    }
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Signaling server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
