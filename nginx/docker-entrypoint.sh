#!/usr/bin/env sh
set -e

# Ensure env.js is generated with runtime values using envsubst

TEMPLATE='/usr/share/nginx/html/env.js'

# Create a template and use envsubst to substitute environment variables
cat > "$TEMPLATE" <<'EOF'
window.env = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_AUDIENCE_API_URL: "${VITE_AUDIENCE_API_URL}",
  VITE_MY_TOKEN: "${VITE_MY_TOKEN}",
  VITE_CLOUD_INSTANCE: "${VITE_CLOUD_INSTANCE}",
  VITE_TENANT_ID: "${VITE_TENANT_ID}",
  VITE_CLIENT_ID: "${VITE_CLIENT_ID}",
  VITE_REDIRECT_URI: "${VITE_REDIRECT_URI}",
};
EOF

# Use envsubst to substitute the environment variables
envsubst < "$TEMPLATE" > "$TEMPLATE.tmp" && mv "$TEMPLATE.tmp" "$TEMPLATE"

exit 0


