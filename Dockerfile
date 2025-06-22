# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 8080

# Start the Next.js app
CMD ["npx", "next", "start", "-p", "8080"] 