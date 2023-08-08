# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
