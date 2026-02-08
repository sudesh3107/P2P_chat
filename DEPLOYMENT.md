# Deployment Guide

This guide covers various deployment options for the P2P Chat application.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Platforms](#cloud-platforms)
4. [VPS Deployment](#vps-deployment)
5. [SSL/HTTPS Setup](#ssl-https-setup)

---

## Local Development

### Quick Start
```bash
# Run setup script
./setup.sh

# Start server
npm start
```

### Manual Setup
```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Start in production mode
npm start
```

Access at: `http://localhost:3000`

---

## Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Using Docker directly
```bash
# Build image
docker build -t p2p-chat .

# Run container
docker run -d -p 3000:3000 --name p2p-chat p2p-chat

# View logs
docker logs -f p2p-chat

# Stop
docker stop p2p-chat
```

---

## Cloud Platforms

### Heroku

1. **Create app:**
```bash
heroku create your-app-name
```

2. **Create Procfile:**
```
web: node signaling-server.js
```

3. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

4. **Update client URL:**
Change server URL to: `wss://your-app-name.herokuapp.com`

### Railway

1. Connect GitHub repository
2. Add these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Port:** 3000

3. Deploy automatically on git push

### Render

1. Create new "Web Service"
2. Connect repository
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Port:** 3000

4. Deploy

### DigitalOcean App Platform

1. Create app from GitHub
2. Configure:
   - **Run Command:** `npm start`
   - **HTTP Port:** 3000

3. Deploy

---

## VPS Deployment

### Prerequisites
- Ubuntu 20.04+ or similar
- Root/sudo access
- Domain name (optional but recommended)

### Step 1: Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /var/www/p2p-chat
sudo chown $USER:$USER /var/www/p2p-chat
```

### Step 2: Deploy Application

```bash
# Clone or upload your code
cd /var/www/p2p-chat
# Upload your files here

# Install dependencies
npm install --production

# Start with PM2
pm2 start signaling-server.js --name p2p-chat

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 3: Install Nginx

```bash
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/p2p-chat
```

Add this configuration:

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/p2p-chat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Firewall Setup

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Test renewal
sudo certbot renew --dry-run
```

Your site is now available at `https://your-domain.com`

**Update client to use:** `wss://your-domain.com`

### Manual SSL Certificate

If you have your own SSL certificate:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Environment Variables

### Production Environment

Create `.env` file:
```bash
PORT=3000
NODE_ENV=production
```

Update `signaling-server.js` to use:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

Install dotenv:
```bash
npm install dotenv
```

---

## Monitoring and Maintenance

### PM2 Monitoring

```bash
# View all processes
pm2 list

# View logs
pm2 logs p2p-chat

# Monitor resources
pm2 monit

# Restart app
pm2 restart p2p-chat

# Stop app
pm2 stop p2p-chat
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Application Logs

Add logging to your application:

```javascript
const fs = require('fs');
const logStream = fs.createWriteStream('./app.log', { flags: 'a' });

console.log = function(msg) {
    logStream.write(new Date().toISOString() + ' - ' + msg + '\n');
    process.stdout.write(msg + '\n');
};
```

---

## Scaling Considerations

### Horizontal Scaling

For multiple servers, you'll need:

1. **Redis for session sharing:**
```bash
npm install redis
```

2. **Load balancer** (Nginx, HAProxy, or cloud load balancer)

3. **Shared signaling state** across servers

### Vertical Scaling

For a single powerful server:
- Increase process limits
- Use PM2 cluster mode:
```bash
pm2 start signaling-server.js -i max
```

---

## Troubleshooting

### Can't connect to server
- Check if server is running: `pm2 list`
- Check firewall: `sudo ufw status`
- Check Nginx: `sudo systemctl status nginx`
- Check logs: `pm2 logs p2p-chat`

### WebSocket connection fails
- Ensure Nginx is properly configured for WebSocket
- Check SSL certificate is valid
- Verify proxy headers are set correctly

### High CPU/Memory usage
- Check for memory leaks
- Implement connection limits
- Use PM2 cluster mode
- Add rate limiting

---

## Security Checklist

- [ ] Use HTTPS/WSS in production
- [ ] Implement rate limiting
- [ ] Set up firewall (ufw)
- [ ] Keep Node.js and dependencies updated
- [ ] Use environment variables for sensitive data
- [ ] Implement authentication for rooms
- [ ] Set up monitoring and alerts
- [ ] Regular backups
- [ ] Use strong SSL/TLS configuration
- [ ] Implement CORS properly

---

## Performance Optimization

1. **Enable gzip compression** in Nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Set up caching:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

3. **Use CDN** for static assets

4. **Implement connection pooling**

5. **Add TURN servers** for better connectivity

---

## Support

For issues or questions:
- Check application logs: `pm2 logs`
- Check Nginx logs: `/var/log/nginx/`
- Test WebSocket: Use online WebSocket testers
- Browser console: Check for JavaScript errors

---

**Remember:** Always test your deployment in a staging environment before going to production!
