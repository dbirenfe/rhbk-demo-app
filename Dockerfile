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

# Switch to root to set up permissions
USER root

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /opt/app-root/src/dist /usr/share/nginx/html

# Copy env config script
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Set permissions for OpenShift (random UID with GID 0)
# OpenShift runs containers with arbitrary UIDs but GID 0, so we need group write permissions
RUN chmod +x /docker-entrypoint.sh && \
    chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Switch back to non-root user (nginx user ID is 101)
USER 101

# Expose port 8080
EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
