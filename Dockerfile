# Build stage - Using Red Hat UBI Node.js image
FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS builder

# Use the default working directory for UBI nodejs (already has correct permissions)
WORKDIR /opt/app-root/src

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - Using nginx unprivileged from Quay.io
FROM quay.io/nginx/nginx-unprivileged:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /opt/app-root/src/dist /usr/share/nginx/html

# Copy env config script
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Expose port 8080 (already default for nginx-unprivileged)
EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
