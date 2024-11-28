# Use the official Node.js image as a base
FROM node:16

# Install git
RUN apt-get update && apt-get install -y git

# Remove existing /app directory if it exists
RUN rm -rf /app

# Define build argument for GitHub Personal Access Token (PAT)
ARG GIT_PAT
ENV GIT_PAT=$GIT_PAT

RUN echo $GIT_PAT

# Clone the repository using the PAT for authentication
RUN bash -c "git clone https://$GIT_PAT@github.com/j-byron/autoCommiter.git /app"

# Set the working directory inside the container
WORKDIR /app

# Install the dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Set the command to run the app
CMD ["npm", "start"]
