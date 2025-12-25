#!/bin/sh

# Replace environment variables in the built app
# This allows runtime configuration via environment variables

if [ -n "$RHBK_AUTHORITY" ]; then
  echo "Configuring RHBK authority: $RHBK_AUTHORITY"
fi

# Create runtime config
cat > /usr/share/nginx/html/config.js << EOF
window.RHBK_AUTHORITY = "${RHBK_AUTHORITY:-}";
window.RHBK_CLIENT_ID = "${RHBK_CLIENT_ID:-rhbk-demo}";
window.RHBK_CLIENT_SECRET = "${RHBK_CLIENT_SECRET:-}";
EOF

# Inject config script into index.html
sed -i 's|</head>|<script src="/config.js"></script></head>|' /usr/share/nginx/html/index.html

# Start nginx
exec "$@"

