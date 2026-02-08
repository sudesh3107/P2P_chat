# Dockerfile for P2P Chat Application

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY signaling-server.js ./
COPY public ./public

# Expose port
EXPOSE 3000

# Set environment variable
ENV PORT=3000

# Start the server
CMD ["node", "signaling-server.js"]
