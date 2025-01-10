FROM node:20-alpine

# Install git and required dependencies
RUN apk add --no-cache git

WORKDIR /home/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install bun, yarn, and pnpm globally using npm
RUN npm install -g pnpm

# Copy application files with explicit paths
COPY ./main.sh ./main.sh
COPY ./script.js ./script.js

# Make scripts executable and verify
RUN chmod +x main.sh script.js && \
    ls -la /home/app && \
    cat /home/app/main.sh

# Add shell
RUN apk add --no-cache bash

# Set shell and entrypoint
SHELL ["/bin/bash", "-c"]
ENTRYPOINT ["/bin/bash", "/home/app/main.sh"]







# FROM ubuntu:focal

# RUN apt-get update
# RUN apt-get install -y curl
# RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
# RUN apt-get upgrade -y
# RUN apt-get install -y nodejs

# RUN apt-get install git -y

# WORKDIR /home/app

# COPY package*.json .
# RUN npm install

# COPY main.sh main.sh
# COPY script.js script.js
# # COPY kafka.pem kafka.pem


# RUN chmod +x main.sh
# RUN chmod +x script.js

# ENTRYPOINT [ "/home/app/main.sh" ]
