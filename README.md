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
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sudesh3107/P2P_chat
cd P2P_chat

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

The server will start on `http://localhost:3000`

### Alternative: Using Setup Script

```bash
chmod +x setup.sh
./setup.sh
npm start
```

---

## 💻 How to Use

### Starting a Chat

1. **Open the app** in your browser at `http://localhost:3000`

2. **Enter your name** in the "Your Name" field

3. **Create or enter a room code**
   - Create: Choose any unique code (e.g., "team-meeting", "family-chat")
   - Join: Enter the same code as your friend

4. **Click "Connect"**

5. **Share the room code** with others you want to chat with

6. **Start messaging!** Type your message and press Enter or click Send

### Making Voice Calls

1. **Ensure you're connected** to a peer (status shows "Connected to peer")

2. **Click the phone icon** 📞 in the top right

3. **Grant microphone permission** when prompted by your browser

4. **Wait for the other person to answer**

5. **Talk freely** - your call is peer-to-peer encrypted!

6. **Click the red phone icon** 📵 to end the call

### Connecting from Other Devices

**On the same network:**
1. Find your computer's IP address:
   - Windows: Open CMD and type `ipconfig`
   - Mac/Linux: Open Terminal and type `ifconfig` or `ip addr`
   - Look for your local IP (e.g., `192.168.1.100`)

2. On other devices, change the server URL to:
   ```
   ws://192.168.1.100:3000
   ```

3. Enter the same room code and connect!


## 📝 Usage Tips

✅ **Room codes are case-sensitive** - "TeamChat" ≠ "teamchat"

✅ **Use memorable codes** - "monday-standup" is better than "x7k2p"

✅ **Microphone access required** - Grant permissions for voice calls

✅ **Works on mobile** - Fully responsive design

✅ **No registration needed** - Just enter a name and start chatting

✅ **Private by default** - Messages are never stored on the server

---

## 🐳 Docker Installation (Alternative)

```bash
# Using Docker Compose
docker-compose up -d

# Or using Docker directly
docker build -t p2p-chat .
docker run -d -p 3000:3000 p2p-chat
```

Access at `http://localhost:3000`

---

## 🛠️ Development Mode

```bash
# Install dependencies
npm install

# Run with auto-reload (requires nodemon)
npm run dev
```

---

## ⚙️ Configuration

### Change Server Port

Edit `signaling-server.js` or set environment variable:
```bash
PORT=8080 npm start
```

### Update Server URL in Client

For production, update the server URL in the client:
1. Open `public/index.html`
2. Find the server URL input field
3. Change default value from `ws://localhost:3000` to your server URL

Or users can manually enter the server URL in the UI.

---

## 🔍 Troubleshooting

**Can't connect to server?**
- Check if server is running: `npm start`
- Verify the server URL is correct
- Check firewall settings

**Voice calls not working?**
- Grant microphone permissions
- Ensure both users are connected (green "Connected to peer" status)
- Try refreshing the page

**Messages not sending?**
- Verify peer connection is established
- Check browser console for errors (F12)
- Make sure both users are in the same room

For more help, see the full documentation in [README.md](README.md)
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
