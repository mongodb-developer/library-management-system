# Pinned base image. Keep this at node:24.22.1-slim or later: earlier 24.x
# releases are missing an upstream security fix.
FROM node:24.22.2-slim
WORKDIR /usr/app

# Install dependencies from the lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Build the project.
COPY . .
RUN npm run build

# Run the web service on container startup.
CMD ["node", "dist/server.js"]
