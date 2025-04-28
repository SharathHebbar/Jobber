# ---- Stage 1: Build ----
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the Vite app
RUN npm run build

# ---- Stage 2: Production ----
FROM nginx:alpine

# Set the default working directory
WORKDIR /usr/share/nginx/html

# Copy the built Vite app from the builder stage
COPY --from=builder /app/dist .

# Expose port 80
EXPOSE 80

# Start the Nginx server to serve the app
CMD ["nginx", "-g", "daemon off;"]
