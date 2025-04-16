FROM node:20.12.0-slim

# Install LibreOffice and other dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    fonts-liberation \
    fonts-dejavu \
    wget \
    curl \
    gnupg \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Create directories for temp files and output
RUN mkdir -p /usr/src/app/temp /usr/src/app/public/pdf

# Copy package files
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Ensure correct permissions
RUN chmod -R 777 /usr/src/app/temp
RUN chmod -R 777 /usr/src/app/public/pdf

# Expose port
EXPOSE 7000

# Start the application
CMD [ "node", "./dist/main" ]