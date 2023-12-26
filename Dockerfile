# Use an official Node.js LTS (Long Term Support) image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

# Build the Vite project
RUN npm run build

# Expose the port that your Vite application will run on
EXPOSE 5173

# Define the command to run your Vite application
CMD ["npm", "run", "dev"]
