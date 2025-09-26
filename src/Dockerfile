FROM node:18-alpine

#Setup workdirectory
WORKDIR /app 

#Coppy package files for better caching 
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]