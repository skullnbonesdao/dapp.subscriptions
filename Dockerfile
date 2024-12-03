# Use Node.js base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./


# Install dependencies (only production)
RUN yarn install


COPY tsconfig.json ./
COPY src ./src


# Specify the command to run your app
CMD ["npm", "run start"]
