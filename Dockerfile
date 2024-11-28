# Use the official Node.js image as a base
FROM node:16

# Install git
RUN apt-get update && apt-get install -y git

# Set the working directory inside the container
WORKDIR /

# Copy your package.json and package-lock.json (if it exists) into the container
COPY package*.json ./

# Clone the Git repository into the container
RUN git clone https://github.com/j-byron/autoCommiter.git .


# Install the dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Set the command to run the app
CMD ["npm", "start"]
