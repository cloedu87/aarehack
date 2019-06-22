FROM node:10
WORKDIR /app
COPY package*.json ./

# build app; for production use RUN npm ci --only=production
RUN npm install

# Bundle app source
COPY server .

#map app to port 3000
EXPOSE 3000

#run the app
CMD ["npm", "start"]

USER node