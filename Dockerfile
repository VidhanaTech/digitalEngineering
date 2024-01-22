FROM node:16 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the application
RUN npm run build

#Nginx part
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (change in case of other ports)
EXPOSE 80

# Start Nginx on g
CMD ["nginx", "-g", "daemon off;"]
