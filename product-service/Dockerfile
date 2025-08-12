# Use the official Node.js 20 image as the base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy shared Kafka Wrapper first, since it changes less often
# The '..' is a relative path to the parent directory on the host machine
COPY ../kafka-wrapper ./kafka-wrapper

# Copy package.json and package-lock.json to leverage Docker's build cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's code into the container
COPY . .

# Expose the port the service will listen on
EXPOSE 5002

# The command to start the service
CMD ["node", "index.js"]