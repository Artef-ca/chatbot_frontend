# Use a lightweight Node.js image
FROM node:18-bullseye-slim

# Install gettext for envsubst
RUN apt-get update && apt-get install -y gettext && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the Svelte app for production
RUN npm run build

# Expose the port
EXPOSE 5000

# Inject environment variables into env.js and start the app
# CMD ["/bin/sh", "-c", "envsubst < ./template/env.template.js > ./public/env.js && npm run preview"]
# CMD ["/bin/sh", "-c", "mkdir -p ./public && echo \"window.env = { VITE_API_URL: '\"$VITE_API_URL\"' };\" > ./public/env.js && npm run preview"]
# CMD ["/bin/sh", "-c", "cp ./public/env.js ./dist/env.js && npm run preview"]
# CMD ["/bin/sh", "-c", "envsubst < ./template/env.template.js > ./public/env.js && cp ./public/env.js ./dist/env.js && npm run preview"]
CMD ["/bin/sh", "-c", "envsubst < ./template/env.template.js > ./public/env.js && cp ./public/env.js ./dist/env.js && cat ./dist/env.js && npm run preview"]
