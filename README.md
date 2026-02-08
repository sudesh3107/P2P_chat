# P2P Chat Application with Signaling Server

A Open-Source, WhatsApp-like peer-to-peer communication application with text chat and voice calling capabilities.

## 🚀 Features

- ✅ **Text Messaging** - Real-time P2P text chat
- ✅ **Voice Calling** - High-quality peer-to-peer voice calls
- ✅ **End-to-End Encryption** - Messages sent directly between peers via WebRTC
- ✅ **Room-based Chat** - Simple room codes to connect with others
- ✅ **Multi-user Support** - Multiple participants per room
- ✅ **WhatsApp-like UI** - Modern, intuitive interface
- ✅ **Production Ready** - WebSocket signaling server for reliable connections

## 📁 Project Structure

```
p2p-chat/
├── signaling-server.js    # WebSocket signaling server
├── package.json            # Node.js dependencies
├── public/
│   └── index.html         # Client application
└── README.md              # This file
```

## 🛠️ Installation

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn

### Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Start the signaling server:**

```bash
npm start
```

The server will start on `http://localhost:3000`

For development with auto-reload:

```bash
npm run dev
```

## 💻 Usage

### Local Testing

1. Start the signaling server (see above)
2. Open your browser and go to `http://localhost:3000`
3. Enter your name and create a room code
4. Share the room code with others
5. Others can join by entering the same room code
6. Start chatting and making voice calls!

### Testing on Different Devices

1. Make sure all devices are on the same network
2. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr` (look for inet)
3. On other devices, connect to: `ws://YOUR_IP:3000` (e.g., `ws://192.168.1.100:3000`)

## 🌐 Deployment

### Deploy to Cloud Platform

#### Option 1: Heroku

1. Create a `Procfile`:
```
web: node signaling-server.js
```

2. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

3. Update client to use: `wss://your-app-name.herokuapp.com`

#### Option 2: DigitalOcean / AWS / Google Cloud

1. Set up a VM with Node.js
2. Clone your repository
3. Install dependencies: `npm install`
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start signaling-server.js
pm2 save
pm2 startup
```

5. Set up Nginx as reverse proxy with SSL:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

6. Get SSL certificate with Let's Encrypt:
```bash
sudo certbot --nginx -d your-domain.com
```

7. Update client to use: `wss://your-domain.com`

#### Option 3: Railway / Render

1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Deploy automatically on push

### Environment Variables

For production, you can use environment variables:

```javascript
const PORT = process.env.PORT || 3000;
```

Set in your hosting platform:
- Heroku: `heroku config:set PORT=3000`
- Railway/Render: Set in dashboard

## 🔒 Security Considerations

### For Production Use:

1. **Enable HTTPS/WSS** - Always use secure connections in production
2. **Rate Limiting** - Add rate limiting to prevent abuse:
```javascript
npm install express-rate-limit
```

3. **Room Authentication** - Add password protection for rooms
4. **User Limits** - Limit users per room to prevent overload
5. **Message Validation** - Validate all incoming messages
6. **CORS Configuration** - Properly configure CORS for your domain

### Example Security Enhancements:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## 🧪 Testing

### Test Locally

1. Open multiple browser tabs/windows
2. Connect each to the same room code
3. Test text messaging
4. Test voice calls (requires microphone access)

### Test Across Network

1. Use your local IP address
2. Connect from different devices
3. Verify messages and calls work across devices

## 🐛 Troubleshooting

### "Connection failed" error
- Check if the signaling server is running
- Verify the server URL is correct
- Check firewall settings

### Voice call not working
- Grant microphone permissions in browser
- Check if both peers are connected
- Verify STUN servers are accessible

### Messages not sending
- Ensure peer connection is established (status shows "Connected to peer")
- Check browser console for errors
- Verify data channel is open

### WebRTC connection fails
- This is usually due to NAT/firewall issues
- For production, consider adding TURN servers:

```javascript
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:your-turn-server.com:3478',
            username: 'username',
            credential: 'password'
        }
    ]
};
```

Free TURN servers: [https://www.metered.ca/tools/openrelay/](https://www.metered.ca/tools/openrelay/)

## 📝 Development

### Adding Features

The codebase is modular and easy to extend:

- **Text formatting**: Add to message rendering in `addMessage()`
- **File sharing**: Extend data channel to handle binary data
- **Video calls**: Add video tracks to WebRTC connection
- **Message history**: Add storage (localStorage or database)
- **Typing indicators**: Send typing events through data channel

### Code Structure

**Server (`signaling-server.js`):**
- WebSocket connection handling
- Room management
- Signal forwarding

**Client (`public/index.html`):**
- UI components
- WebRTC peer connection
- Data channel messaging
- Voice call handling

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Video calling support
- File sharing
- Message encryption visualization
- Mobile app (React Native)
- Desktop app (Electron)
- Group voice calls
- Screen sharing

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🔗 Resources

- [WebRTC Documentation](https://webrtc.org/getting-started/overview)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [STUN/TURN Servers](https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b)

## 💡 Tips

- **Room Codes**: Use memorable codes like "office-chat" or "family-2024"
- **Network**: Works best on same network or with public TURN server
- **Browsers**: Chrome, Firefox, Edge, Safari all supported
- **Mobile**: Fully responsive, works on phones and tablets

## ⚡ Quick Start Commands

```bash
# Install and run
npm install && npm start

# Development mode
npm run dev

# Production deployment
pm2 start signaling-server.js --name p2p-chat
```

---

**Need help?** Check the browser console for detailed error messages and connection logs.
