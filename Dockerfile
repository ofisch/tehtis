# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the frontend
RUN npm run build

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
